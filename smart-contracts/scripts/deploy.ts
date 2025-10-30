import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  // --- Deploy ActionRepository ---
  const ActionRepository = await ethers.getContractFactory("ActionRepository");
  const actionRepository = await ActionRepository.deploy();
  await actionRepository.waitForDeployment();
  await actionRepository.createUnderlying(
    "Ecofusion Action",
    "EFA",
    7_776_000,
    {
      value: ethers.parseEther("10"),
      gasLimit: 1_000_000,
    }
  );

  console.log(
    "ActionRepository deployed at:",
    await actionRepository.getAddress()
  );
  console.log(
    "ActionRepository underlying:",
    await actionRepository.underlying()
  );
  const actionRepositoryUnderlying = await ethers.getContractAt(
    "IHederaTokenService",
    await actionRepository.underlying()
  );
  await actionRepositoryUnderlying.associateToken(
    deployer.address,
    actionRepository.underlying()
  );

  // --- Deploy CarbonCreditToken ---
  const CarbonCreditToken = await ethers.getContractFactory(
    "CarbonCreditToken"
  );
  const carbonCreditToken = await CarbonCreditToken.deploy(
    await actionRepository.getAddress()
  );
  await carbonCreditToken.waitForDeployment();
  await carbonCreditToken.createUnderlying(
    "Ecofusion Carbon Credit",
    "ECC",
    7_776_000,
    8,
    {
      value: ethers.parseEther("10"),
      gasLimit: 1_000_000,
    }
  );

  console.log(
    "CarbonCreditToken deployed at:",
    await carbonCreditToken.getAddress()
  );
  console.log(
    "CarbonCreditToken underlying:",
    await carbonCreditToken.underlying()
  );
  const carbonCreditTokenUnderlying = await ethers.getContractAt(
    "IHederaTokenService",
    await carbonCreditToken.underlying()
  );
  await carbonCreditTokenUnderlying.associateToken(
    deployer.address,
    carbonCreditToken.underlying()
  );

  // --- Deploy Marketplace ---
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    await carbonCreditToken.getAddress()
  );
  await marketplace.waitForDeployment();

  console.log("Marketplace deployed at:", await marketplace.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Deploying contracts with: 0x2531dCd3dC58559c19EEE09736443D026D40d5f5
// ActionRepository deployed at: 0x276DD7a08268313baf6093d191DE35aC137f8Fd1
// ActionRepository underlying: 0x00000000000000000000000000000000006d5029
// CarbonCreditToken deployed at: 0xA7E397C152cf5f6F422436c838D933Ee88b6e1A8
// CarbonCreditToken underlying: 0x00000000000000000000000000000000006D503B
// Marketplace deployed at: 0xa20767fc30987Fb1C2f21aC0882b03bDC6C2de04
