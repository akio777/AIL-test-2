// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;
pragma abicoder v2;

import "./LendingBorrowingFunc.sol";

contract LendingBorrowing is LendingBorrowingFunc {
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _wethAddress,
        address _routerAddress,
        address _tokenAddress
    ) external initializer {
        WEI_UNIT = 10 ** 18;
        WEI_PERCENT_UNIT = 10 ** 20;
        WETH = _wethAddress;
        tokenAddress = _tokenAddress;
        _setRouter(_routerAddress);
        __ReentrancyGuard_init_unchained();
        __Ownable_init_unchained(msg.sender);
    }

    function interestPercentage() external view returns (uint256) {
        return _interestPercentage;
    }

    function lend(uint256 tokenAmount) external {
        // * improvement
        // * need more time for design and big brain with business logic for handleing about manage risk of lender
        console.log("token : ", tokenAddress);
        _transferIn(false, tokenAmount);
        lendingInfos[msg.sender] += tokenAmount;
        emit Lend(msg.sender, tokenAmount);
    }

    function unlend(address tokenAddress, uint256 tokenAmount) external {}

    function borrow(
        address collateralToken,
        uint256 collateralAmount,
        address borrowToken,
        uint256 borrowAmount
    ) external payable {}

    function repay(address repayToken, uint256 repayAmount) external payable {}

    // receive transfer ether directly
    receive() external payable {}

    // not support fallback function
    fallback() external payable {
        revert("not-support-fallback-function");
    }
}
