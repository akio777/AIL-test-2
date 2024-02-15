import { impersonateAccount, setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractReceipt, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { ILendingBorrowing, LendingBorrowing, WETH9 } from "../types";
import { IERC20 } from "../types/contracts/interfaces/IERC20";
import { parseEther } from "../utils/convertor";
import { getWrappedSigners } from "../utils/signers";
import ADDRESS from "./addresses.json";
import { deployLendingBorrowingLogic, deployLendingBorrowingProxy } from "./deploy-lendingborrowing";

export interface TOKENS {
    USDT: IERC20;
    WBTC: IERC20;
    WETH: WETH9;
}

export async function deploy(): Promise<DeployedStruct> {

    const signers = await getWrappedSigners()
    const deployer = signers[0]
    let tx: ContractTransaction;
    let res: ContractReceipt;

    const logic = await deployLendingBorrowingLogic()
    const proxy = await deployLendingBorrowingProxy(
        deployer.address,
        logic.address,
        ADDRESS.WETH,
        ADDRESS.ROUTER,
        ADDRESS.USDT
    )
    const IERC20Artifact = "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol:IERC20Metadata"
    const TOKENS: TOKENS = {
        //@ts-ignore
        USDT: await ethers.getContractAt(
            IERC20Artifact,
            ADDRESS.USDT
        ),
        //@ts-ignore
        WBTC: await ethers.getContractAt(
            IERC20Artifact,
            ADDRESS.WBTC
        ),
        WETH: await ethers.getContractAt("WETH9", ADDRESS.WETH),
    };
    const _proxy: LendingBorrowing = await ethers.getContractAt("LendingBorrowing", proxy.address)

    // * MOCK TOKEN HERE
    const WHALE_USDT_ADDRESS = "0xF977814e90dA44bFA03b6295A0616a897441aceC"
    const WHALE_USDT = await ethers.getSigner(WHALE_USDT_ADDRESS)
    await impersonateAccount(WHALE_USDT.address)
    const WHALE_WETH_ADDRESS = "0x1681195C176239ac5E72d9aeBaCf5b2492E0C4ee"
    const WHALE_WETH = await ethers.getSigner(WHALE_WETH_ADDRESS)
    await impersonateAccount(WHALE_WETH.address)
    const WHALE_WBTC_ADDRESS = "0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8"
    const WHALE_WBTC = await ethers.getSigner(WHALE_WBTC_ADDRESS)
    await impersonateAccount(WHALE_WBTC.address)

    await setBalance(WHALE_USDT.address, parseEther(100))
    await setBalance(WHALE_WETH.address, parseEther(100))
    await setBalance(WHALE_WBTC.address, parseEther(100))

    console.log("Starting mock require token")
    for (const signer of signers) {
        tx = await TOKENS.USDT.connect(WHALE_USDT).transfer(
            signer.address,
            parseEther(1_000, await TOKENS.USDT.decimals())
        )
        res = await tx.wait(1);
        tx = await TOKENS.WETH.connect(WHALE_WETH).transfer(
            signer.address,
            parseEther(10, await TOKENS.WETH.decimals())
        )
        res = await tx.wait(1);
        tx = await TOKENS.WETH.connect(WHALE_WETH).transfer(
            signer.address,
            parseEther(10, await TOKENS.WETH.decimals())
        )
    }
    console.log("Done")
    console.log("   -   -   -   -   -   -   -   -   -   -   -   -")
    return {
        TOKENS,
        PROXY: _proxy,
        WHALE: {
            USDT: WHALE_USDT,
            WETH: WHALE_WETH,
            WBTC: WHALE_WBTC
        }
    }

}

export interface WHALES {
    USDT: SignerWithAddress
    WETH: SignerWithAddress
    WBTC: SignerWithAddress
}

export interface DeployedStruct {
    TOKENS: TOKENS,
    PROXY: LendingBorrowing,
    WHALE: WHALES
}