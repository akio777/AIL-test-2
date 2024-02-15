// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;

interface IRouter {
    function factory() external view returns (address);
}

interface IPair {
    function getReserves()
        external
        view
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        );

    function factory() external view returns (address);

    function token0() external view returns (address);

    function token1() external view returns (address);
}

interface IFactory {
    function getPair(
        address addressA,
        address addressB
    ) external view returns (address);
}
