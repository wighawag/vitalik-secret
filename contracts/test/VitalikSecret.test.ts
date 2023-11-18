import {expect, describe, it} from 'vitest';
import './utils/viem-matchers';

import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {prefix_str} from 'vitalik-secret-common';
import {Deployment, loadAndExecuteDeployments} from 'rocketh';

import {getConnection, fetchContract} from './connection';

import artifacts from '../generated/artifacts';
import {network} from 'hardhat';

enum Move {
	RIGHT,
	DOWN,
	LEFT,
	UP,
}

async function deployVitalikSecret() {
	const {accounts, walletClient, publicClient} = await getConnection();
	const [deployer, ...otherAccounts] = accounts;

	const hash = await walletClient.deployContract({
		...artifacts.VitalikSecret,
		account: deployer,
	} as any); // TODO https://github.com/wagmi-dev/viem/issues/648

	const receipt = await publicClient.waitForTransactionReceipt({hash});

	if (!receipt.contractAddress) {
		throw new Error(`failed to deploy contract`);
	}

	return {
		puzzle: await fetchContract({address: receipt.contractAddress, abi: artifacts.VitalikSecret.abi}),
		otherAccounts,
		walletClient,
		publicClient,
	};
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
			const uri = await VitalikSecret.read.tokenURI([1n]);
			expect(uri).to.equal('');
		});

		it('Should be able to solve puzzel', async function () {
			const {puzzle, otherAccounts, publicClient} = await loadFixture(deployVitalikSecret);
			const txHash = await puzzle.write.proposeSolution(
				[
					[
						Move.UP,
						Move.LEFT,
						Move.LEFT,
						Move.DOWN,
						Move.LEFT,
						Move.UP,
						Move.UP,
						Move.UP,
						Move.RIGHT,
						Move.RIGHT,
						Move.DOWN,
						Move.DOWN,
						Move.LEFT,
						Move.UP,
						Move.LEFT,
						Move.DOWN,
						Move.DOWN,
						Move.RIGHT,
						Move.RIGHT,
						Move.UP,
						Move.UP,
						Move.UP,
						Move.LEFT,
						Move.DOWN,
						Move.DOWN,
						Move.RIGHT,
						Move.RIGHT,
						Move.DOWN,
					],
				],
				{
					account: otherAccounts[0],
				},
			);
			// TODO
			// expect(await publicClient.waitForTransactionReceipt({hash: txHash})).to.includeEvent(
			// 	puzzle.abi,
			// 	'MessageChanged',
			// );
		});
	});
});
