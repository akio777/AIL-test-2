import { ethers } from "hardhat";

import { ITransparentUpgradeableProxy, LendingBorrowing, LendingBorrowing__factory, TransparentUpgradeableProxy, TransparentUpgradeableProxy__factory } from "../types";

export async function deployLendingBorrowingLogic() {

    const contractFactory: LendingBorrowing__factory = await ethers.getContractFactory("LendingBorrowing")
    const contract: LendingBorrowing = await contractFactory.deploy()
    await contract.deployed()
    await contract.deployTransaction.wait(1)
    await contract.deployed()
    console.log("LENDING_BORROWING_LOGIC_ADDRESS : ", contract.address)
    return contract
}

export async function deployLendingBorrowingProxy(
    owner: string,
    loginAddress: string,
    wethAddress: string,
    routerAddress: string,
    tokenAddress: string
) {
    const TransparentUpgradeableProxyFactory: TransparentUpgradeableProxy__factory =
        await ethers.getContractFactory("TransparentUpgradeableProxy");
    const ABI = [
        "function initialize(address _wethAddress, address _routerAddress, address _tokenAddress)",
    ];
    const iface = new ethers.utils.Interface(ABI)
    const data = iface.encodeFunctionData("initialize", [
        wethAddress,
        routerAddress,
        tokenAddress
    ]);
    const proxy: TransparentUpgradeableProxy =
        await TransparentUpgradeableProxyFactory.deploy(loginAddress, owner, data);

    const iProxy: ITransparentUpgradeableProxy = await ethers.getContractAt(
        "ITransparentUpgradeableProxy",
        proxy.address
    );
    await proxy.deployTransaction.wait(1)
    await proxy.deployed()
    return iProxy;
}