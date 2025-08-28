import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SecureVoteModule = buildModule("SecureVoteModule", (m) => {
  const secureVote = m.contract("SecureVote");

  return { secureVote };
});

export default SecureVoteModule;
