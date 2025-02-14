const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Zero", function () {
    let Zero, zero, owner, addr1, addr2;

    beforeEach(async function () {
        Zero = await ethers.getContractFactory("ZeroUpgradeable");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        // zero = await Zero.deploy("ZeroToken", "ZERO");
        zero = await Zero.deploy();
        await zero.initialize("ZeroToken", "ZERO")
    });

    it("Should deploy with correct name and symbol", async function () {
        expect(await zero.name()).to.equal("ZeroToken");
        expect(await zero.symbol()).to.equal("ZERO");
    });

    it("Should mint a new token", async function () {
        await zero.mint(addr1.address, "tokenURI1");
        expect(await zero.totalSupply()).to.equal(1);
        expect(await zero.ownerOf(0)).to.equal(addr1.address);
        expect(await zero.tokenURI(0)).to.equal("tokenURI1");
    });

    it("Should set and get default royalty", async function () {
        await zero.setDefaultRoyalty(addr1.address, 500);
        const royaltyInfo = await zero.royaltyInfo(0, 10000);
        expect(royaltyInfo[0]).to.equal(addr1.address);
        expect(royaltyInfo[1]).to.equal(500);
    });

    it("Should delete default royalty", async function () {
        await zero.setDefaultRoyalty(addr1.address, 500);
        await zero.deleteDefaultRoyalty();
        const royaltyInfo = await zero.royaltyInfo(0, 10000);
        expect(royaltyInfo[0]).to.equal(ethers.ZeroAddress);
        expect(royaltyInfo[1]).to.equal(0);
    });

    it("Should set and reset token royalty", async function () {
        await zero.mint(addr1.address, "tokenURI1");
        await zero.setTokenRoyalty(0, addr2.address, 300);
        let royaltyInfo = await zero.royaltyInfo(0, 10000);
        expect(royaltyInfo[0]).to.equal(addr2.address);
        expect(royaltyInfo[1]).to.equal(300);

        await zero.resetTokenRoyalty(0);
        royaltyInfo = await zero.royaltyInfo(0, 10000);
        expect(royaltyInfo[0]).to.equal(ethers.ZeroAddress);
        expect(royaltyInfo[1]).to.equal(0);
    });

    it("Should return NFTs owned by an address", async function () {
        await zero.mint(addr1.address, "tokenURI1");
        await zero.mint(addr1.address, "tokenURI2");
        const ownedNFTs = await zero.getNFTsByOwner(addr1.address);
        expect(ownedNFTs.length).to.equal(2);
        expect(ownedNFTs[0]).to.equal(0);
        expect(ownedNFTs[1]).to.equal(1);
    });
});