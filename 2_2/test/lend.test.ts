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

describe('Testing lending function', () => {
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
        // await resetForkByBlock();
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
    context("Other lender lend/unlend too", () => {
        it("other approve and lend", async () => {
            const actor = deployer
            tx = await tokens.USDT.connect(actor).approve(proxy.address, ethers.constants.MaxUint256)
            res = await tx.wait(1)
            const beforeBalance = await tokens.USDT.balanceOf(proxy.address)
            tx = await proxy.connect(actor).lend
                (
                    parseEther(
                        1_000,
                        await deployed.TOKENS.USDT.decimals(),
                    )
                )
            res = await tx.wait(1)
            const afterBalance = await tokens.USDT.balanceOf(proxy.address)
            expect(afterBalance).to.be.gt(beforeBalance)
        })
        it("whale unlend", async () => {
            const actor = whales.USDT
            const beforeBalanceOfProxy = await tokens.USDT.balanceOf(proxy.address)
            const beforeBalanceOfWhale = await tokens.USDT.balanceOf(actor.address)
            const unlendAmount = parseEther(1_000_000, await tokens.USDT.decimals())
            await expect(proxy.connect(actor).unlend(unlendAmount)).to.be.not.reverted
            const afterBalanceOfProxy = await tokens.USDT.balanceOf(proxy.address)
            const afterBalanceOfWhale = await tokens.USDT.balanceOf(actor.address)
            expect(afterBalanceOfProxy).to.be.lt(beforeBalanceOfProxy)
            expect(afterBalanceOfWhale).to.be.gt(beforeBalanceOfWhale)
        })
    })

})