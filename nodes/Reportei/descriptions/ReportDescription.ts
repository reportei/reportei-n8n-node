import { INodeProperties } from 'n8n-workflow';

export const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create a Report',
				value: 'create',
				description: 'Creates a new report in Reportei',
				action: 'Create a report',
			},
		],
		default: 'create',
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
	},
];

export const reportFields: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		default: '',
		description: 'Choose in which project you want to create the dashboard. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getClients',
		},
	},

	{
		displayName: 'Integration Names or IDs',
		name: 'integrationsIds',
		type: 'multiOptions',
		default: [],
		description: 'Choose which integrations you want to add to the dashboard. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getIntegrations',
			loadOptionsDependsOn: ['projectId'],
		},
	},

	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'options',
		default: '',
		description: 'Choose a template for your report (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTemplates',
		},
	},

	{
		displayName: 'Title',
		name: 'reportTitle',
		type: 'string',
		default: '',
		description: 'Define a title for your report',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
	},

	{
		displayName: 'Subtitle',
		name: 'reportSubtitle',
		type: 'string',
		default: '',
		description: 'Define a subtitle for your report',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
	},

	{
		displayName: 'Analysis Start',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		description: 'Insert the start date of the analysis period',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Analysis End',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		description: 'Insert the end date of the analysis period',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Comparison Period Start',
		name: 'comparisonStartDate',
		type: 'dateTime',
		default: '',
		description: 'Insert the start date of the comparison period',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Comparison Period End',
		name: 'comparisonEndDate',
		type: 'dateTime',
		default: '',
		description: 'Insert the end date of the comparison period',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
	},
];
