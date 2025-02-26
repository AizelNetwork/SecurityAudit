const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const nftName = "Zero"; // NFT name
    const nftSymbol = "ZERO"; // NFT symbol
    const weth = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // weth address
    const rewardPercent = 50; // base 100 - 50%
    const transferValidator = "0x721C002B0059009a671D00aD1700c9748146cd1B"; // transfer validator address
    const royaltyPercent = 500; // base 10000 - 5%
    console.log("NFT Name:", nftName);
    console.log("NFT Symbol:", nftSymbol);
    console.log("WETH Address:", weth);
    console.log("Reward Percent:", rewardPercent);
    console.log("Transfer Validator Address:", transferValidator);
    console.log("Royalty Percent:", royaltyPercent);

    // Get the contract factory
    const ZeroUpgradeable = await ethers.getContractFactory("ZeroUpgradeable");
    const ZeroRoyaltyUpgradeable = await ethers.getContractFactory("ZeroRoyaltyUpgradeable");

    const zero = await upgrades.deployProxy(ZeroUpgradeable, [nftName,
        nftSymbol]);
    console.log("Zero deployed to:", zero.target);

    const royalty = await upgrades.deployProxy(ZeroRoyaltyUpgradeable, [weth,
        zero.target,
        rewardPercent,]);
    console.log("Royalty deployed to:", royalty.target);

    await zero.setDefaultRoyalty(royalty.target, royaltyPercent);
    await zero.setTransferValidator(transferValidator);
    console.log("Finish zero and royalty contract deployment and transfer validator setup");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });