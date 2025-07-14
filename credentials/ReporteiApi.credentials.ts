import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ReporteiApi implements ICredentialType {
	name = 'reporteiApi';
	displayName = 'Reportei API';
	documentationUrl = 'https://app.reportei.com/docs/api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Enter your Reportei API token here',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
                ContentType: 'application/json',
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.reportei.com/api/v1',
			url: '/me',
			method: 'GET',
		},
	};
}
