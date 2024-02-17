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
        _minCollateralPercentage = WEI_UNIT * 60;
        WETH = _wethAddress;
        tokenAddress = _tokenAddress;
        _setRouter(_routerAddress);
        __ReentrancyGuard_init_unchained();
        __Ownable_init_unchained(msg.sender);
    }

    function interestPercentage() external view returns (uint256) {
        return _interestPercentage;
    }

    function minimumCollateralPercentage() external view returns (uint256) {
        return _minCollateralPercentage;
    }

    function lend(uint256 tokenAmount) external {
        // * improvement
        // * need more time for design and big brain with business logic for handleing about manage risk of lender
        _transferIn(false, tokenAddress, tokenAmount);
        totalLending += tokenAmount;
        lendingInfos[msg.sender] += tokenAmount;
        emit Lend(msg.sender, tokenAmount);
    }

    function unlend(uint256 tokenAmount) external {
        // * improvement
        // * need more logic for handle exchange rate if total balance not matched with lend balance
        require(
            tokenAmount <= lendingInfos[msg.sender],
            "lending-balance-exceed"
        );
        _transferOut(false, tokenAddress, msg.sender, tokenAmount);
        totalLending -= tokenAmount;
        lendingInfos[msg.sender] -= tokenAmount;
        emit Unlend(msg.sender, tokenAmount);
    }

    function borrow(
        address collateralToken,
        uint256 collateralAmount,
        uint256 borrowAmount
    ) external payable {
        address[] memory path = new address[](2);
        path[0] = collateralToken;
        path[1] = tokenAddress;
        uint256 dexRate;
        uint256 valueOfCollateral;
        uint256 minimumCollateral;
        {
            (uint256 reserveIn, uint256 reserveOut) = _getReserve(path);
            IERC20Metadata _collateralToken = IERC20Metadata(collateralToken);
            dexRate =
                (reserveOut * (10 ** _collateralToken.decimals())) /
                (reserveIn);

            valueOfCollateral =
                (dexRate * collateralAmount) /
                (10 ** _collateralToken.decimals());

            minimumCollateral =
                (borrowAmount * _minCollateralPercentage) /
                WEI_PERCENT_UNIT;

            require(
                valueOfCollateral >= minimumCollateral,
                "minimum-collateral-not-enough"
            );
            _transferIn(false, collateralToken, collateralAmount);
            _transferOut(false, tokenAddress, msg.sender, borrowAmount);
            totalBorrowing += borrowAmount;
            borrowingInfos[msg.sender] += borrowAmount;
        }
    }

    function repay(address repayToken, uint256 repayAmount) external payable {}

    // receive transfer ether directly
    receive() external payable {}

    // not support fallback function
    fallback() external payable {
        revert("not-support-fallback-function");
    }
}
