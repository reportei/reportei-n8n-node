import { INodeProperties } from 'n8n-workflow';

/**
 * --------------------------------------------------------
 *  Report Operations
 * --------------------------------------------------------
 */
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
			// Caso queira adicionar outras operações no futuro, adicione aqui.
		],
		default: 'create',
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
	},
];

/**
 * --------------------------------------------------------
 *  Report Fields
 * --------------------------------------------------------
 * Campos exibidos quando a operação e o resource
 * correspondem a "report" e "create", respectivamente.
 */
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
