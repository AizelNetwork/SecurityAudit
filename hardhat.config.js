require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

// only github action use
const DEPLOYER_PRIVATE_KEY = "1314caea4de1dc11d2c7403fc727b907eb7ab2a0857374f603e219cf7a203240";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    sepolia: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    devnet: {
      url: `http://34.124.144.235:8555`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    develop: {
      url: `http://34.124.144.235:9957`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    mevm: {
      url: `https://mevm.devnet.imola.movementlabs.xyz`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    neon: {
      url: `https://devnet.neonevm.org`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    evmos: {
      url: `http://34.124.144.235:8555`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    base: {
      url: `https://sepolia.base.org`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  // etherscan: {
  //   apiKey: {
  //     sepolia: ETHERSCAN_API_KEY,
  //   },
  // },
};
