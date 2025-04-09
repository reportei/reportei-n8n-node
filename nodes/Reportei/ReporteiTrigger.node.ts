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
				description: 'Select the project to which you want to add the trigger. Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
			{
				displayName: 'Custom Webhook Base URL',
				name: 'customWebhookBaseUrl',
				type: 'string',
				default: '',
				placeholder: 'https://your-domain.com',
				description: 'If you are behind a tunnel or need a specific domain, provide your public base URL here. The node will replace the default localhost address with this URL.',
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

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const clientId = this.getNodeParameter('clientId') as number;
				const event = this.getNodeParameter('event') as string;
				let webhookUrl = this.getNodeWebhookUrl('default') as string;
			
				const customBase = this.getNodeParameter('customWebhookBaseUrl', 0) as string || '';
				if (customBase) {
					webhookUrl = replaceBaseUrl(webhookUrl, customBase);
				}
			
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
						url: 'https://app.reportei.com/api/v1/webhooks/subscribe',
						body,
						json: true,
					},
				);
			
				if (response?.id) {
					this.getWorkflowStaticData('node').webhookId = response.id;
				}
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const clientId = this.getNodeParameter('clientId') as number;
				const event = this.getNodeParameter('event') as string;
				let webhookUrl = this.getNodeWebhookUrl('default') as string;

				const customBase = this.getNodeParameter('customWebhookBaseUrl', 0) as string || '';
				if (customBase) {
					webhookUrl = replaceBaseUrl(webhookUrl, customBase);
				}

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
						url: 'https://app.reportei.com/api/v1/webhooks/unsubscribe',
						body,
						json: true,
					},
				);

				delete this.getWorkflowStaticData('node').webhookId;
				return true;
			},
		},
	};

	methods = {
		loadOptions: {
			async getClients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'reporteiApi',
					{
						method: 'GET',
						url: 'https://app.reportei.com/api/v1/clients?per_page=1000',
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

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const bodyData = req.body as IDataObject;

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

function replaceBaseUrl(originalUrl: string, customBase: string): string {
	const path = extractPathFromUrl(originalUrl);

	const sanitizedBase = customBase.replace(/\/+$/, '');
	
	return `${sanitizedBase}${path}`;
}

function extractPathFromUrl(fullUrl: string): string {
	try {
		const urlObj = new URL(fullUrl);
		return urlObj.pathname + (urlObj.search || '');
	} catch {
		return '/webhook';
	}
}
