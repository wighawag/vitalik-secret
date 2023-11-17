// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "solidity-proxy/solc_0.8/EIP1967/Proxied.sol";
import "solidity-kit/solc_0.8/ERC721/implementations/BasicERC721.sol";

/// @notice a puzzle
contract VitalikSecret is BasicERC721, Proxied {
    // TODO commit first to prevent front-running
    function proposeSolution(bytes memory moves) external {
        // TODO check move to match result
    }
}
