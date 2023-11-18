class Node {
	private x: number;
	private y: number;
	private neighbors: number[];
	private previous: null;
	private g: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.neighbors = [];
		this.previous = null;
		this.g = 0; // Cost from start to this node
		this.h = 0; // Heuristic cost from this node to end
		this.f = 0; // Total cost (g + h)
	}

	addNeighbor(node) {
		this.neighbors.push(node);
	}
}

function heuristic(nodeA, nodeB) {
	// Using Manhattan distance as heuristic
	return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

function aStar(start, end) {
	let openSet = [start];
	let closedSet = [];
	let path = [];
	let current;

	while (openSet.length > 0) {
		// Find the node with the lowest f score
		let lowestIndex = 0;
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowestIndex].f) {
				lowestIndex = i;
			}
		}
		current = openSet[lowestIndex];

		// Found the goal
		if (current === end) {
			let temp = current;
			path.push(temp);
			while (temp.previous) {
				path.push(temp.previous);
				temp = temp.previous;
			}
			return path.reverse();
		}

		// Move current node from open to closed set
		openSet.splice(lowestIndex, 1);
		closedSet.push(current);

		// Check all the neighbors
		for (let i = 0; i < current.neighbors.length; i++) {
			let neighbor = current.neighbors[i];

			if (!closedSet.includes(neighbor)) {
				let tempG = current.g + 1;

				let newPath = false;
				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}

				if (newPath) {
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}
		}
	}

	// No solution
	return [];
}

// Example usage:
// Define the graph, add nodes and neighbors
// Call aStar with start and end nodes
