import { expect } from "chai";
import hre from "hardhat";

describe("SecureVote Contract", function () {
  let secureVote: any;
  let owner: any;
  let voter1: any;

  beforeEach(async function () {
    [owner, voter1] = await hre.viem.getWalletClients();
    secureVote = await hre.viem.deployContract("SecureVote");
  });

  it("Should deploy successfully and set owner", async function () {
    expect(await secureVote.read.owner()).to.equal(owner.account.address);
    expect(await secureVote.read.currentElectionId()).to.equal(0n);
  });

  it("Should allow checking if token is used", async function () {
    const tokenHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    
    // Initially should be false
    expect(await secureVote.read.isTokenUsed([tokenHash])).to.be.false;
  });
});
