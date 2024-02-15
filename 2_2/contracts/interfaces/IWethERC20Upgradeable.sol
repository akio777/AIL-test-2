// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IWeth {
    function deposit() external payable;

    function withdraw(uint256 wad) external;
}

interface IWethERC20Upgradeable is IWeth, IERC20Upgradeable {}
