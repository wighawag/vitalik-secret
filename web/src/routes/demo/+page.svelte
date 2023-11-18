<script lang="ts">
	import ConnectButton from '$lib/web3/ConnectButton.svelte';
	import Web3ConnectionUI from '$lib/web3/Web3ConnectionUI.svelte';
	import {account, connection, network, contracts} from '$lib/web3';
	import {status, state} from '$lib/blockchain/state/State';
	import {pendingState} from '$lib/blockchain/state/PendingState';
	import ImgBlockie from '$lib/components/ethereum/ImgBlockie.svelte';
	import VitalikSecret from '$lib/components/vitalik-secret/VitalikSecret.svelte';

	let messageToSend: string;
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<span class="normal-case text-xl">Demo</span>
	</div>
	<div class="navbar-center hidden lg:flex" />
	<div class="navbar-end">
		<ConnectButton />
	</div>
</div>

<VitalikSecret start={[2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0]} />

<button
	on:click={() =>
		contracts.execute(async ({contracts, connection}) => {
			// we can add metadata to our tx that can get picked up
			// connection.provider.setNextMetadata({
			// 	message: messageToSend,
			// });
			// contracts.VitalikSecret.write.setMessage([messageToSend, 12]);
		})}
	class="m-1 btn btn-primary">Say it!</button
>

<Web3ConnectionUI />
