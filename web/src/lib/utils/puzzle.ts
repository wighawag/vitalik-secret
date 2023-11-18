type PuzzleList = number[];

// Type for a node in the search space
interface PuzzleNode {
	puzzle: PuzzleList;
	heuristic: number;
	cost: number;
	depth: number;
	prev: PuzzleNode | null;
}

// Function to swap elements at two indices in an array
function swap(i: number, j: number, arr: PuzzleList): PuzzleList {
	const newArr = [...arr];
	[newArr[i], newArr[j]] = [newArr[j], newArr[i]];
	return newArr;
}

// Function to generate possible moves from a given puzzle state
function generateMoves(p: PuzzleList, n: number): PuzzleList[] {
	const emptyIndex = p.indexOf(0);
	const neighbors = [emptyIndex - 1, emptyIndex + 1, emptyIndex - n, emptyIndex + n].filter((i) => i >= 0 && i < n * n);

	return neighbors.map((neighbor) => swap(emptyIndex, neighbor, p));
}

// Function to calculate the Manhattan distance between two puzzle states
function manhattanDistance(p1: PuzzleList, p2: PuzzleList, n: number): number {
	return p1.reduce((sum, tile, index) => {
		if (tile !== 0) {
			const x1 = index % n;
			const y1 = Math.floor(index / n);
			const x2 = p2.indexOf(tile) % n;
			const y2 = Math.floor(p2.indexOf(tile) / n);
			return sum + Math.abs(x1 - x2) + Math.abs(y1 - y2);
		}
		return sum;
	}, 0);
}

// Function to perform the A* search
function astar(openSet: PuzzleNode[], goal: PuzzleList, visited: string[], n: number): PuzzleNode | null {
	if (openSet.length === 0) return null;

	const currentNode = openSet.shift()!;
	if (currentNode.puzzle.join(',') === goal.join(',')) {
		return currentNode;
	}
	if (visited.includes(currentNode.puzzle.join(','))) {
		return astar(openSet, goal, visited, n);
	}

	const nextMoves = generateMoves(currentNode.puzzle, n);
	const newNodes = nextMoves.map((move) => ({
		puzzle: move,
		heuristic: manhattanDistance(move, goal, n) + currentNode.depth + 1,
		cost: currentNode.depth + 1,
		depth: currentNode.depth + 1,
		prev: currentNode,
	}));

	const sortedNodes = [...newNodes, ...openSet].sort((a, b) => a.heuristic + a.cost - (b.heuristic + b.cost));
	return astar(sortedNodes, goal, [currentNode.puzzle.toString(), ...visited], n);
}

// Function to extract the path from the solution node
function extractPath(node: PuzzleNode): PuzzleList[] {
	return node.prev ? [...extractPath(node.prev), node.puzzle] : [node.puzzle];
}

export function createPuzzle(size: number, start: PuzzleList, goal: PuzzleList) {
	return {
		solve() {
			const initialNode: PuzzleNode = {
				puzzle: start,
				heuristic: manhattanDistance(start, goal, size),
				cost: 0,
				depth: 0,
				prev: null,
			};

			const solutionNode = astar([initialNode], goal, [], size);
			return solutionNode ? extractPath(solutionNode).reverse() : null;
		},
	};
}
