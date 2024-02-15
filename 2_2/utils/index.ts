import { ethers, network } from 'hardhat'
import * as convertor from './convertor'
import * as unit from './unit'

export async function getCurrentBlock() {
    return await ethers.provider.getBlockNumber()
}

export const getCurrentTimestamp = async () => {
    let block = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber()
    );
    return block.timestamp;
};

export async function getSpecificBackwardBlockByDay(day: number) {
    const currentBlock = await getCurrentBlock()
    const backwardDay = convertor.days(day)
    const backwardBlock = currentBlock - (backwardDay / 3)
    return backwardBlock
}

export async function resetForkByBlock(block: number = 19232900) {
    await network.provider.request({
        method: "hardhat_reset",
        params: [
            {
                forking: {
                    jsonRpcUrl: process.env.URL!,
                    blockNumber: block,
                },
            },
        ],
    });
}

export default {
    convertor,
    unit,
}