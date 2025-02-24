const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InferenceNode", function () {
    let owner;
    let requester;
    let nodeOwner;
    let token;
    let dataNode;
    let inferenceNode;
    let models;
    const minStake = ethers.parseEther("1");
    const slashRatio = 10;
    const pubkey = "publicKey1";
    const dataNodeId = 0;
    const teeType = 0;
    const NodeName = "InferenceNode1";
    const NodeBio = "Test inference node";
    const NodeURI = "http://inferencenode1.com";
    const NodePK = "nodePubKey";

    beforeEach(async function () {
        [owner, verifier, requester, nodeOwner] = await ethers.getSigners();
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        token = await ERC20Mock.deploy("Test Token", "TT", owner.address, ethers.parseEther("10000000"));
        await token.transfer(requester.address, ethers.parseEther("1000"));

        // 部署 DataNode 合约
        const DataNode = await ethers.getContractFactory("DataNode");
        dataNode = await DataNode.deploy(
            owner.address,
            verifier.address,
            minStake,
            slashRatio
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
            minStake, // minStake
            slashRatio, // slashRatio
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
            NodeName,
            NodeBio,
            NodeURI,
            NodePK,
            dataNodeId, // 使用在 DataNode 中注册的节点的 nodeId
            teeType,
            { value: ethers.parseEther("2") }
        );
    });

    it("should return the correct data node address", async function () {
        expect(await inferenceNode.getNodeData()).to.equal(dataNode.target);
    });

    it("should allow getting all active nodes", async function () {
        const allActiveNodes = await inferenceNode.getAllActiveNodes();
        expect(allActiveNodes.length).to.equal(1);
    });

    it("should allow getting all inactive nodes", async function () {
        const allInActiveNodes = await inferenceNode.getAllInactiveNodes();
        expect(allInActiveNodes.length).to.equal(0);
    });

    it("should allow check node info by pk", async function () {
        expect(await inferenceNode.getNodeIdByPubkey(NodePK)).to.equal(0);
        expect(await inferenceNode.pubkeyExists(NodePK)).to.equal(true);
    });

    it("should allow getting node details by getNode function", async function () {
        const nodeDetails_active = await inferenceNode.getNode(0);
        expect(nodeDetails_active.length).to.equal(2);
        expect(nodeDetails_active[0].length).to.equal(10);
        expect(nodeDetails_active[0][0]).to.equal(0);
        expect(nodeDetails_active[1]).to.equal(true);

        const nodeDetails_notfound = await inferenceNode.getNode(1);
        expect(nodeDetails_notfound[1]).to.equal(false);

        await inferenceNode.connect(nodeOwner).unstake(0, ethers.parseEther("2"));
        const nodeDetails_inactive = await inferenceNode.getNode(0);
        expect(nodeDetails_inactive[1]).to.equal(false);
    });

    it("should allow getting node details by all get function", async function () {
        expect(await inferenceNode.getName(0)).to.equal("InferenceNode1");
        expect(await inferenceNode.getBio(0)).to.equal("Test inference node");
        expect(await inferenceNode.getUrl(0)).to.equal("http://inferencenode1.com");
        expect(await inferenceNode.getOwner(0)).to.equal(nodeOwner.address);
        expect(await inferenceNode.getStake(0)).to.equal(ethers.parseEther("2"));
        expect(await inferenceNode.getDataNodeId(0)).to.equal(dataNodeId);
        expect(await inferenceNode.getTeeType(0)).to.equal(teeType);
        expect(await inferenceNode.getPubkey(0)).to.equal(NodePK);
    });

    it("should register a new node", async function () {
        await expect(
            inferenceNode.registerNode("Node1", "Bio1", "url1", pubkey, dataNodeId, teeType, { value: minStake })
        )
            .to.emit(inferenceNode, "InferenceNodeRegistered")
            .withArgs(
                1, // nodeId will be 0 for the first node
                "Node1",
                "Bio1",
                "url1",
                owner.address,
                minStake,
                dataNodeId,
                teeType,
                pubkey
            );
    });

    it("should prevent registering a node with the same pubkey", async function () {
        // First registration should succeed
        await inferenceNode.registerNode("Node1", "Bio1", "url1", pubkey, dataNodeId, teeType, { value: minStake });

        // Second registration with the same pubkey should fail
        await expect(
            inferenceNode.registerNode("Node2", "Bio2", "url2", pubkey, dataNodeId, teeType, { value: minStake })
        ).to.be.revertedWith("InferenceNode: pubkey only can set once");
    });

    it("should allow owner to slash a node", async function () {
        await inferenceNode.registerNode("Node2", "Bio2", "url2", pubkey, dataNodeId, teeType, { value: minStake });
        const nodeId = 1;

        await expect(inferenceNode.connect(verifier).slash(nodeId))
            .to.emit(inferenceNode, "NodeStatusChanged")
            .withArgs(nodeId, false);
    });

    it("should return the correct pubkey by nodeId", async function () {
        await inferenceNode.registerNode("Node1", "Bio1", "url1", pubkey, dataNodeId, teeType, { value: minStake });

        const nodeId = 1;
        const pubkeyFromContract = await inferenceNode.getPubkey(nodeId);
        expect(pubkeyFromContract).to.equal(pubkey);
    });

    it("should prevent staking with invalid data node", async function () {
        const dataNodeId = 999; // Non-existing data node
        const teeType = 0;

        await expect(
            inferenceNode.registerNode("Node1", "Bio1", "url1", pubkey, dataNodeId, teeType, { value: minStake })
        ).to.be.revertedWith("InferenceNode: data node isn't active");
    });
});