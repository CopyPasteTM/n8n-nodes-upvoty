import type { INodeProperties } from 'n8n-workflow';

export const roadmapOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['roadmap'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a roadmap item' },
			{ name: 'Delete', value: 'delete', action: 'Delete a roadmap item' },
			{ name: 'Get', value: 'get', action: 'Get a roadmap item' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many roadmap items' },
			{ name: 'Update', value: 'update', action: 'Update a roadmap item' },
		],
		default: 'create',
	},
];

export const roadmapFields: INodeProperties[] = [
	// ------ Create ------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		description: 'The title of the roadmap item',
		displayOptions: { show: { resource: ['roadmap'], operation: ['create'] } },
	},
	{
		displayName: 'Status Name or ID',
		name: 'statusId',
		type: 'options',
		required: true,
		typeOptions: { loadOptionsMethod: 'getRoadmapStatuses' },
		default: '',
		description: 'The status to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show: { resource: ['roadmap'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['roadmap'], operation: ['create'] } },
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'The body content of the roadmap item',
			},
			{
				displayName: 'Launch Date',
				name: 'launch_date',
				type: 'string',
				default: '',
				description: 'The planned launch date (free text, e.g. "Q3 2026" or "2026-06-01")',
			},
		],
	},

	// ------ Get / Update / Delete ------
	{
		displayName: 'Roadmap Item ID',
		name: 'roadmapId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The ID of the roadmap item',
		displayOptions: { show: { resource: ['roadmap'], operation: ['get', 'update', 'delete'] } },
	},

	// ------ Get: Simplify ------
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['roadmap'], operation: ['get'] } },
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},

	// ------ Get Many ------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['roadmap'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['roadmap'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},

	// ------ Update ------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['roadmap'], operation: ['update'] } },
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'The body content of the roadmap item',
			},
			{
				displayName: 'Launch Date',
				name: 'launch_date',
				type: 'string',
				default: '',
				description: 'The planned launch date (free text, e.g. "Q3 2026" or "2026-06-01")',
			},
			{
				displayName: 'Status Name or ID',
				name: 'status_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getRoadmapStatuses' },
				default: '',
				description: 'The status to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the roadmap item',
			},
		],
	},
];
