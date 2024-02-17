// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;

import "../core/LendingBorrowingBase.sol";

interface ILendingBorrowing {
    // TODO setter function

    // TODO getter function
    function interestPercentage() external returns (uint256);

    function minimumCollateralPercentage() external returns (uint256);

    function totalLending() external returns (uint256);

    function totalBorrowing() external returns (uint256);

    function borrowingInfos(address userAddress) external returns (LendingBorrowingBase.BorrowingInfos memory);

    function lendingInfos(address userAddress) external returns (uint256);

    function getRepayAmount() external view returns (uint256 repayAmount);

    // TODO action function
    function lend(uint256 tokenAmount) external payable;

    function unlend(address tokenAddress, uint256 tokenAmount) external;

    function borrow(
        address collateralToken,
        uint256 collateralAmount,
        uint256 borrowAmount
    ) external payable;

    function repay(uint256 repayAmount) external payable;
}
