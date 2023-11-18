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
			const solution = [
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
			const {puzzle, otherAccounts} = await loadFixture(deployVitalikSecret);
			const tx = await puzzle.write.proposeSolutionProof(
				[28, "0x14d9458c3f60f60291eca1e422fc10a3ca0bcfb21c1d5bef691ea2ea85825efe25e6e535bb3ac384af8b36c6562350e87aca9225bd26a5a2e26014c522d64f0026f1692123a1878ed07bd4434cc27e137371bcdeb9a2c2d5b5c3b64793438fc508084f8f49e31f700472043a00fe317bdd1a2af54ffdb6c664521824326d2d8f202f8ca11767a48902b3fbb29a0080697c30c02522e97af6b9261e3346979dd92e5eba9eba108db708a2b4ac0b2529737c0d4bec7040d17f44abca99578f9a86259b23243ec8d18a20cc43b85383a6de353ccfa303c39fc3a474373f308a5dd5282b1b0ecb7aee7de17f009580765b8e078be0f1e4163d75b93536561a62a20e2964e223e0930f5171d6ef83f89d92bc76f0957793645b1e27ee4736cc6ae45a2dfd6ef98222a57e21e6cf4a04f10721b540105453748a7743571552d7990066080a3dafba57bde3bfce0b018eb80177cde8f41e66af21d15d6a8a4ba21548ce072741ff32eaf9940c90e04d5882870fc3f04590339e8ad579c527ddec1b07db1f32cd2e73cc5c4014ae0b7e32d796e7d4787a49802f7ab10857c482b4ed6f80111145695f93c3c34bb5aeaebc8e19271e0bdf5d29f7b6d92e7c587d3873e9151ca679f05447c82ac88a597a242d920ef716df8bb5f10dcb883e206ed2914ebe1968f6ac373f0b6c68f0c9c4d8f65f0ca31d19dd7d3bc5ecb2bc63b918ea1a180625c8affbc83df6fb1a8437082b0ae3119f821eb7e131b807dcd3e552cd1fc81815371198baeb06de30e2bb7aefb8e36e1de2a1ad83372ab09ef46118e2215827bda2a942c987cb2e6f1c9bb348729da7e4e7026a8846a1dacd10d906fda409017fa26b174196ac6b8fa605e2a587ef792842e15e2f8c715abab40c23240911143e503e3945039f713c18b362e190d292836f2449a46fdd91d47dcdb523da1f210e3cc5205d99c53d5be916a50d9bf14de72eab8cbaa55e01d2af84de50538c2be3ae8f31ae54d3352347ae6f42f4914e342504d6e15afc7954ef55e9ade19b1649e5f6e9f163b699d8e6585d9a8e9c09e97a4147df45d65c3db6bec33511b92cf81c2857aa1aa6bb27ad730d1c37749c623da8bbe4e3516e6efa2a5c5823d503b1e75d6f472e73f3e85205543fc71af5df650ac7af8a2484aaf8880e191a652e814e2caa64cd027d5d21feae9bac2c292e528b9aee73feef0c4c91f22f29da111db5ff5557af940bab6202c070004bcd712bf25965e7f3a59ceb6bf51a227423dd42741db59d1710d8da27a5029934dc6ab31d8da2d21d71c64d0b26f1451a2e9a1ab3f3706dc26f1a8ad100a6f75ec563acfa6e65d63d76b0ad34e5b9a53d1d6b31b01d216540778939dffffd39b369527ac4642892b3812c8be354706e7a15c0a7139cb532a87e0b1232b2f77db085cd6c3120ca63421f1eb4237634bad11dba1f66a9c76241af6207c186281792f2d112e1ab5c58f70ffc8f8912dcc6161a60c5d30d4649074ed84a3d6b0a34a87946992aecc75fc3be414c16b8097ba812f0b017ba1a2479633661af3fa9b783bac7d22be602cf8d27c4c45380afaa361762b3d5088543ebdb60cc223362698bac2a9f58487e89844f388e972e80ae7200e8dcf8790a15003eaa03a3dd3f9fdbfcb97be60868baff11b678d8d893a2802ff68106643b7bf220543d42f24df00e3d229b7da287054351e43e6da3c274cd1b523e892240f9ef59b116291681bb58b7aabc1a12e10e12a51e845c332607131f8b2b9148900e6bf536b416dd3f6b32dd28992e505972dc20a465d3a40ba74c145ba6b67d17dcef1a551d33bb182352143757c91e0c43625a07514709492cde291cadc5c8ae2491d0eb4c56ca3eb6dd89518608f893b8cb30558cd5e9bae8210a69c6a7fa4e753b7c58a75b816ae63ad75b69ff9fc4597c868591fcb43912632fd1e7378fe96fdf98558fc717e777f3eec781e4b020e17eabe50160dfadf1112fc5b3f29e78c12ec056009dcf1aa5407f53ceb1b4a9803d1f3a97b1f3a71a7d2fb980adad08127de8567174864dd28d0fe01b7eb9321efb92902e0307a043e92fad4d68bb9763cd1056e24b3d80ffd9a06c684bbdbabdba05e5c4541b996d552fde1a7c815a1e9070551ef060b44aa75e3b3517ab9842c0388f6b0fcbb4c7a51e043debdbce6a9d646f5e43f1a91474da1ffb8cc3d8dfcfde61a53516de608f052b9348e29551f74d4983fd4c93b6a1603268639fee0bc4f99adc19e8b2df760dddeba689539bb0f89d66214468b32fffcb815a913d1c5da4f08dfc56dd9b8c2df055937350f0a81edd799dde07f1ce85f3de05620b99acbb824bb6002d676e1586691ca929503693c531af941c6ca740d5bfed3e3646110b138f5fe5cda32c1841362b22ab5c206563bfb77ab25ba6999bcb427b206195a18ed5c47412399713d43632f59fb039c5c9faa4b16558336a378d30106af4cd8cae33fab5fd4db21e36c18dc66a1caeb70f1d82b3eb2e9e26a4992f597a45c958abef5fbb8bfc690d40983e4ed1c7adcc7bde0739c51b6ffc6ddf442bb4e3100fe4c6e1540bdc0010cf4b00afeb7b787b5b1a798be82d27429eadbbe71ff78be06216618a02e59628122387c1f343ea75e787b26faf33fc36c540ab47f2f1cc234a4e1b934593a60c0325c3bd80e2959e09a2487fd061d0e1f56ac93521ee5fd0efddb84c5da9380d0368e962a0f5776b351a793521bf4cf4c9de59f98f6ce7cd03dadcfd6577520e03ac0f07c10859386092a9ea731cc9079e51eabdfceb6fc917d801ae6d456c0f03ef34ace11b3b058c0ada9fc47a451a72c57b826a69f7c52bd5265f751386299ee42cc448b55ce4532cfb87628f48980af2aef5e9364f2fd46e2136a87703095e0ff84ebf1d5dcce5fcea5686abb9dae39391536e2b471eade2e3f660883d021db8f8accc786f5d74b5133a0d46aa37e1c0578c7d24f0b61dcb2bf8a63e461fa851c52631b2f0a21b3c527dee7f9bc77bcb5668591bc2f115bb8fb453f816"],
				{
					account: otherAccounts[0],
				});

		});
	});
});
