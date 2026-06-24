import type { INodeProperties } from 'n8n-workflow';

export const feedbackVoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['feedbackVote'] } },
		options: [
			{ name: 'Add Vote', value: 'add', action: 'Add a vote to feedback' },
			{ name: 'List Votes', value: 'list', action: 'List votes on feedback' },
			{ name: 'Remove Vote', value: 'remove', action: 'Remove a vote from feedback' },
		],
		default: 'add',
	},
];

export const feedbackVoteFields: INodeProperties[] = [
	// ------ Add / Remove Vote ------
	{
		displayName: 'Feedback ID',
		name: 'feedbackId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The ID of the feedback item',
		displayOptions: { show: { resource: ['feedbackVote'], operation: ['add', 'remove'] } },
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The user who votes. If empty, votes as the project owner.',
		displayOptions: { show: { resource: ['feedbackVote'], operation: ['add', 'remove'] } },
	},

	// ------ List ------
	{
		displayName: 'Feedback ID',
		name: 'feedbackId',
		type: 'string',
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-... (leave empty to list across all items)',
		description: 'Restrict to one feedback item. Leave empty to list votes across all items in the project.',
		displayOptions: { show: { resource: ['feedbackVote'], operation: ['list'] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['feedbackVote'], operation: ['list'] } },
		description: 'Additional filters (only applied when Feedback ID is empty)',
		options: [
			{
				displayName: 'Voter ID',
				name: 'voter',
				type: 'string',
				default: '',
				description: 'Filter votes by voter ID',
			},
			{
				displayName: 'Vote Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Up', value: 'up' },
					{ name: 'Down', value: 'down' },
				],
				default: 'up',
				description: 'Filter by vote direction',
			},
			{
				displayName: 'Created After',
				name: 'created_at_gte',
				type: 'dateTime',
				default: '',
				description: 'Only return votes cast on or after this timestamp',
			},
			{
				displayName: 'Created Before',
				name: 'created_at_lte',
				type: 'dateTime',
				default: '',
				description: 'Only return votes cast on or before this timestamp',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['feedbackVote'], operation: ['list'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['feedbackVote'], operation: ['list'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
];
