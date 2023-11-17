import {execute} from 'rocketh';
import 'rocketh-deploy-proxy';
import {context} from './_context';

export default execute(
	context,
	async ({deployViaProxy, accounts, artifacts}) => {
		const contract = await deployViaProxy(
			'VitalikSecret',
			{
				account: accounts.deployer,
				artifact: artifacts.VitalikSecret,
			},
			{
				owner: accounts.deployer,
			},
		);
	},
	{tags: ['VitalikSecret', 'VitalikSecret_deploy']},
);
