// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "solidity-proxy/solc_0.8/EIP1967/Proxied.sol";
import "solidity-kit/solc_0.8/ERC721/implementations/BasicERC721.sol";
import "solidity-kit/solc_0.8/ERC721/interfaces/IERC721Metadata.sol";

/// @notice a puzzle
contract VitalikSecret is BasicERC721, IERC721Metadata, Proxied {
    // TODO commit first to prevent front-running
    function proposeSolution(bytes memory moves) external {
        // TODO check move to match result
    }

    function tokenURI(uint256 tokenID) external view returns (string memory) {
        return "";
    }

    function name() external pure returns (string memory) {
        return "VITALIK SECRET";
    }

    function symbol() external pure returns (string memory) {
        return "VTKS";
    }
}
