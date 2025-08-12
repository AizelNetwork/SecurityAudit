const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const inferenceNode = deployer.address;
    const models = [
        "COA",
    ];

    const CoaInference = await ethers.getContractFactory("CoaInference");
    const coaInference = await CoaInference.deploy(inferenceNode, models);
    console.log("CoaInference deployed to:", coaInference.target);

    const CoaTransferAgent = await ethers.getContractFactory("CoaTransferAgent");
    const coaTransferAgent = await CoaTransferAgent.deploy(coaInference.target);
    console.log("CoaTransferAgent deployed to:", coaTransferAgent.target);

    // const usdt = ethers.ZeroAddress;
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    const usdt = await ERC20Mock.deploy("Mock USDT", "USDT", deployer.address, ethers.parseUnits("100000000", 18));
    console.log("Usdt deployed to:", usdt.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });