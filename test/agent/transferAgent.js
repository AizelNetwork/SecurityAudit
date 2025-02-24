const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TransferAgent", function () {
    let owner;
    let requester;
    let nodeOwner;
    let receiver;
    let token;
    let transferAgent;
    let inference;
    let dataNode;
    let inferenceNode;
    let models;
    let feeManager;

    beforeEach(async function () {
        [owner, verifier, requester, receiver, nodeOwner] = await ethers.getSigners();

        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        token = await ERC20Mock.deploy("Test Token", "TT", owner.address, ethers.parseEther("10000000"));
        await token.transfer(requester.address, ethers.parseEther("1000"));

        // 部署 DataNode 合约
        const DataNode = await ethers.getContractFactory("DataNode");
        dataNode = await DataNode.deploy(
            owner.address,
            verifier.address,
            ethers.parseEther("1"), // minStake
            10 // slashRatio
        );

        // 在 DataNode 中注册一个节点
        await dataNode.connect(nodeOwner).register(
            "DataNode1",
            "Test data node",
            "http://datanode1.com",
            { value: ethers.parseEther("2") }
        );

        // 部署 InferenceNode 合约，并传入 DataNode 的地址
        const InferenceNode = await ethers.getContractFactory("InferenceNode");
        inferenceNode = await InferenceNode.deploy(
            owner.address,
            verifier.address,
            ethers.parseEther("1"), // minStake
            10, // slashRatio
            dataNode.target // 传入 DataNode 的地址
        );

        // 部署 Models 合约
        const Models = await ethers.getContractFactory("Models");
        models = await Models.deploy(1);

        await models.upload(
            999,
            0,
            "Transfer-Agent",
            "fa03f2553e408370799dbd0c45e450203bd9c133ca3512563e1f7d77d9cdf7e8",
            1,
            1
        );

        // 在 InferenceNode 中注册一个节点
        await inferenceNode.connect(nodeOwner).registerNode(
            "InferenceNode1",
            "Test inference node",
            "http://inferencenode1.com",
            "nodePubKey",
            0, // 使用在 DataNode 中注册的节点的 nodeId
            1, // teeType
            { value: ethers.parseEther("2") }
        );

        // 部署feeManager合约
        const FeeManager = await ethers.getContractFactory("FeeManager");
        feeManager = await FeeManager.deploy([ethers.ZeroAddress, token.target], [ethers.parseEther("0.001"), ethers.parseEther("0.001")]);

        // 部署 Inference 合约，并传入 InferenceNode 的地址
        const Inference = await ethers.getContractFactory("Inference");
        inference = await Inference.deploy(inferenceNode.target, models.target, verifier.address, feeManager.target);

        const TransferAgent = await ethers.getContractFactory("TransferAgent");
        transferAgent = await TransferAgent.deploy(inference.target);
    });

    it("should allow get contract info", async function () {
        expect(await transferAgent.inferenceContract()).to.equal(inference.target);
        expect(await transferAgent.requestIdExec(0)).to.equal(false);
    });

    it("should allow update inference contract", async function () {
        const Inference = await ethers.getContractFactory("Inference");
        const inference = await Inference.deploy(inferenceNode.target, models.target, verifier.address, feeManager.target);
        await transferAgent.setInferenceContract(inference.target)
        expect(await transferAgent.inferenceContract()).to.equal(inference.target);
    });

    it("should execute contract.owner equal owner.address", async function () {
        expect(await transferAgent.owner()).to.equal(owner.address);
    });

    it("should execute an agent transfer with a valid signature", async function () {
        const modelId = 1;
        const input = ethers.id("input data");
        const payAmount = ethers.parseEther("10");

        // 授权合约花费用户的 ERC20 代币
        await token.connect(requester).approve(inference.target, payAmount);

        await inference.connect(requester).requestInference(
            0, // InferenceNode 中的 nodeId
            modelId,
            input,
            token.target, // 使用 ERC20 代币进行支付
            payAmount
        );

        const value = ethers.parseEther("1");
        const requestId = 0;

        const structHash = ethers.solidityPackedKeccak256(
            ["uint256", "address", "address", "address", "uint256"],
            [requestId, token.target, requester.address, receiver.address, value]
        );

        const signature = await nodeOwner.signMessage(ethers.toBeArray(structHash));

        await token.connect(requester).approve(transferAgent.target, value);

        await expect(
            transferAgent.connect(nodeOwner).agentTransfer(
                requestId,
                token.target,
                receiver.address,
                value,
                signature
            )
        )
            .to.emit(transferAgent, "AgentTransferExecuted")
            .withArgs(requestId, token.target, requester.address, receiver.address, value);

        expect(await token.balanceOf(receiver.address)).to.equal(value);
        expect(await token.balanceOf(requester.address)).to.equal(ethers.parseEther("989"));
    });

    it("should fail with an invalid signature", async function () {
        const modelId = 1;
        const input = ethers.id("input data");
        const payAmount = ethers.parseEther("10");

        // 授权合约花费用户的 ERC20 代币
        await token.connect(requester).approve(inference.target, payAmount);

        await inference.connect(requester).requestInference(
            0, // InferenceNode 中的 nodeId
            modelId,
            input,
            token.target, // 使用 ERC20 代币进行支付
            payAmount
        );

        const value = ethers.parseEther("1");
        const requestId = 0;

        const structHash = ethers.solidityPackedKeccak256(
            ["uint256", "address", "address", "address", "uint256"],
            [requestId, token.target, requester.address, receiver.address, value]
        );

        const signature = await requester.signMessage(ethers.toBeArray(structHash));

        await token.connect(requester).approve(transferAgent.target, value);

        await expect(
            transferAgent.connect(requester).agentTransfer(
                requestId,
                token.target,
                receiver.address,
                value,
                signature
            )
        ).to.be.revertedWith("TransferAgent: invalid signature");

        expect(await token.balanceOf(receiver.address)).to.equal(0);
        expect(await token.balanceOf(requester.address)).to.equal(ethers.parseEther("990"));
    });
});