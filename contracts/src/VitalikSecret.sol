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
    uint256 public constant NUM_BITS_PER_CELL = 4;
    bytes public constant SOLUTION = "0x123456789ABCDEF0";

    // TODO immutable but constructor match a pre-agreed block hash
    bytes public constant RANDOM = "0x213456789ABCDFE0";
    uint256 immutable INITIAL_POSITION = 15;

    // TODO commit first to prevent front-running
    // function proposeSolution(bytes memory moves) external {
    function proposeSolution(Move[] calldata moves) external {
        bytes memory state = RANDOM;
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

        bool equal = _areBytesEqual(state, SOLUTION);
        if (!equal) {
            console.logBytes(state);
            console.logBytes(SOLUTION);
            bool equalRandom = _areBytesEqual(state, RANDOM);
            console.log(equalRandom ? "isSTILLRANDOM" : "diff");
            console.logBytes(RANDOM);
        }
        require(equal, "NOT EQUAL TO SOLUTION");
    }

    function step(
        bytes memory currentState,
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
        }
    }

    function tokenURI(uint256 tokenID) external view returns (string memory) {
        return "";
    }

    function name() external pure returns (string memory) {
        return "VITALIK SECRET";
    }

    function symbol() external pure returns (string memory) {
        return "VTS";
    }

    // ---------------------------------------------------------------------------
    function _at(bytes memory data, uint256 pos) internal returns (uint256 v) {
        assembly {
            let b := mload(add(add(data, 32), div(pos, 2)))
            v := and(b, 0xF)
            if eq(mod(pos, 2), 1) {
                v := shr(4, b)
            }
        }
    }

    function _swap(bytes memory data, uint256 a, uint256 b) internal {
        // transform logical position in buffer byte position:
        a = a * NUM_BITS_PER_CELL;
        b = b * NUM_BITS_PER_CELL;
        uint256 aValue = _extractBits(data, a, NUM_BITS_PER_CELL);
        uint256 bValue = _extractBits(data, b, NUM_BITS_PER_CELL);
        console.log(string.concat("a: ", Strings.toString(a), " = ", Strings.toString(aValue)));
        console.log(string.concat("b: ", Strings.toString(b), " = ", Strings.toString(bValue)));
        _setBits(data, a, bValue);
        _setBits(data, b, aValue);
    }

    function _extractBits(bytes memory data, uint256 offset, uint256 n) internal pure returns (uint256 result) {
        assembly {
            let startByteIndex := div(offset, 8) // 7.5
            let startBitIndex := mod(offset, 8) // 4
            result := shr(sub(256, n), shl(startBitIndex, mload(add(data, add(startByteIndex, 32)))))
        }
    }

    function _setBits(bytes memory data, uint256 offset, uint256 value) internal {
        assembly {
            // Calculate the starting byte and starting bit within that byte based on the provided offset
            let startByteIndex := div(offset, 8)
            let startBitIndex := mod(offset, 8)
            let start := add(data, add(startByteIndex, 32))

            let existing := mload(start)
            let v2 := 0
            if gt(startBitIndex, 0) {
                let v1 := 0
                v2 := 0
                mstore(add(data, add(startByteIndex, 32)), v1)
            }
            mstore(add(data, add(startByteIndex, 32)), v2)
        }
    }

    function _areBytesEqual(bytes memory a, bytes memory b) internal pure returns (bool) {
        if (a.length != b.length) {
            return false;
        }

        for (uint256 i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }

        return true;
    }
}
