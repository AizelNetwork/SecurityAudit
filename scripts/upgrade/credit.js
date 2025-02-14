const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    let nonce = await ethers.provider.getTransactionCount(deployer.address);
    console.log("Nonce:", nonce);

    // const usdt = ethers.ZeroAddress;
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    const usdt = await ERC20Mock.deploy("Mock USDT", "USDT", deployer.address, ethers.parseUnits("999999999999999", 18));
    console.log("Usdt deployed to:", usdt.target);

    // Get the contract factory
    const TokenCreditUpgradeable = await ethers.getContractFactory("TokenCreditUpgradeable");
    const tokenCredit = await upgrades.deployProxy(TokenCreditUpgradeable, [usdt.target]);
    console.log("TokenCredit deployed to:", tokenCredit.target);
    console.log("Finish token credit contract deployment");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });