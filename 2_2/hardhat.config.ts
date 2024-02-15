import { task, HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "hardhat-deploy-ethers";
import "hardhat-contract-sizer";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-ganache";
import "@nomiclabs/hardhat-etherscan";
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
      { version: "0.8.24" },
      { version: "0.4.18" },
      { version: "0.4.24" },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
    overrides: {
      "contracts/core/*.sol": optimizedForDeployment(),
    }
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      forking: {
        url: process.env.URL!,
        blockNumber: 19232900,
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
  gasReporter: {
    enabled: false
  }
};

export default config;
