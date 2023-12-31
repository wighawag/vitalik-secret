import {Deployment, loadEnvironment} from 'rocketh';
import {context} from '../deploy/_context';
import hre from 'hardhat';
import {EIP1193ProviderWithoutEvents} from 'eip-1193';
import {fetchContract, getConnection} from '../utils/connection';

async function main() {
	const env = await loadEnvironment(
		{
			provider: hre.network.provider as EIP1193ProviderWithoutEvents,
			networkName: hre.network.name,
		},
		context,
	);

	const {walletClient} = await getConnection();

	const args = process.argv.slice(2);
	const tokenID = args[0] || process.env.TOKEN_ID;

	if (!tokenID) {
		throw new Error(`please provide a tokenID as parameter`);
	}

	const tokenIDAsBN = BigInt(tokenID);

	const VitalikSecret = env.deployments.VitalikSecret as Deployment<typeof context.artifacts.VitalikSecret.abi>;
	const VitalikSecretContract = await fetchContract(VitalikSecret);
	const message = await VitalikSecretContract.read.tokenURI([tokenIDAsBN]);

	console.log({tokenID, message});
}
main();
