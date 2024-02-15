// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

// import "../interfaces/IWethERC20Upgradeable.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IERC20 {
    function transfer(address to, uint256 value) external;

    function transferFrom(address from, address to, uint256 value) external;
}

contract Temp {
    // using SafeERC20 for IERC20;
    // using SafeERC20Upgradeable for IWethERC20Upgradeable;
    address public token;

    constructor(address _token) {
        token = _token;
    }

    function lend(uint256 amount) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    receive() external payable {}

    // not support fallback function
    fallback() external payable {
        revert("not-support-fallback-function");
    }
}
