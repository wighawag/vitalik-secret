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
			expect(uri).to.not.equal('');
		});

		it('initial state should be valid', async function () {
			const {puzzle} = await loadFixture(deployVitalikSecret);
			const initialState = await puzzle.read.initialState();
			console.log(initialState);
			expect(initialState.length).to.equal(new Set(initialState).size);
			expect(initialState[initialState.length-1]).to.equal(0);
		});

		it('Should be able to solve puzzel', async function () {
			const {puzzle, otherAccounts, publicClient} = await loadFixture(deployVitalikSecret);
			const solution =  [2, 1, 3, 0, 3, 2, 2, 1, 3, 1, 1, 1, 3, 2, 3, 0, 3, 1, 0, 2, 3, 2, 1, 3, 1, 0, 0, 3, 0, 1, 2, 1, 3, 2, 1, 3, 1,
				2, 1, 3, 3, 0, 0, 3, 0, 1, 2, 2, 0, 1, 0, 3, 1, 2, 0, 3, 3, 1, 2, 0, 2, 1, 0, 3, 1, 3, 2, 0, 1, 1, 3, 3, 2, 1,
				0, 2, 1, 3,
				];
			console.log(solution)
			const txHash = await puzzle.write.proposeSolution(
				[
					solution,
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

		it('Should be able to prove puzzle', async function () {
			const {puzzle, otherAccounts: [solver]} = await loadFixture(deployVitalikSecret);
			const proof = "0x" + require('fs').readFileSync('./zecret/proofs/zecret.proof','utf8');
			const tx = await puzzle.write.proposeSolutionProof(
				[28, proof],
				{
					account: solver,
				});

		});
	});
});
