import { createHmac } from 'crypto';
import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { upvotyOAuth2ApiRequest } from './GenericFunctions';

export class UpvotyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Upvoty Trigger',
		name: 'upvotyTrigger',
		icon: 'file:upvoty.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Triggers when events occur in Upvoty',
		defaults: {
			name: 'Upvoty Trigger',
		},
		usableAsTool: true,
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'upvotyOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'Which events to listen for',
				options: [
					{ name: 'All Events', value: '*' },
					{ name: 'Attribute — Created', value: 'attribute.created' },
					{ name: 'Attribute — Deleted', value: 'attribute.deleted' },
					{ name: 'Attribute — Updated', value: 'attribute.updated' },
					{ name: 'Changelog — Comment Created', value: 'changelog.comment.created' },
					{ name: 'Changelog — Comment Deleted', value: 'changelog.comment.deleted' },
					{ name: 'Changelog — Comment Liked', value: 'changelog.comment.liked' },
					{ name: 'Changelog — Comment Reaction Added', value: 'changelog.comment.reaction.created' },
					{ name: 'Changelog — Comment Reaction Removed', value: 'changelog.comment.reaction.deleted' },
					{ name: 'Changelog — Comment Unliked', value: 'changelog.comment.unliked' },
					{ name: 'Changelog — Comment Updated', value: 'changelog.comment.updated' },
					{ name: 'Changelog — Created', value: 'changelog.created' },
					{ name: 'Changelog — Deleted', value: 'changelog.deleted' },
					{ name: 'Changelog — Published', value: 'changelog.published' },
					{ name: 'Changelog — Reaction Added', value: 'changelog.reaction.created' },
					{ name: 'Changelog — Reaction Removed', value: 'changelog.reaction.deleted' },
					{ name: 'Changelog — Subscribed', value: 'changelog.subscribed' },
					{ name: 'Changelog — Unpublished', value: 'changelog.unpublished' },
					{ name: 'Changelog — Unsubscribed', value: 'changelog.unsubscribed' },
					{ name: 'Changelog — Updated', value: 'changelog.updated' },
					{ name: 'Feedback — Archived', value: 'feedback.archived' },
					{ name: 'Feedback — Comment Created', value: 'feedback.comment.created' },
					{ name: 'Feedback — Comment Deleted', value: 'feedback.comment.deleted' },
					{ name: 'Feedback — Comment Liked', value: 'feedback.comment.liked' },
					{ name: 'Feedback — Comment Reaction Added', value: 'feedback.comment.reaction.created' },
					{ name: 'Feedback — Comment Reaction Removed', value: 'feedback.comment.reaction.deleted' },
					{ name: 'Feedback — Comment Unliked', value: 'feedback.comment.unliked' },
					{ name: 'Feedback — Comment Updated', value: 'feedback.comment.updated' },
					{ name: 'Feedback — Created', value: 'feedback.created' },
					{ name: 'Feedback — Deleted', value: 'feedback.deleted' },
					{ name: 'Feedback — Duplicated', value: 'feedback.duplicated' },
					{ name: 'Feedback — Made Private', value: 'feedback.private' },
					{ name: 'Feedback — Made Public', value: 'feedback.public' },
					{ name: 'Feedback — Merged', value: 'feedback.merged' },
					{ name: 'Feedback — Pinned', value: 'feedback.pinned' },
					{ name: 'Feedback — Reaction Added', value: 'feedback.reaction.created' },
					{ name: 'Feedback — Reaction Removed', value: 'feedback.reaction.deleted' },
					{ name: 'Feedback — Replied', value: 'feedback.replied' },
					{ name: 'Feedback — Status Changed', value: 'feedback.status_changed' },
					{ name: 'Feedback — Unarchived', value: 'feedback.unarchived' },
					{ name: 'Feedback — Unmerged', value: 'feedback.unmerged' },
					{ name: 'Feedback — Unpinned', value: 'feedback.unpinned' },
					{ name: 'Feedback — Updated', value: 'feedback.updated' },
					{ name: 'Feedback — Vote Added', value: 'feedback.vote.created' },
					{ name: 'Feedback — Vote Removed', value: 'feedback.vote.deleted' },
					{ name: 'Roadmap — Created', value: 'roadmap.created' },
					{ name: 'Roadmap — Deleted', value: 'roadmap.deleted' },
					{ name: 'Roadmap — Unvoted', value: 'roadmap.unvoted' },
					{ name: 'Roadmap — Updated', value: 'roadmap.updated' },
					{ name: 'Roadmap — Voted', value: 'roadmap.voted' },
					{ name: 'Segment — Created', value: 'segment.created' },
					{ name: 'Segment — Deleted', value: 'segment.deleted' },
					{ name: 'Segment — Updated', value: 'segment.updated' },
					{ name: 'User — Created', value: 'user.created' },
					{ name: 'User — Updated', value: 'user.updated' },
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				return !!webhookData.webhookId;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];

				const body: IDataObject = {
					url: webhookUrl,
					events,
				};

				const response = await upvotyOAuth2ApiRequest.call(this, 'POST', '/webhooks', body);
				const webhook = response?.data as IDataObject | undefined;

				if (!webhook?.id) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = webhook.id;
				webhookData.signingSecret = webhook.signing_secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				try {
					await upvotyOAuth2ApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
				} catch {
					// Webhook may already be deleted (e.g. integration removed from dashboard).
					// Clear stored state anyway so the next activation re-registers via create()
					// instead of being stuck (checkExists would otherwise still return true).
					delete webhookData.webhookId;
					delete webhookData.signingSecret;
					return false;
				}

				delete webhookData.webhookId;
				delete webhookData.signingSecret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = req.body as IDataObject;

		// Verify HMAC signature
		const webhookData = this.getWorkflowStaticData('node');
		const signingSecret = webhookData.signingSecret as string;

		if (signingSecret) {
			const signature = req.headers['x-upvoty-signature'] as string;
			const rawBody = JSON.stringify(body);
			const expectedSignature =
				'sha256=' + createHmac('sha256', signingSecret).update(rawBody).digest('hex');

			if (signature !== expectedSignature) {
				return {};
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
