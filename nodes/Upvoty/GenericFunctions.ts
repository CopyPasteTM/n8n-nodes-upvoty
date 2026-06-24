import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const DEFAULT_API_BASE_URL = 'https://api.upvotyfeedback.com';
const BASE_PATH = '/v1';

export async function upvotyOAuth2ApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('upvotyOAuth2Api');
	const baseUrl = (credentials.apiBaseUrl as string) || DEFAULT_API_BASE_URL;

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${BASE_PATH}${endpoint}`,
		qs: qs ?? {},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(
			this,
			'upvotyOAuth2Api',
			options,
		) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: extractErrorMessage(error),
		});
	}
}

/**
 * Walk every page of a list endpoint and return all rows.
 * Auto-detects whether the endpoint uses offset or cursor pagination from the response meta —
 * `meta.lastPage` means offset, `meta.hasMore`/`meta.cursor` means cursor. Callers don't need to
 * know which shape an endpoint uses.
 */
export async function upvotyOAuth2ApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs?: IDataObject,
): Promise<IDataObject[]> {
	const allItems: IDataObject[] = [];
	const perPage = 100;

	qs = qs ?? {};

	let page = 1;
	let cursor: string | null = null;
	let mode: 'unknown' | 'offset' | 'cursor' = 'unknown';
	let hasMore = true;

	while (hasMore) {
		if (mode === 'cursor') {
			qs['pagination[limit]'] = perPage;
			if (cursor) qs['pagination[cursor]'] = cursor;
			else delete qs['pagination[cursor]'];
		} else {
			qs['pagination[page]'] = page;
			qs['pagination[perPage]'] = perPage;
		}

		const response = await upvotyOAuth2ApiRequest.call(this, method, endpoint, undefined, qs);

		const items = (response?.data as IDataObject[]) ?? [];
		allItems.push(...items);

		const meta = response?.meta as IDataObject | undefined;

		if (mode === 'unknown') {
			if (meta && meta.lastPage !== undefined) mode = 'offset';
			else if (meta && (meta.hasMore !== undefined || meta.cursor !== undefined)) mode = 'cursor';
			else { hasMore = false; continue; }
		}

		if (mode === 'offset') {
			if (!meta || page >= (meta.lastPage as number)) hasMore = false;
			else page++;
		} else {
			if (!meta || !meta.hasMore || !meta.cursor) hasMore = false;
			else cursor = meta.cursor as string;
		}
	}

	return allItems;
}

const SIMPLIFY_FIELDS: Record<string, string[]> = {
	feedback: ['id', 'title', 'content', 'status', 'category', 'priority', 'votes_count', 'email', 'private', 'archived', 'created_at', 'updated_at'],
	changelog: ['id', 'title', 'content', 'published', 'created_at', 'updated_at'],
	roadmap: ['id', 'title', 'content', 'status', 'votes_count', 'created_at', 'updated_at'],
	user: ['id', 'name', 'email', 'avatar', 'role', 'created_at', 'updated_at'],
};

export function simplifyResponse(resource: string, data: IDataObject): IDataObject {
	const fields = SIMPLIFY_FIELDS[resource];
	if (!fields || typeof data !== 'object' || data === null) return data;

	const simplified: IDataObject = {};
	for (const field of fields) {
		if (data[field] !== undefined) {
			simplified[field] = data[field];
		}
	}
	return simplified;
}

function extractErrorMessage(error: unknown): string {
	const err = error as Record<string, Record<string, Record<string, Record<string, string>>>>;
	// Upvoty error format: { error: { code, message, reason?, fields? } }
	if (err?.response?.body?.error?.message) {
		return err.response.body.error.message;
	}

	if (err?.response?.body?.error?.reason) {
		return err.response.body.error.reason;
	}

	if ((error as Error)?.message) {
		return (error as Error).message;
	}

	return 'An unknown error occurred';
}
