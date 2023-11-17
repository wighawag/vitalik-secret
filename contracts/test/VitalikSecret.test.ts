import {expect, describe, it} from 'vitest';
import './utils/viem-matchers';

import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {prefix_str} from 'vitalik-secret-common';
import {Deployment, loadAndExecuteDeployments} from 'rocketh';

import {getConnection, fetchContract} from './connection';

import artifacts from '../generated/artifacts';
import {network} from 'hardhat';

async function deployGreetings(prefix: string) {
	const {accounts, walletClient, publicClient} = await getConnection();
	const [deployer, ...otherAccounts] = accounts;

	const hash = await walletClient.deployContract({
		...artifacts.VitalikSecret,
		account: deployer,
		args: [prefix],
	} as any); // TODO https://github.com/wagmi-dev/viem/issues/648

	const receipt = await publicClient.waitForTransactionReceipt({hash});

	if (!receipt.contractAddress) {
		throw new Error(`failed to deploy contract`);
	}

	return {
		puzzle: await fetchContract({address: receipt.contractAddress, abi: artifacts.VitalikSecret.abi}),
		prefix,
		otherAccounts,
		walletClient,
		publicClient,
	};
}

async function deployGreetingsWithHello() {
	return deployGreetings('hello');
}

describe('VitalikSecret', function () {
	describe('Deployment', function () {
		it('Should be already deployed', async function () {
			const {deployments} = await loadAndExecuteDeployments({
				provider: network.provider as any,
			});
			const VitalikSecret = await fetchContract(
				deployments['VitalikSecret'] as Deployment<typeof artifacts.VitalikSecret.abi>,
			);
			const prefix = await VitalikSecret.read.prefix();
			expect(prefix).to.equal('');
		});

		it('Should be able to solve puzzel', async function () {
			const {puzzle, otherAccounts, publicClient} = await loadFixture(deployGreetingsWithHello);
			const txHash = await puzzle.write.setMessage(['hello', 1], {
				account: otherAccounts[0],
			});
			expect(await publicClient.waitForTransactionReceipt({hash: txHash})).to.includeEvent(
				puzzle.abi,
				'MessageChanged',
			);
		});
	});
});
