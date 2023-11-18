// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "solidity-proxy/solc_0.8/EIP1967/Proxied.sol";
import "solidity-kit/solc_0.8/ERC721/implementations/BasicERC721.sol";
import "solidity-kit/solc_0.8/ERC721/interfaces/IERC721Metadata.sol";

// DEBUG
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @notice a puzzle
contract VitalikSecret is BasicERC721, IERC721Metadata, Proxied {
    enum Move {
        RIGHT,
        DOWN,
        LEFT,
        UP
    }

    uint256 public constant SIZE = 4;
    uint256 immutable INITIAL_POSITION = 15;

    uint256 public lowestNumberOfMoves;

    function randomSeed() internal view returns (uint256) {
        //TODO from future block hash
        return 42;
    }

    function initialState() public view returns (uint8[SIZE * SIZE] memory) {
        uint8[SIZE * SIZE] memory state;
        uint256 randomBoardSize = state.length - 1;
        state[randomBoardSize] = 0;
        for (uint256 i = 0; i < randomBoardSize; i++) {
            state[i] = uint8(i + 1);
        }
        uint256 seed = randomSeed();
        for (uint256 i = 0; i < randomBoardSize; i++) {
            uint256 n = i + (uint256(keccak256(abi.encodePacked(seed))) % (randomBoardSize - i));
            uint8 temp = state[n];
            state[n] = state[i];
            state[i] = temp;
        }
        return state;
    }

    // TODO commit first to prevent front-running
    // function proposeSolution(bytes memory moves) external {
    function proposeSolution(Move[] calldata moves) external {
        uint8[SIZE * SIZE] memory state = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0];
        //uint8[SIZE*SIZE] memory state = initialState();

        uint256 position = INITIAL_POSITION;

        for (uint256 i = 0; i < moves.length; i++) {
            bool valid;
            uint256 oldPosition = position; // TODO remove
            (valid, position) = step(state, position, moves[i]);
            if (valid) {
                console.log(
                    string.concat(
                        Strings.toString(oldPosition),
                        " => ",
                        Strings.toString(position),
                        " : ",
                        Strings.toString(uint8(moves[i]))
                    )
                );
            }
            require(
                valid,
                string.concat(
                    "invalid ",
                    Strings.toString(oldPosition),
                    " => ",
                    Strings.toString(position),
                    " : ",
                    Strings.toString(uint8(moves[i]))
                )
            );
        }

        // TODO currently the blank is bot right, but it should be instead of bulge
        require(state[state.length - 1] == 0, "invalid solution (carret)");
        for (uint256 i = 0; i < state.length - 1; i++) {
            require(state[i] == i + 1, "invalid solution");
        }

        require(lowestNumberOfMoves == 0 || moves.length < lowestNumberOfMoves, "TOO_MANY_MOVES");
        lowestNumberOfMoves = moves.length;
        _safeMint(msg.sender, moves.length);
    }

    function step(
        uint8[SIZE * SIZE] memory currentState,
        uint256 position,
        Move move
    ) internal returns (bool valid, uint256 newPosition) {
        uint256 x = position % SIZE;
        uint256 y = position / SIZE;
        if (move == Move.RIGHT) {
            if (x < SIZE - 1) {
                valid = true;
                newPosition = y * SIZE + x + 1;
                _swap(currentState, position, newPosition);
            }
        } else if (move == Move.DOWN) {
            if (y < SIZE - 1) {
                valid = true;
                newPosition = (y + 1) * SIZE + x;
                _swap(currentState, position, newPosition);
            }
        } else if (move == Move.LEFT) {
            if (x > 0) {
                valid = true;
                newPosition = y * SIZE + x - 1;
                _swap(currentState, position, newPosition);
            }
        } else if (move == Move.UP) {
            if (y > 0) {
                valid = true;
                newPosition = (y - 1) * SIZE + x;
                _swap(currentState, position, newPosition);
            }
        } else {
            valid = false;
        }
    }

    function tokenURI(uint256 tokenID) external pure returns (string memory) {
        string memory name = "Vitalik's%20secret";
        return
            string(
                string.concat(
                    'data:application/json,{"name":"',
                    name,
                    '","description":"',
                    name,
                    '","image":"',
                    "data:image/svg+xml,<svg%2520viewBox='0%25200%252032%252016'%2520xmlns='http://www.w3.org/2000/svg'><text%2520x='50%'%2520y='50%'%2520dominant-baseline='middle'%2520text-anchor='middle'%2520style='fill:rgb(219,39,119);font-size:2px;'>",
                    Strings.toString(tokenID),
                    "%20",
                    "moves",
                    "</text></svg>"
                    '"}'
                )
            );
    }

    function testMint(uint256 numMoves) external {
        if (lowestNumberOfMoves == 0 || numMoves < lowestNumberOfMoves) {
            lowestNumberOfMoves = numMoves;
        }
        _safeMint(msg.sender, numMoves);
    }

    function name() external pure returns (string memory) {
        return "VITALIK SECRET";
    }

    function symbol() external pure returns (string memory) {
        return "VTS";
    }

    function _swap(uint8[SIZE * SIZE] memory data, uint256 a, uint256 b) internal pure {
        uint8 aValue = data[a];
        uint8 bValue = data[b];
        console.log(string.concat("a: ", Strings.toString(a), " = ", Strings.toString(aValue)));
        console.log(string.concat("b: ", Strings.toString(b), " = ", Strings.toString(bValue)));
        data[a] = bValue;
        data[b] = aValue;
    }
}
