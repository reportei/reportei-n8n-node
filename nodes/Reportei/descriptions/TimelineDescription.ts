import { INodeProperties } from 'n8n-workflow';

export const timelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add an event (milestone) to the timeline in Reportei',
				action: 'Add event to timeline',
			},
		],
		default: 'create',
		displayOptions: {
			show: {
				resource: ['timeline'],
			},
		},
	},
];

export const timelineFields: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		default: '',
		description: 'Project for which to create the timeline event. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getClients',
		},
	},
	{
		displayName: 'Title',
		name: 'milestoneTitle',
		type: 'string',
		default: '',
		description: 'Define a title for your milestone',
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Details',
		name: 'milestoneDetails',
		type: 'string',
		default: '',
		description: 'Add details for your timeline milestone',
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Report Name or ID',
		name: 'reportId',
		type: 'options',
		default: '',
		description: 'Choose a report or dashboard to add to the timeline milestone. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getReports',
			loadOptionsDependsOn: ['projectId'],
		},
	},
];
