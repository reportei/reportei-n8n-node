import { INodeProperties } from 'n8n-workflow';

/**
 * --------------------------------------------------------
 *  Dashboard Operations
 * --------------------------------------------------------
 */
export const dashboardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new dashboard in Reportei',
				action: 'Create a dashboard',
			},
			// Caso no futuro você adicione outras operações (ex: update, list),
			// basta acrescentar aqui.
		],
		default: 'create',
		displayOptions: {
			show: {
				resource: ['dashboard'],
			},
		},
	},
];

/**
 * --------------------------------------------------------
 *  Dashboard Fields
 * --------------------------------------------------------
 * Estes campos são exibidos quando resource = 'dashboard'
 * e operation = 'create'.
 */
export const dashboardFields: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		default: '',
		description: 'Choose in which project you want to create the dashboard. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['dashboard'],
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
		description: 'Choose which integrations you want to add to the dashboard. First, you must choose a project. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['dashboard'],
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
		description: 'Define a title for your dashboard',
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Subtitle',
		name: 'reportSubtitle',
		type: 'string',
		default: '',
		description: 'Define a subtitle for your dashboard',
		displayOptions: {
			show: {
				resource: ['dashboard'],
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
				resource: ['dashboard'],
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
				resource: ['dashboard'],
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
				resource: ['dashboard'],
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
				resource: ['dashboard'],
				operation: ['create'],
			},
		},
	},
];
