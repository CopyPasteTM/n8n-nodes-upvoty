import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { upvotyOAuth2ApiRequest, upvotyOAuth2ApiRequestAllItems, simplifyResponse } from './GenericFunctions';

import { feedbackOperations, feedbackFields } from './descriptions/FeedbackDescription';
import { feedbackCommentOperations, feedbackCommentFields } from './descriptions/FeedbackCommentDescription';
import { feedbackVoteOperations, feedbackVoteFields } from './descriptions/FeedbackVoteDescription';
import { changelogOperations, changelogFields } from './descriptions/ChangelogDescription';
import { roadmapOperations, roadmapFields } from './descriptions/RoadmapDescription';
import { userOperations, userFields } from './descriptions/UserDescription';

export class Upvoty implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Upvoty',
		name: 'upvoty',
		icon: 'file:upvoty.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage feedback, changelog, roadmap, and users in Upvoty',
		defaults: {
			name: 'Upvoty',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'upvotyOAuth2Api',
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
					{ name: 'Changelog', value: 'changelog' },
					{ name: 'Feedback', value: 'feedback' },
					{ name: 'Feedback Comment', value: 'feedbackComment' },
					{ name: 'Feedback Vote', value: 'feedbackVote' },
					{ name: 'Roadmap', value: 'roadmap' },
					{ name: 'User', value: 'user' },
				],
				default: 'feedback',
			},
			...feedbackOperations,
			...feedbackFields,
			...feedbackCommentOperations,
			...feedbackCommentFields,
			...feedbackVoteOperations,
			...feedbackVoteFields,
			...changelogOperations,
			...changelogFields,
			...roadmapOperations,
			...roadmapFields,
			...userOperations,
			...userFields,
		],
	};

	methods = {
		loadOptions: {
			async getCategories(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/feedback-categories');
				return items.map((item) => ({
					name: item.label as string,
					value: item.id as string,
				}));
			},

			async getStatuses(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/feedback-statuses');
				return items.map((item) => ({
					name: item.label as string,
					value: item.id as string,
				}));
			},

			async getTags(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/feedback-tags');
				return items.map((item) => ({
					name: item.label as string,
					value: item.id as string,
				}));
			},

			async getRoadmapStatuses(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/roadmap-statuses');
				return items.map((item) => ({
					name: item.label as string,
					value: item.id as string,
				}));
			},

			async getChangelogTags(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/changelog-tags');
				return items.map((item) => ({
					name: item.label as string,
					value: item.id as string,
				}));
			},

			async getTeamMembers(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/team-members');
				return items.map((item) => ({
					name: `${item.name as string} (${item.email as string})`,
					value: item.id as string,
				}));
			},

			async getUsers(this: ILoadOptionsFunctions) {
				const items = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/users');
				return items.map((item) => ({
					name: `${item.name || 'Unnamed'} (${item.email || item.id})`,
					value: item.id as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let response: IDataObject = {};

				// ===== Feedback =====
				if (resource === 'feedback') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							category_id: this.getNodeParameter('categoryId', i) as string,
						};
						for (const [key, value] of Object.entries(additionalFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', '/feedback-items', body);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('feedbackId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'GET', `/feedback-items/${id}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.category_id) qs['filter[category_id]'] = filters.category_id;
						if (filters.status_id) qs['filter[status_id]'] = filters.status_id;
						if (filters.search) qs['filter[search]'] = filters.search;
						if (filters.archived !== undefined) qs['filter[archived]'] = filters.archived;

						if (returnAll) {
							const allItems = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/feedback-items', qs);
							response = { data: allItems };
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs['pagination[perPage]'] = limit;
							response = await upvotyOAuth2ApiRequest.call(this, 'GET', '/feedback-items', undefined, qs);
						}
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('feedbackId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};
						for (const [key, value] of Object.entries(updateFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'PATCH', `/feedback-items/${id}`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('feedbackId', i) as string;
						await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/feedback-items/${id}`);
						response = { data: { id, deleted: true } };
					}

					if (operation === 'changeStatus') {
						const id = this.getNodeParameter('feedbackId', i) as string;
						const statusId = this.getNodeParameter('statusId', i) as string;
						const notifyStatusChange = this.getNodeParameter('notifyStatusChange', i) as boolean;
						const body: IDataObject = { status_id: statusId };
						if (notifyStatusChange) body.notify_status_change = true;
						response = await upvotyOAuth2ApiRequest.call(this, 'PATCH', `/feedback-items/${id}`, body);
					}

					if (operation === 'archive') {
						const id = this.getNodeParameter('feedbackId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', `/feedback-items/${id}/archive`);
					}

					if (operation === 'unarchive') {
						const id = this.getNodeParameter('feedbackId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/feedback-items/${id}/archive`);
					}
				}

				// ===== Feedback Comment =====
				if (resource === 'feedbackComment') {
					const feedbackId = this.getNodeParameter('feedbackId', i) as string;

					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {
							text: this.getNodeParameter('text', i) as string,
						};
						for (const [key, value] of Object.entries(additionalFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', `/feedback-items/${feedbackId}/comments`, body);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							const allItems = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', `/feedback-items/${feedbackId}/comments`);
							response = { data: allItems };
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							response = await upvotyOAuth2ApiRequest.call(this, 'GET', `/feedback-items/${feedbackId}/comments`, undefined, { 'pagination[limit]': limit });
						}
					}

					if (operation === 'delete') {
						const commentId = this.getNodeParameter('commentId', i) as string;
						await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/feedback-items/${feedbackId}/comments/${commentId}`);
						response = { data: { id: commentId, deleted: true } };
					}
				}

				// ===== Feedback Vote =====
				if (resource === 'feedbackVote') {
					if (operation === 'add') {
						const feedbackId = this.getNodeParameter('feedbackId', i) as string;
						const userId = this.getNodeParameter('userId', i, '') as string;
						const body: IDataObject = {};
						if (userId) body.user_id = userId;
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', `/feedback-items/${feedbackId}/votes`, body);
					}

					if (operation === 'remove') {
						const feedbackId = this.getNodeParameter('feedbackId', i) as string;
						const userId = this.getNodeParameter('userId', i, '') as string;
						const body: IDataObject = {};
						if (userId) body.user_id = userId;
						response = await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/feedback-items/${feedbackId}/votes`, body);
					}

					if (operation === 'list') {
						const feedbackId = this.getNodeParameter('feedbackId', i, '') as string;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						const endpoint = feedbackId
							? `/feedback-items/${feedbackId}/votes`
							: '/feedback-votes';

						const qs: IDataObject = {};
						if (!feedbackId) {
							if (filters.voter) qs['filter[voter]'] = filters.voter;
							if (filters.type) qs['filter[type]'] = filters.type;
							if (filters.created_at_gte) qs['filter[created_at][gte]'] = filters.created_at_gte;
							if (filters.created_at_lte) qs['filter[created_at][lte]'] = filters.created_at_lte;
						}

						if (returnAll) {
							const allItems = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', endpoint, qs);
							response = { data: allItems };
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs['pagination[limit]'] = limit;
							response = await upvotyOAuth2ApiRequest.call(this, 'GET', endpoint, undefined, qs);
						}
					}
				}

				// ===== Changelog =====
				if (resource === 'changelog') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							content: this.getNodeParameter('content', i) as string,
						};
						for (const [key, value] of Object.entries(additionalFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', '/changelog', body);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('changelogId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'GET', `/changelog/${id}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							const allItems = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/changelog');
							response = { data: allItems };
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							response = await upvotyOAuth2ApiRequest.call(this, 'GET', '/changelog', undefined, { 'pagination[perPage]': limit });
						}
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('changelogId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};
						for (const [key, value] of Object.entries(updateFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'PATCH', `/changelog/${id}`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('changelogId', i) as string;
						await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/changelog/${id}`);
						response = { data: { id, deleted: true } };
					}

					if (operation === 'publish') {
						const id = this.getNodeParameter('changelogId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', `/changelog/${id}/publication`);
					}

					if (operation === 'unpublish') {
						const id = this.getNodeParameter('changelogId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/changelog/${id}/publication`);
					}
				}

				// ===== Roadmap =====
				if (resource === 'roadmap') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							status_id: this.getNodeParameter('statusId', i) as string,
						};
						for (const [key, value] of Object.entries(additionalFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', '/roadmap-items', body);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('roadmapId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'GET', `/roadmap-items/${id}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							const allItems = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/roadmap-items');
							response = { data: allItems };
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							response = await upvotyOAuth2ApiRequest.call(this, 'GET', '/roadmap-items', undefined, { 'pagination[perPage]': limit });
						}
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('roadmapId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};
						for (const [key, value] of Object.entries(updateFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'PATCH', `/roadmap-items/${id}`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('roadmapId', i) as string;
						await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/roadmap-items/${id}`);
						response = { data: { id, deleted: true } };
					}
				}

				// ===== User =====
				if (resource === 'user') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const name = this.getNodeParameter('name', i) as string;
						const body: IDataObject = {
							email: this.getNodeParameter('email', i) as string,
						};
						if (name) body.name = name;
						for (const [key, value] of Object.entries(additionalFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'POST', '/users', body);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('userId', i) as string;
						response = await upvotyOAuth2ApiRequest.call(this, 'GET', `/users/${id}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.search) qs['filter[search]'] = filters.search;

						if (returnAll) {
							const allItems = await upvotyOAuth2ApiRequestAllItems.call(this, 'GET', '/users', qs);
							response = { data: allItems };
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs['pagination[perPage]'] = limit;
							response = await upvotyOAuth2ApiRequest.call(this, 'GET', '/users', undefined, qs);
						}
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('userId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};
						for (const [key, value] of Object.entries(updateFields)) {
							if (value !== '' && value !== undefined) body[key] = value;
						}
						response = await upvotyOAuth2ApiRequest.call(this, 'PATCH', `/users/${id}`, body);
					}
				}

				// Unwrap envelope: return data array or single item
				const data = response?.data;

				// Apply simplify for get operations
				const shouldSimplify =
					operation === 'get' &&
					this.getNodeParameter('simplify', i, true) as boolean;

				if (Array.isArray(data)) {
					const mapped = shouldSimplify
						? (data as IDataObject[]).map((item) => simplifyResponse(resource, item))
						: (data as IDataObject[]);
					returnData.push(...mapped.map((item) => ({ json: item })));
				} else if (data && typeof data === 'object') {
					const item = shouldSimplify ? simplifyResponse(resource, data as IDataObject) : data;
					returnData.push({ json: item as IDataObject });
				} else {
					returnData.push({ json: response ?? { success: true } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
