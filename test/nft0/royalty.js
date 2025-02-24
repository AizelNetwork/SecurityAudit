const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZeroRoyaltyUpgradeable", function () {
    let ZeroRoyaltyUpgradeable, zeroRoyalty, owner, addr1, addr2, wethToken, nftContract, cid, tokenURI, tokenIds;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy mock WETH token
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        wethToken = await ERC20Mock.deploy("Mock USDT", "USDT", owner, ethers.parseUnits("50", 18));

        // Deploy mock NFT contract
        Zero = await ethers.getContractFactory("ZeroUpgradeable");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        nftContract = await Zero.deploy();
        await nftContract.initialize("ZeroToken", "ZERO")

        // Deploy ZeroRoyaltyUpgradeable contract
        ZeroRoyaltyUpgradeable = await ethers.getContractFactory("ZeroRoyaltyUpgradeable");
        zeroRoyalty = await upgrades.deployProxy(ZeroRoyaltyUpgradeable, [wethToken.target, nftContract.target, 10], { initializer: 'initialize' });

        cid = "QmTestCid";
        tokenURI = "QmTestTokenURI";
        tokenIds = [0];
        await nftContract.mint(addr1.address, tokenURI);
    });

    it("should initialize correctly", async function () {
        expect(await zeroRoyalty.wethToken()).to.equal(wethToken.target);
        expect(await zeroRoyalty.nftContract()).to.equal(nftContract.target);
        expect(await zeroRoyalty.rewardPercent()).to.equal(10);
        expect(await zeroRoyalty.membershipFee()).to.equal(ethers.parseEther("0.003"));
        expect(await zeroRoyalty.maxWinners()).to.equal(2);
    });

    it("should create an event", async function () {
        const tx = await zeroRoyalty.createEvent(cid);
        expect(await zeroRoyalty.eventStatus(cid)).to.equal(0);
        expect(await zeroRoyalty.eventCreatedBlock(cid)).to.equal(tx.blockNumber);
    });

    it("should add memberships to an event", async function () {
        await zeroRoyalty.connect(addr1).addEventMemberships(cid, tokenIds, { value: ethers.parseEther("0.003") });
        const memberships = await zeroRoyalty.eventMemberships(cid);
        expect(memberships).to.deep.equal(tokenIds);
    });

    it("should submit event reward", async function () {
        await wethToken.transfer(zeroRoyalty.target, ethers.parseEther("1"));
        await zeroRoyalty.submitEventReward(cid, tokenIds);

        expect(await zeroRoyalty.eventStatus(cid)).to.equal(1);
        expect(await zeroRoyalty.eventWinners(cid)).to.deep.equal(tokenIds);
    });

    it("should claim rewards", async function () {
        await zeroRoyalty.connect(addr1).addEventMemberships(cid, tokenIds, { value: ethers.parseEther("0.003") });

        await wethToken.transfer(zeroRoyalty.target, ethers.parseEther("1"));
        await zeroRoyalty.submitEventReward(cid, tokenIds);

        await zeroRoyalty.connect(addr1).claimRewardBatch(tokenIds);
        expect(await wethToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("0.1"));
    });

    it("should withdraw remainder", async function () {
        const before_balance = await wethToken.balanceOf(owner.address);
        await wethToken.transfer(zeroRoyalty.target, ethers.parseEther("1"));
        await zeroRoyalty.submitEventReward(cid, tokenIds);
        await zeroRoyalty.withdrawRemainder();
        expect(await wethToken.balanceOf(owner.address)).to.equal(before_balance - ethers.parseEther("0.1"));
    });

    it("should update reward percent", async function () {
        await zeroRoyalty.setRewardPercent(20);
        expect(await zeroRoyalty.rewardPercent()).to.equal(20);
    });

    it("should update membership fee", async function () {
        await zeroRoyalty.setMembershipFee(ethers.parseEther("0.005"));
        expect(await zeroRoyalty.membershipFee()).to.equal(ethers.parseEther("0.005"));
    });

    it("should update max winners", async function () {
        await zeroRoyalty.setMaxWinners(5);
        expect(await zeroRoyalty.maxWinners()).to.equal(5);
    });
});