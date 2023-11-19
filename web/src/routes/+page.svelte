<script lang="ts">
	import ConnectButton from '$lib/web3/ConnectButton.svelte';
	import Web3ConnectionUI from '$lib/web3/Web3ConnectionUI.svelte';
	import {account, connection, network, contracts} from '$lib/web3';
	import VitalikSecret from '$lib/components/vitalik-secret/VitalikSecret.svelte';

	let puzzle: {solve(): Promise<void>};
	let solved: boolean;
</script>

<!-- Navbar -->
<div class="navbar bg-gray-800 text-white">
	<div class="navbar-start">
		<span class="normal-case text-xl">Demo</span>
	</div>
	<div class="navbar-center flex-grow lg:flex lg:justify-center" />

	<div class="navbar-end">
		<ConnectButton />
	</div>
</div>

<!-- Puzzle Section -->
<div class="flex justify-center flex-col items-center min-h-screen bg-purple-900 p-4">
	<VitalikSecret
		class="w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl border-4 border-white rounded-lg"
		bind:puzzle
		bind:solved
	/>
	<div class="flex justify-center gap-2 bg-purple-900 p-8">
		<button
			on:click={() => puzzle.solve()}
			class="bg-yellow-400 text-purple-900 rounded-full py-2 px-6 hover:bg-yellow-500 transition duration-300 ease-in-out"
		>
			Solve
		</button>

		<button
			disabled={!solved}
			on:click={() =>
				contracts.execute(async ({contracts, connection}) => {
					contracts.VitalikSecret.write.proposeSolutionProof([78n, '0x']);
				})}
			class="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
		>
			Commit And Mint!
		</button>
	</div>
</div>

<!-- <div class="flex justify-center items-center min-h-screen bg-purple-900 p-4"> -->
<!-- Buttons -->
<!-- <div class="flex justify-center gap-2 bg-purple-900">
	<button on:click={() => puzzle.solve()} class="bg-yellow-400 text-purple-900 rounded-full py-2 px-6 hover:bg-yellow-500 transition duration-300 ease-in-out">
	  Solve
	</button>
	
	<button
	  on:click={() =>
	  contracts.execute(async ({ contracts, connection }) => {
		// Transaction logic...
	  })}
	  class="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
	  Commit And Mint!
	</button>
	</div> -->
<!-- </div> -->

<!-- Connection UI -->
<div class="bg-gray-800 text-white py-4">
	<Web3ConnectionUI />
</div>
