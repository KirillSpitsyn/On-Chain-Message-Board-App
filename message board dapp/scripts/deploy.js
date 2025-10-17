const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying MessageBoard contract to", network.name, "...");

  // Get the deployer account details
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Deploying the contract to the blockchain and getting the contract address
  console.log("Deploying contract...");
  const MessageBoard = await ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.deploy();
  
  await messageBoard.waitForDeployment();
  const contractAddress = await messageBoard.getAddress();

  console.log("MessageBoard deployed to address:", contractAddress);
  console.log("Network:", network.name);
  console.log("Amount of gas used for the deployment:", (await messageBoard.deploymentTransaction().wait()).gasUsed.toString());

  // Saving the contract info for the front-end
  await saveContractInfo(contractAddress, network.name);

  console.log("\n Deployment completed successfully!");
}

// Function to save contract info for the front-end
async function saveContractInfo(contractAddress, networkName) {
  try {
    // Path to frontend contracts folder
    const frontendContractsFolder = path.join(__dirname, "../../message-board-front-end/src/contracts");
    
    // Creating contracts folder in the front-end if it doesn't exist
    if (!fs.existsSync(frontendContractsFolder)) {
      fs.mkdirSync(frontendContractsFolder, { recursive: true });
      console.log("Created frontend contracts folder");
    }

    // Saving contract address and network info
    const addressData = {
      MessageBoard: contractAddress,
      network: networkName,
      chainId: networkName === "sepolia" ? 11155111 : 1337,
      deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(frontendContractsFolder, "contract-address.json"),
      JSON.stringify(addressData, null, 2)
    );

    // Copying the contract ABI
    const artifactsPath = path.join(__dirname, "../artifacts/contracts/messageBoardContract.sol/MessageBoard.json");
    if (fs.existsSync(artifactsPath)) {
      const artifactData = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
      fs.writeFileSync(
        path.join(frontendContractsFolder, "MessageBoard.json"),
        JSON.stringify(artifactData, null, 2)
      );
      console.log("Contract ABI and address saved to the front-end");
    } else {
      console.warn("Contract artifact was not found. Make sure to compile the contract first.");
    }

    // Creating a contract info file
    const contractInfo = {
      address: contractAddress,
      abi: JSON.parse(fs.readFileSync(artifactsPath, 'utf8')).abi,
      network: networkName,
      chainId: addressData.chainId
    };

    fs.writeFileSync(
      path.join(frontendContractsFolder, "contractInfo.js"),
      `export const CONTRACT_ADDRESS = "${contractAddress}";
      export const CONTRACT_ABI = ${JSON.stringify(contractInfo.abi, null, 2)};
      export const NETWORK_NAME = "${networkName}";
      export const CHAIN_ID = ${addressData.chainId};`
    );

    console.log("Contract info ready for frontend integration");

  } catch (error) {
    console.error("Error saving contract info:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });