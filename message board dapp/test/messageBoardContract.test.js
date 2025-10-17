const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MessageBoard", function () {
  // Message Board Smart contract instance and addresses for testing
  let MessageBoard;
  let messageBoard;
  let owner;
  let address1;
  let address2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    MessageBoard = await ethers.getContractFactory("MessageBoard");
    [owner, address1, address2] = await ethers.getSigners();

    // Deploy the contract
    messageBoard = await MessageBoard.deploy();
    await messageBoard.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await messageBoard.getAddress()).to.be.properAddress;
    });

    it("Should start with zero messages", async function () {
      expect(await messageBoard.getMessageCount()).to.equal(0);
    });
  });

  describe("Posting Messages", function () {
    it("Should allow users to post a message", async function () {
      const content = "Hello world!";
      
      await expect(messageBoard.connect(address1).postMessage(content))
        .to.emit(messageBoard, "MessagePosted")
        .withArgs(address1.address, content, await time.latest() + 1, 0);

      expect(await messageBoard.getMessageCount()).to.equal(1);
    });

    it("Should store message data correctly", async function () {
      const content = "Test message";
      await messageBoard.connect(address1).postMessage(content);

      const [author, messageContent, timestamp] = await messageBoard.getMessage(0);
      
      expect(author).to.equal(address1.address);
      expect(messageContent).to.equal(content);
      expect(timestamp).to.be.greaterThan(0);
    });

    it("Should reject empty messages", async function () {
      await expect(messageBoard.postMessage(""))
        .to.be.revertedWithCustomError(messageBoard, "EmptyMessage");
    });

    it("Should reject messages longer than 280 characters", async function () {
      const longMessage = "a".repeat(281);
      
      await expect(messageBoard.postMessage(longMessage))
        .to.be.revertedWithCustomError(messageBoard, "MessageTooLong");
    });

    it("Should accept messages with exactly 280 characters", async function () {
      const maxMessage = "a".repeat(280);
      
      await expect(messageBoard.postMessage(maxMessage))
        .to.not.be.reverted;
    });

    it("Should allow multiple users to post messages", async function () {
      await messageBoard.connect(address1).postMessage("Message from address1");
      await messageBoard.connect(address2).postMessage("Message from address2");
      await messageBoard.connect(owner).postMessage("Message from the owner address");

      expect(await messageBoard.getMessageCount()).to.equal(3);
    });
  });

  describe("Retrieving Messages", function () {
    beforeEach(async function () {
      // Setup some test messages
      await messageBoard.connect(address1).postMessage("First message");
      await messageBoard.connect(address2).postMessage("Second message");
      await messageBoard.connect(address1).postMessage("Third message");
    });

    it("Should retrieve a specific message by index", async function () {
      const [author, content, timestamp] = await messageBoard.getMessage(1);
      
      expect(author).to.equal(address2.address);
      expect(content).to.equal("Second message");
      expect(timestamp).to.be.greaterThan(0);
    });

    it("Should revert when accessing invalid message index", async function () {
      await expect(messageBoard.getMessage(999))
        .to.be.revertedWith("Message with this index doesn't exist");
    });

    it("Should return all messages", async function () {
      const allMessages = await messageBoard.getAllMessages();
      
      expect(allMessages.length).to.equal(3);
      expect(allMessages[0].content).to.equal("First message");
      expect(allMessages[1].content).to.equal("Second message");
      expect(allMessages[2].content).to.equal("Third message");
    });

    it("Should return correct message count", async function () {
      expect(await messageBoard.getMessageCount()).to.equal(3);
    });
  });

  describe("Filtering Messages by Author", function () {
    beforeEach(async function () {
      await messageBoard.connect(address1).postMessage("Address1 message 1");
      await messageBoard.connect(address2).postMessage("Address2 message 1");
      await messageBoard.connect(address1).postMessage("Address1 message 2");
      await messageBoard.connect(address2).postMessage("Address2 message 2");
      await messageBoard.connect(address1).postMessage("Address1 message 3");
    });

    it("Should return messages by specific author", async function () {
      const address1Messages = await messageBoard.getMessagesByAuthor(address1.address);
      const address2Messages = await messageBoard.getMessagesByAuthor(address2.address);
      
      expect(address1Messages.length).to.equal(3);
      expect(address2Messages.length).to.equal(2);
      
      expect(address1Messages[0].content).to.equal("Address1 message 1");
      expect(address1Messages[1].content).to.equal("Address1 message 2");
      expect(address1Messages[2].content).to.equal("Address1 message 3");
      
      expect(address2Messages[0].content).to.equal("Address2 message 1");
      expect(address2Messages[1].content).to.equal("Address2 message 2");
    });

    it("Should return empty array for an author with no messages", async function () {
      const noMessages = await messageBoard.getMessagesByAuthor(owner.address);
      expect(noMessages.length).to.equal(0);
    });
  });

  describe("Gas Usage", function () {
    it("Should use reasonable gas for posting messages", async function () {
      const tx = await messageBoard.postMessage("Test message for gas measurement");
      const receipt = await tx.wait();
      
      // Should use less than 250000 gas for posting a message
      expect(receipt.gasUsed).to.be.lessThan(250000);
    });
  });
});

// Helper function for time-related tests
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
};