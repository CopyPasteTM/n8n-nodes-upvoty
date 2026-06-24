import type { INodeProperties } from 'n8n-workflow';

export const feedbackCommentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['feedbackComment'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a comment' },
			{ name: 'Delete', value: 'delete', action: 'Delete a comment' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many comments' },
		],
		default: 'create',
	},
];

export const feedbackCommentFields: INodeProperties[] = [
	{
		displayName: 'Feedback ID',
		name: 'feedbackId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The ID of the feedback item to comment on',
		displayOptions: { show: { resource: ['feedbackComment'] } },
	},

	// ------ Create ------
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		typeOptions: { rows: 3 },
		default: '',
		description: 'The comment text',
		displayOptions: { show: { resource: ['feedbackComment'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['feedbackComment'], operation: ['create'] } },
		options: [
			{
				displayName: 'Author Name or ID',
				name: 'author_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description: 'The user to set as comment author. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Internal',
				name: 'internal',
				type: 'boolean',
				default: false,
				description: 'Whether this is an internal note (not visible to the feedback author)',
			},
			{
				displayName: 'Notify Voters',
				name: 'notify_voters',
				type: 'boolean',
				default: false,
				description: 'Whether to send an email notification to all voters of the feedback item (secret key only, ignored for internal comments)',
			},
			{
				displayName: 'Private',
				name: 'private',
				type: 'boolean',
				default: false,
				description: 'Whether this comment is private (only visible to team members)',
			},
			{
				displayName: 'Reply To Comment ID',
				name: 'reply_to_comment',
				type: 'string',
				default: '',
				description: 'The ID of the comment to reply to (creates a threaded reply)',
			},
		],
	},

	// ------ Delete ------
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The ID of the comment to delete',
		displayOptions: { show: { resource: ['feedbackComment'], operation: ['delete'] } },
	},

	// ------ Get Many ------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['feedbackComment'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['feedbackComment'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
];
