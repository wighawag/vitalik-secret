export type State = {
	position: number;
	tiles: number[];
};
export function solvePuzzleAStar(size: number, start: State, solution: State): number[] | undefined {
	const goal = solution;
	const startingState = start;
	const frontier: State[] = [];
	frontier.push(start);
	const came_from: Map<string, {move: number; state: State}> = new Map(); // path A->B is stored as came_from[B] == A
	// came_from[clicked] = null

	let found = false;
	while (frontier.length > 0) {
		const current = frontier.shift() as State;
		if (current.tiles.join(',') === goal.tiles.join(',')) {
			found = true;
			break;
		}

		const neighboors: {move: number; state: State}[] = [];

		const x = current.position % size;
		const y = Math.floor(current.position / size);

		function addNeighbor(newPosition: number) {
			const newTiles = current.tiles.slice(0);
			const tmp = newTiles[newPosition];
			newTiles[newPosition] = newTiles[current.position];
			newTiles[current.position] = tmp;
			const newState: State = {
				tiles: newTiles,
				position: newPosition,
			};
			neighboors.push({move: 0, state: newState});
		}

		if (x < size - 1) {
			addNeighbor(y * size + x + 1);
		}

		if (y < size - 1) {
			addNeighbor((y + 1) * size + x);
		}

		if (x > 0) {
			addNeighbor(y * size + x - 1);
		}

		if (y > 0) {
			addNeighbor((y - 1) * size + x);
		}

		for (const next of neighboors) {
			const id = next.state.tiles.join(',');
			if (!came_from.get(id)) {
				console.log({id});
				frontier.push(next.state);
				came_from.set(id, {state: current, move: next.move});
			}
		}
	}
	if (found) {
		let backward_current = goal;
		const moves: number[] = [];
		while (backward_current.tiles.join(',') != startingState.tiles.join(',')) {
			const from = came_from.get(backward_current.tiles.join(',')) as {move: number; state: State};
			backward_current = from.state;
			moves.push(from.move);
		}
		return moves;
	}

	return undefined;
}
