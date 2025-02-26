const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const admin = deployer.address;
    console.log("Using account:", admin);

    /// deploy contract
    console.log("Start contract deployment");

    // verifier node 
    const minStake = 100000000000;
    const slashRatio = 10;
    console.log("minStake:", minStake);
    console.log("slashRatio:", slashRatio);

    const VerifierNodeUpgradeable = await ethers.getContractFactory("VerifierNodeUpgradeable");
    const verifierNodeUpgradeable = await upgrades.deployProxy(VerifierNodeUpgradeable, [admin, admin, minStake, slashRatio]);
    console.log("VerifierNodeUpgradeable deployed to:", verifierNodeUpgradeable.target);

    // verifier node 
    const VerifierUpgradeable = await ethers.getContractFactory("VerifierUpgradeable");
    const verifierUpgradeable = await upgrades.deployProxy(VerifierUpgradeable, [admin, verifierNodeUpgradeable.target]);
    console.log("VerifierUpgradeable deployed to:", verifierUpgradeable.target);
    await verifierNodeUpgradeable.updateVerifier(verifierUpgradeable.target);
    console.log("VerifierNodeUpgradeable updated verifier to:", verifierUpgradeable.target);

    // data node
    const DataNodeUpgradeable = await ethers.getContractFactory("DataNodeUpgradeable");
    const dataNodeUpgradeable = await upgrades.deployProxy(DataNodeUpgradeable, [admin, verifierUpgradeable.target, minStake, slashRatio]);
    console.log("DataNodeUpgradeable deployed to:", dataNodeUpgradeable.target);

    // inference node
    const InferenceNodeUpgradeable = await ethers.getContractFactory("InferenceNodeUpgradeable");
    const inferenceNodeUpgradeable = await upgrades.deployProxy(InferenceNodeUpgradeable, [admin, verifierUpgradeable.target, minStake, slashRatio, dataNodeUpgradeable.target]);
    console.log("InferenceNodeUpgradeable deployed to:", inferenceNodeUpgradeable.target);

    // models
    const maxModelType = 1;
    console.log("maxModelType:", maxModelType);

    const ModelsUpgradeable = await ethers.getContractFactory("ModelsUpgradeable");
    const modelsUpgradeable = await upgrades.deployProxy(ModelsUpgradeable, [maxModelType, admin]);
    console.log("ModelsUpgradeable deployed to:", modelsUpgradeable.target);

    // fee manager
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

    // inference
    const InferenceUpgradeable = await ethers.getContractFactory("InferenceUpgradeable");
    const inferenceUpgradeable = await upgrades.deployProxy(InferenceUpgradeable, [admin, inferenceNodeUpgradeable.target, modelsUpgradeable.target, verifierUpgradeable.target, feeManager.target, slashRatio]);
    console.log("InferenceUpgradeable deployed to:", inferenceUpgradeable.target);

    // transfer agent
    const TransferAgentUpgradeable = await ethers.getContractFactory("TransferAgentUpgradeable");
    const transferAgentUpgradeable = await upgrades.deployProxy(TransferAgentUpgradeable, [inferenceUpgradeable.target, admin]);
    console.log("TransferAgentUpgradeable deployed to:", transferAgentUpgradeable.target);
    console.log("Finish contract deployment");

    ///contract init
    console.log("Start contract init");
    // init verifier contract
    const serviceName = "Inference";
    await verifierUpgradeable.registerService([serviceName, inferenceUpgradeable.target, inferenceNodeUpgradeable.target]);

    // init models contract
    const appName = "TestApp";
    const appUri = "https://testapp.com";
    const intervalClaim = 86400;
    console.log("appName:", appName);
    console.log("appUri:", appUri);
    console.log("intervalClaim:", intervalClaim);
    await modelsUpgradeable.newApp(appName, appUri, intervalClaim);

    // init data node contract
    const name = "dn_name0";
    const bio = "dn_bio0";
    const url = "http://34.87.161.84:9112";
    const beastUrl = "http://34.126.123.17:8080";
    console.log("name:", name);
    console.log("bio:", bio);
    console.log("url:", url);
    console.log("beastUrl:", beastUrl);

    await dataNodeUpgradeable.registerNode(
        name, bio, url, beastUrl
        , { value: minStake });

    // 
    console.log("Finish contract init");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });