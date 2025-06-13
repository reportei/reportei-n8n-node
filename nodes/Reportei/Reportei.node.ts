import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IDataObject,
} from 'n8n-workflow';

import { reportOperations, reportFields } from './descriptions/ReportDescription';
import { dashboardOperations, dashboardFields } from './descriptions/DashboardDescription';
import { timelineOperations, timelineFields } from './descriptions/TimelineDescription';

import { reporteiApiRequest } from './GenericFunctions';

export class Reportei implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Reportei',
		name: 'reportei',
		icon: 'file:reportei.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Perform actions with Reportei API',
		defaults: {
			name: 'Reportei',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'reporteiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Report', value: 'report' },
					{ name: 'Dashboard', value: 'dashboard' },
					{ name: 'Timeline', value: 'timeline' },
				],
				default: 'report',
				required: true,
				description: 'Choose which resource you want to operate on',
			},

			...reportOperations,
			...reportFields,

			...dashboardOperations,
			...dashboardFields,

			...timelineOperations,
			...timelineFields,
		],
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

			async getIntegrations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const clientId = this.getCurrentNodeParameter('projectId') as string;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'reporteiApi',
					{
						method: 'GET',
						url: `https://app.reportei.com/api/v1/clients/${clientId}/integrations?per_page=1000`,
						json: true,
					},
				);

				for (const integration of response.data) {
					returnData.push({
						name: integration.full_name,
						value: integration.id,
					});
				}
				return returnData;
			},

			async getReports(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const clientId = this.getCurrentNodeParameter('projectId') as string;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'reporteiApi',
					{
						method: 'GET',
						url: `https://app.reportei.com/api/v1/clients/${clientId}/reports?per_page=1000`,
						json: true,
					},
				);

				for (const report of response.data) {
					returnData.push({
						name: report.title,
						value: report.id,
					});
				}
				return returnData;
			},

			async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				try {
					const clientId = this.getCurrentNodeParameter('projectId') as string;
					
					const urls: string[] = [
						'https://app.reportei.com/api/v1/templates',
						'https://app.reportei.com/api/v1/template',
						'https://app.reportei.com/api/v1/report-templates'
					];
					
					if (clientId) {
						urls.unshift(`https://app.reportei.com/api/v1/clients/${clientId}/templates`);
					}
					
					let response = null;
					
					for (const url of urls) {
						try {
							response = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'reporteiApi',
								{
									method: 'GET',
									url: url,
									json: true,
								},
							);
							break;
						} catch (urlError) {
							continue;
						}
					}
					
					if (!response) {
						throw new Error('Unable to load templates');
					}

					let templates;
					if (response.data) {
						templates = response.data;
					} else if (Array.isArray(response)) {
						templates = response;
					} else if (response.templates) {
						templates = response.templates;
					} else {
						templates = [];
					}
					
					if (Array.isArray(templates) && templates.length > 0) {
						for (const template of templates) {
							returnData.push({
								name: template.name || template.title || template.label || `Template ${template.id}`,
								value: template.id || template.value,
							});
						}
					} else {
						returnData.push({
							name: 'No templates available',
							value: '',
						});
					}
				} catch (error) {
					returnData.push({
						name: '',
						value: '',
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: IDataObject | undefined;

				if (resource === 'report') {
					if (operation === 'create') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const integrationsIds = this.getNodeParameter('integrationsIds', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const comparisonStartDate = this.getNodeParameter('comparisonStartDate', i) as string;
						const comparisonEndDate = this.getNodeParameter('comparisonEndDate', i) as string;
						const reportTitle = this.getNodeParameter('reportTitle', i) as string;
						const reportSubtitle = this.getNodeParameter('reportSubtitle', i) as string;
						const templateId = this.getNodeParameter('templateId', i, '') as string;

						const body: IDataObject = {
							client_id: projectId,
							selected_sources: integrationsIds,
							analysis_start: startDate,
							analysis_end: endDate,
							comparison_start: comparisonStartDate,
							comparison_end: comparisonEndDate,
							title: reportTitle,
							subtitle: reportSubtitle,
						};

						if (templateId) {
							body.template_id = templateId;
						}

						responseData = await reporteiApiRequest.call(
							this,
							'POST',
							'/create_report',
							body,
						);
					}
				}

				if (resource === 'dashboard') {
					if (operation === 'create') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const integrationsIds = this.getNodeParameter('integrationsIds', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const comparisonStartDate = this.getNodeParameter('comparisonStartDate', i) as string;
						const comparisonEndDate = this.getNodeParameter('comparisonEndDate', i) as string;
						const reportTitle = this.getNodeParameter('reportTitle', i) as string;
						const reportSubtitle = this.getNodeParameter('reportSubtitle', i) as string;
						const templateId = this.getNodeParameter('templateId', i, '') as string;

						const body: IDataObject = {
							client_id: projectId,
							selected_sources: integrationsIds,
							analysis_start: startDate,
							analysis_end: endDate,
							comparison_start: comparisonStartDate,
							comparison_end: comparisonEndDate,
							title: reportTitle,
							subtitle: reportSubtitle,
						};

						if (templateId) {
							body.template_id = templateId;
						}

						responseData = await reporteiApiRequest.call(
							this,
							'POST',
							'/create_dashboard',
							body,
						);
					}
				}

				if (resource === 'timeline') {
					if (operation === 'create') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const milestoneTitle = this.getNodeParameter('milestoneTitle', i) as string;
						const milestoneDetails = this.getNodeParameter('milestoneDetails', i) as string;
						const reportId = this.getNodeParameter('reportId', i) as string;

						const body: IDataObject = {
							client_id: projectId,
							title: milestoneTitle,
							content: milestoneDetails,
							report_id: reportId,
						};

						responseData = await reporteiApiRequest.call(
							this,
							'POST',
							'/add_to_timeline',
							body,
						);
					}
				}

				if (!responseData) {
					responseData = { message: 'No valid operation was performed' };
				}

				returnData.push({
					json: responseData,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
