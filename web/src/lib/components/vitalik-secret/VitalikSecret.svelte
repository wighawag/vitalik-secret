<script lang="ts">
	export let start: number[];
	export let size: number = 4;

	let BLANK_TILE = 11;

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
	for (let i = 0; i < size * size; i++) {
		tiles.push({
			transform: 'translate(0,0)',
			clip: `#c${i.toString().padStart(4, '0')}`,
			si: i,
			i: i,
			x: i % size,
			y: Math.floor(i / size),
			origx: i % size,
			origy: Math.floor(i / size),
		});
	}

	let emptyCellPosition = {i: BLANK_TILE - 1, x: (BLANK_TILE - 1) % size, y: Math.floor((BLANK_TILE - 1) / size)};
	$: {
		const newTiles = tiles;
		for (let i = 0; i < start.length; i++) {
			const x = i % size;
			const y = Math.floor(i / size);
			const shuffledI = start[i] == 0 ? BLANK_TILE - 1 : start[i] - 1;
			if (shuffledI == BLANK_TILE - 1) {
				emptyCellPosition.i = i;
				emptyCellPosition.x = x;
				emptyCellPosition.y = y;
				console.log(JSON.stringify(emptyCellPosition));
			}
			const shuffledX = shuffledI % size;
			const shuffledY = Math.floor(shuffledI / size);
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
<svg on:click={click} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
	<defs>
		<!-- we define the image as #v-->
		<image width={size} height={size} id="v" href="/images/vitalik-secret.jpeg"></image>
	</defs>

	{#each tiles as tile}
		<clipPath id={`c${tile.i.toString().padStart(4, '0')}`}>
			<rect x={tile.x} y={tile.y} width="1" height="1" />
		</clipPath>
	{/each}

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

	<rect x={emptyCellPosition.x} y={emptyCellPosition.y} width="1" height="1" rx="0" style="fill: red;" />
</svg>
