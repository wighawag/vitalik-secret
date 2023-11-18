<script lang="ts">
	export let start: number[];

	type TileData = {
		si: number;
		i: number;
		x: number;
		y: number;
		origx: number;
		origy: number;
	};
	type TileDataSet = {
		si: string;
		i: string;
		x: string;
		y: string;
		origx: string;
		origy: string;
	};
	let tiles: ({
		transform: string;
		clip: string;
	} & TileData)[] = [];
	for (let i = 0; i < 16; i++) {
		tiles.push({
			transform: 'translate(0,0)',
			clip: `#c${i.toString().padStart(4, '0')}`,
			si: i,
			i: i,
			x: i % 4,
			y: Math.floor(i / 4),
			origx: i % 4,
			origy: Math.floor(i / 4),
		});
	}

	let emptyCellPosition = {i: 15, x: 3, y: 3};
	$: {
		const newTiles = tiles;
		for (let i = 0; i < start.length; i++) {
			const x = i % 4;
			const y = Math.floor(i / 4);
			const shuffledI = start[i] == 0 ? 15 : start[i] - 1;
			if (shuffledI == 15) {
				emptyCellPosition.i = i;
				emptyCellPosition.x = x;
				emptyCellPosition.y = y;
				console.log(JSON.stringify(emptyCellPosition));
			}
			const shuffledX = shuffledI % 4;
			const shuffledY = Math.floor(shuffledI / 4);
			const dx = x - shuffledX;
			const dy = y - shuffledY;

			const shuffledID = shuffledI.toString().padStart(4, '0');

			newTiles[i].transform = `translate(${dx},${dy})`;
			newTiles[i].clip = `#c${shuffledID}`;
			// newTiles[i].i = i;
			newTiles[i].si = shuffledI;
			newTiles[i].x = x;
			newTiles[i].y = y;
			newTiles[i].origx = shuffledX;
			newTiles[i].origy = shuffledY;
			console.log(JSON.stringify({i, shuffledI, dx, dy, tile: newTiles[i]}));
		}
		tiles = newTiles;
	}

	function click(event: MouseEvent) {
		const tileSet: TileDataSet = (event.target as SVGElement).dataset as unknown as TileDataSet;
		const tile: TileData = {
			i: parseInt(tileSet.i),
			si: parseInt(tileSet.si),
			x: parseInt(tileSet.x),
			y: parseInt(tileSet.y),
			origx: parseInt(tileSet.origx),
			origy: parseInt(tileSet.origy),
		};

		if (
			(tile.x == emptyCellPosition.x - 1 && tile.y == emptyCellPosition.y) ||
			(tile.x == emptyCellPosition.x + 1 && tile.y == emptyCellPosition.y) ||
			(tile.x == emptyCellPosition.x && tile.y == emptyCellPosition.y - 1) ||
			(tile.x == emptyCellPosition.x && tile.y == emptyCellPosition.y + 1)
		) {
			console.log(tile);
			const tmp = start[tile.i];
			start[tile.i] = start[emptyCellPosition.i];
			start[emptyCellPosition.i] = tmp;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg on:click={click} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4">
	<defs>
		<!-- we define the image as #v-->
		<image width="4" height="4" id="v" href="/images/vitalik-secret.jpeg"></image>
	</defs>
	<!-- clip path represent a portion of the image, 4 * 4 = 16 -->
	<!-- each are size 1x1 as we defined the viewbox to be 4x4 -->
	<clipPath id="c0000">
		<rect x="0" y="0" width="1" height="1" />
	</clipPath>
	<clipPath id="c0001">
		<rect x="1" y="0" width="1" height="1" />
	</clipPath>
	<clipPath id="c0002">
		<rect x="2" y="0" width="1" height="1" />
	</clipPath>
	<clipPath id="c0003">
		<rect x="3" y="0" width="1" height="1" />
	</clipPath>
	<clipPath id="c0004">
		<rect x="0" y="1" width="1" height="1" />
	</clipPath>
	<clipPath id="c0005">
		<rect x="1" y="1" width="1" height="1" />
	</clipPath>
	<clipPath id="c0006">
		<rect x="2" y="1" width="1" height="1" />
	</clipPath>
	<clipPath id="c0007">
		<rect x="3" y="1" width="1" height="1" />
	</clipPath>
	<clipPath id="c0008">
		<rect x="0" y="2" width="1" height="1" />
	</clipPath>
	<clipPath id="c0009">
		<rect x="1" y="2" width="1" height="1" />
	</clipPath>
	<clipPath id="c0010">
		<rect x="2" y="2" width="1" height="1" />
	</clipPath>
	<clipPath id="c0011">
		<rect x="3" y="2" width="1" height="1" />
	</clipPath>
	<clipPath id="c0012">
		<rect x="0" y="3" width="1" height="1" />
	</clipPath>
	<clipPath id="c0013">
		<rect x="1" y="3" width="1" height="1" />
	</clipPath>
	<clipPath id="c0014">
		<rect x="2" y="3" width="1" height="1" />
	</clipPath>
	<!-- TODO make this the clear square to move around-->
	<clipPath id="c0015">
		<rect x="3" y="3" width="1" height="1" />
	</clipPath>

	<!-- we then use them all so they get displayed and we can move/shuffle them  -->
	<!-- id represent the tile shuffled so id=i000 , so the clear path can be any -->
	{#each tiles as tile}
		<use
			id="i0000"
			transform={tile.transform}
			href="#v"
			clip-path={`url(${tile.clip})`}
			data-si={tile.si}
			data-i={tile.i}
			data-x={tile.x}
			data-y={tile.y}
			data-origx={tile.origx}
			data-origy={tile.origy}
		/>
	{/each}

	<rect x={emptyCellPosition.x} y={emptyCellPosition.y} width="1" height="1" rx="0" />
</svg>
