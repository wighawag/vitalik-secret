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

	const [address] = await walletClient.getAddresses();
	const VitalikSecret = env.deployments.VitalikSecret as Deployment<typeof context.artifacts.VitalikSecret.abi>;
	const VitalikSecretContract = await fetchContract(VitalikSecret);
	const hash = await VitalikSecretContract.write.proposeSolution([[1, 2]], {account: address});

	console.log({hash, account: address});
}
main();
