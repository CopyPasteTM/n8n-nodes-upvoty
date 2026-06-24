import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a user' },
			{ name: 'Get', value: 'get', action: 'Get a user' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many users' },
			{ name: 'Update', value: 'update', action: 'Update a user' },
		],
		default: 'create',
	},
];

export const userFields: INodeProperties[] = [
	// ------ Create ------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. user@example.com',
		description: 'The email address of the user. If email already exists, the existing user is updated and returned.',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'The full name of the user',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		options: [
			{
				displayName: 'Extra Data',
				name: 'extra_data',
				type: 'json',
				default: '{}',
				description: 'Arbitrary key-value metadata to associate with the user (e.g. {"plan": "pro", "company": "Acme"})',
			},
		],
	},

	// ------ Get / Update ------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. a1b2c3d4-e5f6-...',
		description: 'The ID of the user',
		displayOptions: { show: { resource: ['user'], operation: ['get', 'update'] } },
	},

	// ------ Get: Simplify ------
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['user'], operation: ['get'] } },
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},

	// ------ Get Many ------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['user'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['user'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search users by name or email',
			},
		],
	},

	// ------ Update ------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['update'] } },
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the user account should be enabled or disabled',
			},
			{
				displayName: 'Extra Data',
				name: 'extra_data',
				type: 'json',
				default: '{}',
				description: 'Arbitrary key-value metadata (replaces existing extra_data)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The full name of the user',
			},
		],
	},
];
