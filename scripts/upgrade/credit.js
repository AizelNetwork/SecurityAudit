const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    let nonce = await ethers.provider.getTransactionCount(deployer.address);
    console.log("Nonce:", nonce);

    const usdt = "Zero";
    console.log("usdt:", usdt);

    // Get the contract factory
    const TokenCreditUpgradeable = await ethers.getContractFactory("TokenCreditUpgradeable");

    const tokenCredit = await upgrades.deployProxy(TokenCreditUpgradeable, [usdt]);
    console.log("TokenCredit deployed to:", tokenCredit.target);
    console.log("Finish token credit contract deployment");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });