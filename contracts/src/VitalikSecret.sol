// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "solidity-proxy/solc_0.8/EIP1967/Proxied.sol";
import "solidity-kit/solc_0.8/ERC721/implementations/BasicERC721.sol";
import "solidity-kit/solc_0.8/ERC721/interfaces/IERC721Metadata.sol";

/// @notice a puzzle
contract VitalikSecret is BasicERC721, IERC721Metadata, Proxied {
    enum Move {
        RIGHT,
        DOWN,
        LEFT,
        UP
    }

    uint256 public constant SIZE = 4;
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
            (valid, position) = step(state, position, moves[i]);
            require(valid, "INVALID_MOVE");
        }
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
                // newState =
            }
        } else if (move == Move.DOWN) {
            if (y < SIZE - 1) {
                valid = true;
                // newState =
            }
        } else if (move == Move.LEFT) {
            if (x > 0) {
                valid = true;
                // newState =
            }
        } else if (move == Move.UP) {
            if (y > 0) {
                valid = true;
                // newState =
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
}
