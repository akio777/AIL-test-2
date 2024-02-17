import chai, { expect } from "chai";
import { ethers } from "hardhat";

import { impersonateAccount, SnapshotRestorer, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { ContractReceipt, ContractTransaction } from "ethers";
import { resetForkByBlock } from "../utils";
import { getWrappedSigners } from "../utils/signers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deploy, DeployedStruct, TOKENS, WHALES } from "../scripts/deploy";
import { parseEther } from "../utils/convertor";
import { ILendingBorrowing, LendingBorrowing } from "../types";

// chai.use(solidityPack);

describe('Testing repay function', () => {
    let timeslot: SnapshotRestorer[] = [];
    let tx: ContractTransaction;
    let res: ContractReceipt;
    let deployer: SignerWithAddress;
    let signers: SignerWithAddress[];
    let deployed: DeployedStruct;
    let tokens: TOKENS
    let whales: WHALES
    let proxy: LendingBorrowing
    before(async () => {
        await resetForkByBlock();
        signers = await getWrappedSigners();
        deployer = signers[0];
        await impersonateAccount(deployer.address);
        deployed = await deploy();
        timeslot.push(await takeSnapshot());
        tokens = deployed.TOKENS
        whales = deployed.WHALE
        proxy = deployed.PROXY
    });

    context("Whale mock lending bluk with 10M USDT", () => {
        it("Approve and Lending", async () => {
            const actor = whales.USDT
            tx = await tokens.USDT.connect(actor).approve(proxy.address, ethers.constants.MaxUint256)
            res = await tx.wait(1)
            const beforeBalance = await tokens.USDT.balanceOf(proxy.address)
            tx = await proxy.connect(actor).lend
                (
                    parseEther(
                        10_000_000,
                        await deployed.TOKENS.USDT.decimals(),
                    )
                )
            res = await tx.wait(1)
            const afterBalance = await tokens.USDT.balanceOf(proxy.address)
            expect(afterBalance).to.be.gt(beforeBalance)
        })
    })
    context("user1 borrow and try repay", () => {

        it("Approve USDT, WETH proxy", async () => {
            const actor = signers[1]
            await tokens.USDT.connect(actor).approve(proxy.address, ethers.constants.MaxUint256)
            await tokens.WETH.connect(actor).approve(proxy.address, ethers.constants.MaxUint256)
        })
        it("checking balance before borrow", async () => {
            const actor = signers[1]
            expect(await tokens.USDT.balanceOf(actor.address)).to.be.gt(parseEther(0))
            expect(await ethers.provider.getBalance(actor.address)).to.be.gt(parseEther(0))
            expect(await tokens.WETH.balanceOf(actor.address)).to.be.gt(parseEther(0))
            expect(await tokens.WBTC.balanceOf(actor.address)).to.be.eq(parseEther(0))
            timeslot.push(await takeSnapshot())
        })
        it("user1 call borrowing function happy case", async () => {
            const actor = signers[1]
            const collateralAmount = parseEther(2, await tokens.WETH.decimals())
            const borrowAmount = parseEther(1000, await tokens.USDT.decimals())
            const beforeBalanceUSDTProxy = await tokens.USDT.balanceOf(proxy.address)
            const beforeBalanceWETHProxy = await tokens.WETH.balanceOf(proxy.address)
            const beforeBalanceUSDTActor = await tokens.USDT.balanceOf(actor.address)
            await expect(
                proxy.connect(actor).borrow(
                    tokens.WETH.address,
                    collateralAmount,
                    borrowAmount,
                )
            ).to.be.not.reverted
            const afterBalanceUSDTProxy = await tokens.USDT.balanceOf(proxy.address)
            const afterBalanceWETHProxy = await tokens.WETH.balanceOf(proxy.address)
            const afterBalanceUSDTActor = await tokens.USDT.balanceOf(actor.address)
            expect(beforeBalanceUSDTProxy).to.be.gt(afterBalanceUSDTProxy)
            expect(beforeBalanceWETHProxy).to.be.lt(afterBalanceWETHProxy)
            expect(beforeBalanceUSDTActor).to.be.lt(afterBalanceUSDTActor)
            timeslot.push(await takeSnapshot())
        })
        it("user1 repay full 100%", async () => {
            const actor = signers[1]
            const borrowAmount = parseEther(1000, await tokens.USDT.decimals())
            const beforeBalanceUSDTProxy = await tokens.USDT.balanceOf(proxy.address)
            const beforeBalanceWETHProxy = await tokens.WETH.balanceOf(proxy.address)
            const beforeBalanceUSDTActor = await tokens.USDT.balanceOf(actor.address)
            const getRepayAmount = await proxy.connect(actor).getRepayAmount();
            await expect(
                proxy.connect(actor).repay(
                    getRepayAmount
                )
            ).to.be.not.reverted
            const afterBalanceUSDTProxy = await tokens.USDT.balanceOf(proxy.address)
            const afterBalanceWETHProxy = await tokens.WETH.balanceOf(proxy.address)
            const afterBalanceUSDTActor = await tokens.USDT.balanceOf(actor.address)
            expect(beforeBalanceUSDTProxy).to.be.lt(afterBalanceUSDTProxy)
            expect(beforeBalanceWETHProxy).to.be.gt(afterBalanceWETHProxy)
            expect(beforeBalanceUSDTActor).to.be.gt(afterBalanceUSDTActor)
        })
        it("user1 repay partial (repay partial not return collateral)", async () => {
            await timeslot[2].restore()
            const actor = signers[1]
            const borrowAmount = parseEther(500, await tokens.USDT.decimals())
            const beforeBalanceUSDTProxy = await tokens.USDT.balanceOf(proxy.address)
            const beforeBalanceUSDTActor = await tokens.USDT.balanceOf(actor.address)
            await expect(
                proxy.connect(actor).repay(
                    borrowAmount
                )
            ).to.be.not.reverted
            const afterBalanceUSDTProxy = await tokens.USDT.balanceOf(proxy.address)
            const afterBalanceUSDTActor = await tokens.USDT.balanceOf(actor.address)
            expect(beforeBalanceUSDTProxy).to.be.lt(afterBalanceUSDTProxy)
            expect(beforeBalanceUSDTActor).to.be.gt(afterBalanceUSDTActor)
        })



    })

})