// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// On-chain (Ethereum) message board smart contract
// where logged in users can post messages and everyone can view all the messages 
contract MessageBoard {
    // Struct to represent a message
    struct Message {
        address author;      // ETH address of the message author
        string content;      // Message content (max 280 characters as in Twitter)
        uint256 timestamp;   // Block timestamp when the message was posted
    }
    
    // Array to store all messages
    Message[] public messages;
    
    // Event emitted when a new message is posted
    event MessagePosted(
        address indexed author,
        string content,
        uint256 timestamp,
        uint256 messageIndex
    );
    
    // Custom error messages when message is more than 280 characters or empty
    error MessageTooLong();
    error EmptyMessage();
    
    // Function to post a new message to the board
    function postMessage(string calldata _content) external {
        bytes memory contentBytes = bytes(_content);
        
        // Check if message is empty
        if (contentBytes.length == 0) {
            revert EmptyMessage();
        }
        
        // Check if message exceeds 280 characters
        if (contentBytes.length > 280) {
            revert MessageTooLong();
        }
        
        // Creating a new message
        Message memory newMessage = Message({
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });
        
        // Add message to array
        messages.push(newMessage);
        
        // Emit event that the message was posted
        emit MessagePosted(
            msg.sender,
            _content,
            block.timestamp,
            messages.length - 1
        );
    }
    
    // Function to get a specific message by it's index
    function getMessage(uint256 _index) external view returns (address author, string memory content, uint256 timestamp) {
        require(_index < messages.length, "Message with this index doesn't exist");
        
        Message storage message = messages[_index];
        return (message.author, message.content, message.timestamp);
    }
    
    // Function to get all messages posted to the board
    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }
    
    // Helper function to get the total number of messages
    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }
    
    // Function to get messages by an author's address
    function getMessagesByAuthor(address _author) external view returns (Message[] memory) {
        // Count messages from this author
        uint256 count = 0;

        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].author == _author) {
                count++;
            }
        }
        
        // Create array of correct size
        Message[] memory authorMessages = new Message[](count);
        uint256 currentIndex = 0;
        
        // Fill array with particular author's messages
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].author == _author) {
                authorMessages[currentIndex] = messages[i];
                currentIndex++;
            }
        }
        
        return authorMessages;
    }
}