const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenCredit", function () {
    let TokenCredit, tokenCredit, owner, operator, addr1, addr2, usdt;

    beforeEach(async function () {
        [owner, operator, addr1, addr2] = await ethers.getSigners();

        // Deploy a mock USDT token
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        usdt = await ERC20Mock.deploy("Mock USDT", "USDT", owner, ethers.parseUnits("50", 18));

        // Deploy the TokenCredit contract
        TokenCredit = await ethers.getContractFactory("TokenCreditUpgradeable");
        // tokenCredit = await TokenCredit.deploy(usdt.target);
        tokenCredit = await TokenCredit.deploy();
        await tokenCredit.initialize(usdt.target);
        // Grant operator role
        await tokenCredit.grantRole(await tokenCredit.OPERATOR_ROLE(), operator.address);
    });

    it("Should allow get support token list", async function () {
        const [supportToken] = await tokenCredit.allSupportTokens();
        expect(supportToken).to.equal(usdt.target);
    });

    it("Should add a new token", async function () {
        await tokenCredit.addToken(ethers.ZeroAddress);
        expect(await tokenCredit.isSupportToken(ethers.ZeroAddress)).to.be.true;
    });

    it("Should remove a token", async function () {
        await tokenCredit.connect(operator).removeToken(usdt.target);
        expect(await tokenCredit.isSupportToken(usdt.target)).to.be.false;
    });

    it("Should register a new player", async function () {
        await tokenCredit.connect(addr1).registerCredit();
        expect(await tokenCredit.isRegister(addr1.address)).to.be.true;
    });

    it("Should deposit credit by usdt", async function () {
        await tokenCredit.registerCredit();
        await usdt.approve(tokenCredit.target, ethers.parseUnits("50", 18));
        await tokenCredit.depostCredit(usdt.target, ethers.parseUnits("50", 18));
        expect(await tokenCredit.creditDepositAmount(owner.address, usdt.target)).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should deposit credit by eth", async function () {
        const depositAmount = ethers.parseEther("1");
        await tokenCredit.addToken(ethers.ZeroAddress);
        await tokenCredit.registerCredit();
        await tokenCredit.depostCredit(ethers.ZeroAddress, depositAmount, { value: depositAmount });
        expect(await tokenCredit.creditDepositAmount(owner.address, ethers.ZeroAddress)).to.equal(depositAmount);
    });

    it("Should withdraw tokens", async function () {
        await usdt.transfer(addr1.address, ethers.parseUnits("50", 18));
        await tokenCredit.connect(addr1).registerCredit();
        await usdt.connect(addr1).approve(tokenCredit.target, ethers.parseUnits("50", 18));
        await tokenCredit.connect(addr1).depostCredit(usdt.target, ethers.parseUnits("50", 18));
        await tokenCredit.withdraw(owner.address, [usdt.target]);
        expect(await usdt.balanceOf(owner.address)).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should withdraw eth", async function () {
        const balance = await ethers.provider.getBalance(addr2.address);
        const depositAmount = ethers.parseEther("1");
        await tokenCredit.addToken(ethers.ZeroAddress);
        await tokenCredit.registerCredit();
        await tokenCredit.depostCredit(ethers.ZeroAddress, depositAmount, { value: depositAmount });
        expect(await tokenCredit.creditDepositAmount(owner.address, ethers.ZeroAddress)).to.equal(depositAmount);
        await tokenCredit.withdraw(addr2.address, [ethers.ZeroAddress]);
        expect(await ethers.provider.getBalance(addr2.address)).to.be.gt(balance);
    });
});