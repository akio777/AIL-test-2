// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

import "../interfaces/IWethERC20Upgradeable.sol";
import "./LendingBorrowingEvent.sol";
import "../interfaces/IDex.sol";

import "hardhat/console.sol";

contract LendingBorrowingBase is
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    LendingBorrowingEvent
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeERC20Upgradeable for IWethERC20Upgradeable;

    uint256 internal WEI_UNIT;
    uint256 internal WEI_PERCENT_UNIT;

    address public WETH;
    IRouter public routerDex;
    address public tokenAddress;
    uint256 internal _interestPercentage;

    mapping(address => uint256) public lendingInfos;
}
