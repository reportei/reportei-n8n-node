import {
	IAuthenticateGeneric,
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
			description: 'Enter your Reportei Bearer token here',
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
}
