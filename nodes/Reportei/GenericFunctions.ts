
import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

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
