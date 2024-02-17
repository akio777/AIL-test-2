// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;

contract LendingBorrowingEvent {
    event Lend(address indexed sender, uint256 amount);
    event Unlend(address indexed sender, uint256 amount);
    event Borrow(
        address indexed sender,
        address collateralToken,
        uint256 collateralAmount,
        uint256 borrowAmount
    );

    event Repay(address indexed sender, uint256 repayAmount);

    event SetInterestPercentage(
        address indexed sender,
        uint256 oldValue,
        uint256 newValue
    );
}
