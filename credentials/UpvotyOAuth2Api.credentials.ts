import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UpvotyOAuth2Api implements ICredentialType {
	name = 'upvotyOAuth2Api';
	displayName = 'Upvoty OAuth2 API';
	icon = { light: 'file:upvoty.svg', dark: 'file:upvoty.svg' } as const;
	extends = ['oAuth2Api'];
	documentationUrl = 'https://api.upvotyfeedback.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			// PKCE: Upvoty's n8n client is a public client (no secret to distribute).
			default: 'pkce',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api.upvotyfeedback.com/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.upvotyfeedback.com/oauth/token',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'hidden',
			default: 'upvoty_cid_8469d04b3c5d980cc7589891c8e5b7ea',
		},
		{
			// Public PKCE client: no secret is shipped. Kept as a hidden empty
			// field so n8n's inherited oAuth2Api Client Secret input stays hidden.
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'hidden',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'feedback:read feedback:write changelog:read changelog:write roadmap:read roadmap:write users:read users:write webhooks:read webhooks:write project:read',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'hidden',
			default: 'https://api.upvotyfeedback.com',
		},
	];
}
