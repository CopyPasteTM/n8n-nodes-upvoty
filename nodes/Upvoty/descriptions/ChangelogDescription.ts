import type { INodeProperties } from 'n8n-workflow';

export const changelogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['changelog'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a changelog entry' },
			{ name: 'Delete', value: 'delete', action: 'Delete a changelog entry' },
			{ name: 'Get', value: 'get', action: 'Get a changelog entry' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many changelog entries' },
			{ name: 'Publish', value: 'publish', action: 'Publish a changelog entry' },
			{ name: 'Unpublish', value: 'unpublish', action: 'Unpublish a changelog entry' },
			{ name: 'Update', value: 'update', action: 'Update a changelog entry' },
		],
		default: 'create',
	},
];

export const changelogFields: INodeProperties[] = [
	// ------ Create ------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		description: 'The title of the changelog entry',
		displayOptions: { show: { resource: ['changelog'], operation: ['create'] } },
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		required: true,
		typeOptions: { rows: 6 },
		default: '',
		description: 'The body content of the changelog entry (supports HTML)',
		displayOptions: { show: { resource: ['changelog'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['changelog'], operation: ['create'] } },
		options: [
			{
				displayName: 'Author Name or ID',
				name: 'author_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getTeamMembers' },
				default: '',
				description: 'The team member to set as author. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Notify Subscribers',
				name: 'notify_subscribers',
				type: 'boolean',
				default: false,
				description: 'Whether to notify subscribers when the entry is published (only applies when published is true)',
			},
			{
				displayName: 'Publish Immediately',
				name: 'published',
				type: 'boolean',
				default: false,
				description: 'Whether to publish the entry immediately after creation',
			},
			{
				displayName: 'Published At',
				name: 'published_at',
				type: 'dateTime',
				default: '',
				description: 'The publish date/time (ISO 8601). If not set and published is true, defaults to now.',
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getChangelogTags' },
				default: [],
				description: 'Tags to assign. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// ------ Get / Update / Delete / Publish / Unpublish ------
	{
		displayName: 'Changelog ID',
		name: 'changelogId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The ID of the changelog entry',
		displayOptions: { show: { resource: ['changelog'], operation: ['get', 'update', 'delete', 'publish', 'unpublish'] } },
	},

	// ------ Get: Simplify ------
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['changelog'], operation: ['get'] } },
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},

	// ------ Get Many ------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['changelog'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['changelog'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},

	// ------ Update ------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['changelog'], operation: ['update'] } },
		options: [
			{
				displayName: 'Author Name or ID',
				name: 'author_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getTeamMembers' },
				default: '',
				description: 'The team member to set as author. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 6 },
				default: '',
				description: 'The body content of the changelog entry',
			},
			{
				displayName: 'Published',
				name: 'published',
				type: 'boolean',
				default: false,
				description: 'Whether the entry is published',
			},
			{
				displayName: 'Published At',
				name: 'published_at',
				type: 'dateTime',
				default: '',
				description: 'The publish date/time (ISO 8601)',
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getChangelogTags' },
				default: [],
				description: 'Tags to assign. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the changelog entry',
			},
		],
	},
];
