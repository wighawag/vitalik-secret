<script lang="ts">
	import ConnectButton from '$lib/web3/ConnectButton.svelte';
	import Web3ConnectionUI from '$lib/web3/Web3ConnectionUI.svelte';
	import {account, connection, network, contracts} from '$lib/web3';
	import VitalikSecret from '$lib/components/vitalik-secret/VitalikSecret.svelte';
  
	let puzzle: {solve(): Promise<void>};
  </script>
  
  <!-- Navbar -->
  
	
  
  
  <!-- Puzzle Section -->
  <div class="flex justify-center flex-col items-center min-h-screen bg-purple-900 p-4">
	
	  
	  <!--make button allign with the end of the picture ending-->
	  <div class="flex  lg:justify-between lg:items-end m-5 self-end">
		  <ConnectButton class="text-lg bg-white text-purple-900 py-2 px-4 rounded-full lg:rounded-none lg:py-1 lg:px-2" />
	  </div>
	  
	  <VitalikSecret
	  class="w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl border-4 border-white rounded-lg"
	  bind:puzzle
	/>
	<div class="flex justify-center gap-2 bg-purple-900 p-8">
	  <button
		on:click={() => puzzle.solve()}
		class="bg-yellow-400 text-purple-900 rounded-full py-2 px-6 hover:bg-yellow-500 transition duration-300 ease-in-out"
	  >
		Solve
	  </button>
  
	  <button
		on:click={() =>
		  contracts.execute(async ({contracts, connection}) => {
			// Transaction logic...
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
  <div>
	<Web3ConnectionUI />
  </div>