const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const models = [
        "peaq_model_filter_tinybert.tar.gz",
        "peaq_model_filter.tar.gz",
        "Llama-3.3-70B-Instruct-Q8_0.gguf",
        "combinder_model.tar.gz",
        "eth_predict.tar.gz",
        "llama-3.2-3b-instruct-q4_k_m.gguf",
        "llama-3.2-1b-instruct-q8_0.gguf",
        "Transfer-Agent"
    ];

    const AimosGateway = await ethers.getContractFactory("AimosGateway");
    const aimosGateway = await AimosGateway.deploy(deployer.address, models);
    console.log("AimosGateway deployed to:", aimosGateway.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });