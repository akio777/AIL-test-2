// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;

interface ILendingBorrowing {
    // // TODO event
    // event Lend(address indexed sender, address token, uint256 amount);
    // event Unlend(address indexed sender, address token, uint256 amount);
    // event Borrow(
    //     address indexed sender,
    //     address collateralToken,
    //     uint256 collateralAmount,
    //     address borrowToken,
    //     uint256 borrowAmount
    // );

    // event Repay(
    //     address indexed sender,
    //     address repayToken,
    //     uint256 repayAmount,
    //     uint256 interest
    // );

    // event SetInterestPercentage(
    //     address indexed sender,
    //     uint256 oldValue,
    //     uint256 newValue
    // );

    // // TODO custom error
    // error InsufficientAmount(uint balanceOrProvidedFromInput, uint required);

    // TODO setter function

    // TODO getter function
    function interestPercentage() external returns (uint256);

    // TODO action function
    function lend(uint256 tokenAmount) external payable;

    function unlend(address tokenAddress, uint256 tokenAmount) external;

    function borrow(
        address collateralToken,
        uint256 collateralAmount,
        address borrowToken,
        uint256 borrowAmount
    ) external payable;

    function repay(address repayToken, uint256 repayAmount) external payable;
}
