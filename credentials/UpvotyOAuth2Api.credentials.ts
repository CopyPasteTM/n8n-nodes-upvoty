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
			default: 'authorizationCode',
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
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'hidden',
			typeOptions: { password: true },
			default: 'upvoty_cs_859db34c32433e18c7e3c42221fe53f030a2ab457f16e3a63fdb7839e122c8d9',
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
