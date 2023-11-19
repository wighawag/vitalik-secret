<script lang="ts">
	export let solution: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15];
	export let size: number = 4;
	export let solved: boolean = false;

	let clazz: string = '';
	export {clazz as class};

	const {state: initialState, position: initialPosition, moves, goal} = size == 4 ? generate4x4(100) : generate(size);
	let state: number[] = initialState;

	function generate4x4(n: number) {
		const result = {
			state: [2, 4, 7, 3, 10, 9, 6, 0, 5, 1, 11, 8, 12, 13, 14, 15],
			position: 7,
			moves: [
				2, 1, 3, 0, 3, 2, 2, 1, 3, 1, 1, 1, 3, 2, 3, 0, 3, 1, 0, 2, 3, 2, 1, 3, 1, 0, 0, 3, 0, 1, 2, 1, 3, 2, 1, 3, 1,
				2, 1, 3, 3, 0, 0, 3, 0, 1, 2, 2, 0, 1, 0, 3, 1, 2, 0, 3, 3, 1, 2, 0, 2, 1, 0, 3, 1, 3, 2, 0, 1, 1, 3, 3, 2, 1,
				0, 2, 1, 3,
			],
			goal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15],
		};
		// const goal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15];
		// const size = 4;
		// const values: number[] = goal.slice(0);
		// let position = 10;

		// const moves = [];
		// for (let i = 0; i < n; i++) {
		// 	const x = position % size;
		// 	const y = Math.floor(position / size);
		// 	const move = Math.floor(Math.random() * 4);
		// 	let newPosition = position;
		// 	if (move == 0 && x < size - 1) {
		// 		newPosition = y * size + x + 1;
		// 	} else if (move == 1 && y < size - 1) {
		// 		newPosition = (y + 1) * size + x;
		// 	} else if (move == 2 && x > 0) {
		// 		newPosition = y * size + x - 1;
		// 	} else if (move == 3 && y > 0) {
		// 		newPosition = (y - 1) * size + x;
		// 	}

		// 	if (newPosition != position) {
		// 		const tmp = values[newPosition];
		// 		values[newPosition] = values[position];
		// 		values[position] = tmp;
		// 		position = newPosition;
		// 		moves.unshift((move + 2) % 4);
		// 	}
		// }

		// const result = {state: values, moves, position, goal};
		// console.log(JSON.stringify(result, null, 2));
		return result;
	}

	function generate(size: number) {
		const n = Math.max(size * size * size, 100000);
		const goal: number[] = [];
		for (let i = 0; i < size * size; i++) {
			goal.push(i + 1);
		}
		goal[size * size - 1] = 0;

		const values: number[] = goal.slice(0);
		let position = size * size - 1;

		const moves = [];
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

		const result = {state: values, moves, position, goal};
		console.log(JSON.stringify(result, null, 2));
		return result;
	}

	function match(): boolean {
		for (let i = 0; i < solution.length; i++) {
			const expected = solution[i];
			const current = tiles[i].i;
			if (expected != current) {
				return false;
			}
		}
		return true;
	}

	function wait(n: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, n * 1000);
		});
	}

	/*
	const opened = new PriorityQueue<State>();
    const closed = new Map<string, number>();
    let nb_tries = 0;
    opened.insert(state, state.get_h(heuristic));
    while (!opened.is_empty()) {
        nb_tries += 1;
        const state_e = opened.min();
        const state_e_hash = state_e.hash();
        const closed_dist = closed.get(state_e_hash);
        if (typeof closed_dist !== 'undefined' && state_e.g >= closed_dist) {
            continue;
        }
        if (state_e.get_h(heuristic) === 0) {
            return [state_e, nb_tries, opened.size() + closed.size];
        }
        // console.log('state:', state_e);
        // console.log('opened:', opened.size(), 'closed:', closed.size);
        closed.set(state_e_hash, state_e.g);
        for (const state of state_e.expand()) {
            opened.insert(state, state.get_h(heuristic));
        }
    }

	*/

	export const puzzle = {
		async solve() {
			const frozenMoves = moves.slice(0);
			const time = 3;
			let accumulatedTime = 0;
			for (const move of frozenMoves) {
				const {x, y, i: position} = emptyCellPosition;
				let newPosition = position;
				if (move == 0) {
					newPosition = y * size + x + 1;
				} else if (move == 1) {
					newPosition = (y + 1) * size + x;
				} else if (move == 2) {
					newPosition = y * size + x - 1;
				} else if (move == 3) {
					newPosition = (y - 1) * size + x;
				}
				swap(newPosition, emptyCellPosition.i, move);
				// accumulatedTime += time / frozenMoves.length;
				// if (accumulatedTime > 1) {
				// 	accumulatedTime = 0;
				// 	await wait(1);
				// }
				await wait(time / frozenMoves.length);
			}
		},
	};

	function swap(tile: number, empty: number, move: number, doNotRegisterMove?: boolean) {
		const tmp = state[tile];
		state[tile] = state[empty];
		state[empty] = tmp;
		if (!doNotRegisterMove) {
			moves.unshift((move + 2) % 4);
		}

		solved = goal.join(',') == state.join(',');
	}

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
		for (let i = 0; i < state.length; i++) {
			const x = i % size;
			const y = Math.floor(i / size);
			const shuffledI = state[i] == 0 ? BLANK_TILE - 1 : state[i] >= 11 ? state[i] : state[i] - 1;
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

		let move = -1;
		if (tile.x == emptyCellPosition.x - 1 && tile.y == emptyCellPosition.y) {
			move = 2;
		}
		if (tile.x == emptyCellPosition.x + 1 && tile.y == emptyCellPosition.y) {
			move = 0;
		}
		if (tile.x == emptyCellPosition.x && tile.y == emptyCellPosition.y - 1) {
			move = 3;
		}
		if (tile.x == emptyCellPosition.x && tile.y == emptyCellPosition.y + 1) {
			move = 1;
		}
		if (move >= 0) {
			swap(tile.i, emptyCellPosition.i, move);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg class={clazz} on:click={click} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
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

	<rect x={emptyCellPosition.x} y={emptyCellPosition.y} width="1" height="1" rx="0" style="fill: rgb(234 179 8);" />
</svg>
