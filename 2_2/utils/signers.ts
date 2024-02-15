import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ethers } from 'hardhat';

export async function getWrappedSigners() {
    const signers = await ethers.getSigners();
    return signers
}
