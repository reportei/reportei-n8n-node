import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IWebhookResponseData,
} from 'n8n-workflow';

export class ReporteiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Reportei Trigger',
		name: 'reporteiTrigger',
		icon: 'file:reportei.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Reportei events via webhooks',
		defaults: {
			name: 'Reportei Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'reporteiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Project Name or ID',
				name: 'clientId',
				type: 'options',
				default: '',
				required: true,
				description: 'Select the project to which you want to add the trigger. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getClients',
				},
			},
			{
				displayName: 'Event Type',
				name: 'event',
				type: 'options',
				options: [
					{ name: 'Automation Executed', value: 'automation_executed' },
					{ name: 'Control Goal Met', value: 'control_goal_met' },
					{ name: 'Control Goal Not Met', value: 'control_goal_not_met' },
					{ name: 'Dashboard Created', value: 'dashboard_created' },
					{ name: 'Report Created', value: 'report_created' },
					{ name: 'Timeline Milestone Added', value: 'timeline_milestone_added' },
				],
				default: 'report_created',
				required: true,
				description: 'Which event to subscribe to',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
	};

	/**
	 * Precisamos mover `checkExists`, `create`, `delete` para dentro de webhookMethods.default
	 */
	webhookMethods = {
		default: {
			/**
			 * Não podemos listar para checar duplicação => sempre retorna false
			 */
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			/**
			 * Cria a subscrição quando o fluxo é ativado
			 * Precisamos enviar: client_id, source= 'n8n', url e event_type
			 */
			async create(this: IHookFunctions): Promise<boolean> {
				const clientId = this.getNodeParameter('clientId') as number;
				const event = this.getNodeParameter('event') as string;

				// Gera a URL pública do webhook do n8n
				const webhookUrl = this.getNodeWebhookUrl('default');

				// Monta o body conforme doc do Reportei
				const body = {
					client_id: clientId,
					source: 'n8n',
					url: webhookUrl,
					event_type: event,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'reporteiApi',
					{
						method: 'POST',
						url: ' https://app.reportei.com/api/v1/webhooks/subscribe',
						body,
						json: true,
					},
				);

				if (response?.id) {
					this.getWorkflowStaticData('node').webhookId = response.id;
				}

				return true;
			},
			/**
			 * Remove a subscrição quando o fluxo é desativado.
			 */
			async delete(this: IHookFunctions): Promise<boolean> {
				const clientId = this.getNodeParameter('clientId') as number;
				const event = this.getNodeParameter('event') as string;
				const webhookUrl = this.getNodeWebhookUrl('default');

				const body = {
					client_id: clientId,
					source: 'n8n',
					event_type: event,
					url: webhookUrl,
				};

				await this.helpers.httpRequestWithAuthentication.call(
					this,
					'reporteiApi',
					{
						method: 'POST',
						url: '  https://app.reportei.com/api/v1/webhooks/unsubscribe',
						body,
						json: true,
					},
				);

				delete this.getWorkflowStaticData('node').webhookId;
				return true;
			},
		},
	};

	/**
	 * Adicionamos a função getClients para carregar dinamicamente
	 */
	methods = {
		loadOptions: {
			async getClients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'reporteiApi',
					{
						method: 'GET',
						url: ' https://app.reportei.com/api/v1/clients?per_page=1000',
						json: true,
					},
				);

				for (const client of response.data) {
					returnData.push({
						name: client.name,
						value: client.id,
					});
				}
				return returnData;
			},
		},
	};

	/**
	 * Agora o método webhook deve retornar `IWebhookResponseData`.
	 * E ao invés de this.getBody(), usamos `this.getRequestObject().body`.
	 */
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Captura o corpo da requisição POST que chegou
		const req = this.getRequestObject();
		const bodyData = req.body as IDataObject;

		// Retornamos um objeto IWebhookResponseData
		return {
			workflowData: [
				[
					{
						json: bodyData,
					},
				],
			],
		};
	}
}
