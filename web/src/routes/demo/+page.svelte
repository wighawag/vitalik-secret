<script lang="ts">
	import ConnectButton from '$lib/web3/ConnectButton.svelte';
	import Web3ConnectionUI from '$lib/web3/Web3ConnectionUI.svelte';
	import {account, connection, network, contracts} from '$lib/web3';
	import {status, state} from '$lib/blockchain/state/State';
	import {pendingState} from '$lib/blockchain/state/PendingState';
	import ImgBlockie from '$lib/components/ethereum/ImgBlockie.svelte';
	import VitalikSecret from '$lib/components/vitalik-secret/VitalikSecret.svelte';

	let puzzle: {solve(moves: number[]): Promise<void>};
	let moves: number[];

	function generate4x4(n: number) {
		const size = 4;
		const values: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15];
		let position = 10;

		moves = [];
		for (let i = 0; i < n; i++) {
			const x = position % size;
			const y = Math.floor(position / size);
			const move = Math.floor(Math.random() * 4);
			let newPosition = position;
			if (move == 0 && x < size - 1) {
				newPosition = y * size + x + 1;
			} else if (move == 1 && y < size - 1) {
				newPosition = (y + 1) * size + x;
			} else if (move == 2 && x > 0) {
				newPosition = y * size + x - 1;
			} else if (move == 3 && y > 0) {
				newPosition = (y - 1) * size + x;
			}

			if (newPosition != position) {
				const tmp = values[newPosition];
				values[newPosition] = values[position];
				values[position] = tmp;
				position = newPosition;
				moves.unshift((move + 2) % 4);
			}
		}

		return values;
	}
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

<VitalikSecret bind:puzzle start={generate4x4(100)} />

<!-- <VitalikSecret bind:puzzle start={[2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0]} /> -->

<!-- SOLUTION -->
<!-- <VitalikSecret start={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15]} /> -->

<button on:click={() => puzzle.solve(moves)} class="m-1 btn btn-primary">Solve</button>

<button
	on:click={() =>
		contracts.execute(async ({contracts, connection}) => {
			// we can add metadata to our tx that can get picked up
			// connection.provider.setNextMetadata({
			// 	message: messageToSend,
			// });
			// contracts.VitalikSecret.write.setMessage([messageToSend, 12]);
		})}
	class="m-1 btn btn-primary">Commit And Mint!</button
>

<Web3ConnectionUI />
