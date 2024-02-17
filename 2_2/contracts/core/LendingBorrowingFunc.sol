// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;
pragma abicoder v2;

import "./LendingBorrowingBase.sol";

contract LendingBorrowingFunc is LendingBorrowingBase {
    error InsufficientAmount(uint balanceOrProvidedFromInput, uint required);

    function setInterestPercentage(uint256 percent) external onlyOwner {
        uint256 oldValue = _interestPercentage;
        _interestPercentage = percent;
        emit SetInterestPercentage(msg.sender, oldValue, percent);
    }

    function _transferIn(bool isNative, uint256 amount) internal {
        if (isNative && tokenAddress == WETH) {
            IWethERC20Upgradeable(WETH).deposit{value: amount}();
            _transferETH(msg.sender, msg.value - amount);
        } else {
            {
                uint256 balance = IERC20(tokenAddress).balanceOf(msg.sender);
                if (balance < amount) {
                    revert InsufficientAmount(balance, amount);
                }
            }
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                amount
            );
        }
    }

    function _transferOut(bool isNative, address to, uint256 amount) internal {
        if (isNative && tokenAddress == WETH) {
            IWethERC20Upgradeable(WETH).withdraw(amount);
            if (address(this).balance < amount)
                revert InsufficientAmount(address(this).balance, amount);

            _transferETH(to, amount);
        } else {
            IERC20 tokenC = IERC20(tokenAddress);
            uint256 balance = tokenC.balanceOf(address(this));
            if (balance < amount) revert InsufficientAmount(balance, amount);

            tokenC.transfer(to, amount);
        }
    }

    function _transferETH(address target, uint256 amount) internal {
        (bool success, bytes memory returndata) = target.call{value: amount}(
            new bytes(0)
        );
        require(
            success,
            string(abi.encodePacked("transfer-ETH-failed: ", returndata))
        );
    }

    function _setRouter(address _router) internal {
        routerDex = IRouter(_router);
    }

    function _getReserve(
        address[] memory path
    ) internal view returns (uint256 reserveIn, uint256 reserveOut) {
        IFactory factory = IFactory(routerDex.factory());
        IPair pair = IPair(factory.getPair(path[0], path[1]));

        (reserveIn, reserveOut, ) = pair.getReserves();
        if (path[0] != pair.token0())
            (reserveIn, reserveOut) = (reserveOut, reserveIn);
    }
}
