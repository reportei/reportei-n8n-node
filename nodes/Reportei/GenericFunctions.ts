// File: nodes/Reportei/GenericFunctions.ts

import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * A generic function to handle HTTP requests to the Reportei API.
 * This helps avoid repeating the same code for every operation.
 *
 * @param this - The context to allow calling `this.helpers` methods (it can be IExecuteFunctions, IHookFunctions, or ILoadOptionsFunctions)
 * @param method - The HTTP method (GET, POST, DELETE, etc.)
 * @param endpoint - The API endpoint (e.g. '/create_report')
 * @param body - A request body, if needed
 * @param qs - Query string parameters, if needed
 *
 * @returns The parsed JSON response from the API
 */
export async function reporteiApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {

	const baseUrl = 'https://app.reportei.com/api/v1';

	const options: IHttpRequestOptions = {
		method: method as IHttpRequestMethods, // << aqui o cast
		body,
		qs,
		url: `${baseUrl}${endpoint}`,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'reporteiApi', options);
}

/**
 * You can add more utility functions here if needed.
 * For example, a function to handle pagination, or to unify error handling, etc.
 */

// Example of a function that might handle pagination if you needed it:
/*
export async function reporteiApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	propertyName: string,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any[]> {
	// Implementation for paginated requests...
}
*/
