// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "solidity-proxy/solc_0.8/EIP1967/Proxied.sol";
import "solidity-kit/solc_0.8/ERC721/implementations/BasicERC721.sol";
import "solidity-kit/solc_0.8/ERC721/interfaces/IERC721Metadata.sol";
import {UltraVerifier} from "../zecret/contract/zecret/plonk_vk.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @notice a puzzle
contract VitalikSecret is BasicERC721, IERC721Metadata, Proxied {
    UltraVerifier zecret;

    enum Move {
        RIGHT,
        DOWN,
        LEFT,
        UP
    }

    uint256 public constant SIZE = 4;

    uint256 immutable INITIAL_POSITION = 7;
    uint256 immutable FINAL_POSITION = 10;

    uint256 public lowestNumberOfMoves;

    function randomState() public view returns (uint8[SIZE * SIZE] memory) {
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

    function proposeSolution(Move[] calldata moves) external {
        uint8[SIZE * SIZE] memory state = [2, 4, 7, 3, 10, 9, 6, 0, 5, 1, 11, 8, 12, 13, 14, 15];

        uint256 position = INITIAL_POSITION;

        for (uint256 i = 0; i < moves.length; i++) {
            bool valid;
            uint256 oldPosition = position;
            (valid, position) = step(state, position, moves[i]);
            require(
                valid,
                string.concat(
                    "invalid ",
                    Strings.toString(oldPosition),
                    " => ",
                    Strings.toString(position),
                    " : ",
                    Strings.toString(i)
                )
            );
        }

        require(state[FINAL_POSITION] == 0, "invalid solution (carret)");
        for (uint256 i = 0; i < FINAL_POSITION; i++) {
            require(state[i] == i + 1, "invalid solution 1/2");
        }
        for (uint256 i = FINAL_POSITION + 1; i < state.length; i++) {
            require(state[i] == i, "invalid solution 2/2");
        }

        require(lowestNumberOfMoves == 0 || moves.length < lowestNumberOfMoves, "MAKE_BETTER_MOVE");
        lowestNumberOfMoves = moves.length;
        _safeMint(msg.sender, moves.length);
    }

    function proposeSolutionProof(uint256 numMoves, bytes calldata proof) external {
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(numMoves);
        publicInputs[1] = bytes32(uint256(uint160(msg.sender)));
        require(lowestNumberOfMoves == 0 || numMoves < lowestNumberOfMoves, "MAKE_BETTER_MOVE");
        lowestNumberOfMoves = numMoves;
        _safeMint(msg.sender, numMoves);
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

    // TODO remove
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
        data[a] = bValue;
        data[b] = aValue;
    }

    function bytes32ToHexString(bytes32 _bytes32) public pure returns (string memory) {
        // Convert bytes32 to bytes memory
        bytes memory bytesArray = new bytes(32);
        for (uint256 i = 0; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }

        // Convert bytes to hex string
        bytes memory hexChars = "0123456789abcdef";
        bytes memory hexString = new bytes(64);
        for (uint256 j = 0; j < 32; j++) {
            hexString[j * 2] = hexChars[uint8(bytesArray[j] >> 4)];
            hexString[j * 2 + 1] = hexChars[uint8(bytesArray[j] & 0x0f)];
        }

        return string(hexString);
    }

    function randomSeed() internal view returns (uint256) {
        return 42;
    }
}
