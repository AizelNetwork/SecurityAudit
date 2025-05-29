const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const feeCoins = [ethers.ZeroAddress];
    const feeAmounts = [ethers.parseEther("0.01")];
    console.log("feeCoins:", feeCoins);
    console.log("feeAmounts:", feeAmounts);

    const FeeManager = await ethers.getContractFactory("FeeManager");
    const feeManager = await FeeManager.deploy(
        feeCoins,
        feeAmounts,
    );
    console.log("FeeManager deployed to:", feeManager.target);

    const models = [
        "DeepSeek-R1-Distill-Llama-8B-Q4_K_M",
        "DeepSeek-R1-Distill-Qwen-14B-Q4_K_M",
        "DeepSeek-R1-Distill-Qwen-32B-Q4_K_M",
        "Qwen3-1.7B-Q4_K_M",
        "Qwen3-14B-Q4_K_M",
        "Qwen3-32B-Q4_K_M",
        "Qwen3-8B-Q4_K_M",
        "gemma-3-12b-it-qat-Q4_K_M",
        "Llama-4-Scout-17B-16E-Instruct-Q4_K_M",
        "aizel/peaq-content-filter",
    ];

    // const AimosGateway = await ethers.getContractFactory("AimosGateway");
    // const aimosGateway = await AimosGateway.deploy(deployer.address, feeManager.target, models);
    // console.log("AimosGateway deployed to:", aimosGateway.target);

    const AimosGatewayUpgradeable = await ethers.getContractFactory("AimosGatewayUpgradeable");
    const aimosGatewayUpgradeable = await upgrades.deployProxy(AimosGatewayUpgradeable, [deployer.address, deployer.address, feeManager.target, models]);
    console.log("AimosGatewayUpgradeable deployed to:", aimosGatewayUpgradeable.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });