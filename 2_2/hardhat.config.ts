import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";

import path from "path";
import * as dotenv from "dotenv";


dotenv.config({ path: path.resolve(__dirname, "./.env") });
const optimizedForDeployment = (version = "0.8.24", runs = 1000) => ({
  version: version,
  settings: {
    optimizer: {
      enabled: true,
      runs: runs,
    },
  },
});


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.24" }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
    overrides: {
      // "contracts/core/*.sol": optimizedForDeployment("0.8.22"),
    }
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      forking: {
        url: "",
        blockNumber: 10,
      },
      allowUnlimitedContractSize: true,
      gas: 30000000,
      chainId: 1337,
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 0,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
