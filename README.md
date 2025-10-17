# On-Chain Message Board Application

### Prerequisites

- Node.js (v22 or higher)
- npm 
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**

2. **Install dependencies for both projects**

First, install smart contract dependencies:
```bash
cd "message board dapp"
npm install
```

Then, install frontend dependencies:
```bash
cd "../message-board-front-end"
npm install
```

## Running Smart Contract Hardhat Tests

Navigate to the smart contract directory and run tests:

```bash
cd "../message board dapp" //if not in the directory
npm run compile
npm run test
```

This will run the comprehensive test suite that covers:
- Contract deployment
- Message posting functionality
- Message retrieval
- Author filtering
- Error handling
- Gas usage optimization

## Smart Contract Deployment (Optional)

### Compiling the Contract (if done the step before, can be skipped)

```bash
cd "../message board dapp"
npm run compile
```

### Deploying to Sepolia (Optional and can be skipped)

**Note**: The contract is already deployed and functional. Only deploy if you want to use your own contract instance.

1. **Create a `.env` file** in the `message board dapp` directory:

2. **Add your configuration** to `.env` **(SEPOLIA_URL=https://sepolia.infura.io/v3/ee9748798c334610ba85f4cc38a44890 can be used but metamask private key is required):**

**Getting MetaMask Private Key:**
1. In MetaMask, click the 3 dots (⋯) next to your account name
2. Click "Account details"
3. Click "private key"
4. Enter your MetaMask password
5. Copy the 64-character key (without 0x prefix)

`.env` **configuration:**
```
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID // can use: SEPOLIA_URL=https://sepolia.infura.io/v3/ee9748798c334610ba85f4cc38a44890 
PRIVATE_KEY=your_metamask_private_key_without_0x_prefix
```

3. **Get Sepolia ETH** for deployment gas fees (see Faucets section below)

4. **Deploy the contract**:
```bash
npm run deploy:sepolia
```

This will:
- Deploy the contract to Sepolia
- Save contract address and ABI to the frontend
- Display deployment details

## Frontend Setup

### Starting the Development Server

```bash
cd "../message-board-front-end"
npm run dev
```

The application will be available at `http://localhost:3000`

## MetaMask Setup

### Adding Sepolia Network to MetaMask

1. Open MetaMask and click on the network dropdown
2. Click "Add Custom Network"
3. Enter the following details:

```
Network Name: Sepolia
New RPC URL: https://sepolia.infura.io
Chain ID: 11155111
Currency Symbol: SepoliaETH
Block Explorer URL: https://sepolia.etherscan.io/
```

4. Click "Save"

### Getting Test ETH (Faucets)

You'll need Sepolia ETH to post messages and deploy a smart contract (optional). Use these faucets:

**Recommended Faucets:**
1. **Google Cloud Faucet**: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
2. **Sepolia PoW Faucet**: https://sepolia-faucet.pk910.de/

**How to use faucets:**
1. Copy your MetaMask wallet address
2. Visit any of the faucet links above
3. Paste your address and request test ETH
4. Wait for the transaction to complete

## Testing with Multiple Accounts

### Using Multiple MetaMask Accounts for testing the app functionality

1. **Create additional accounts** in MetaMask:
   - Click on the account icon in MetaMask
   - Select "Create Account" or "Import Account"
   - Repeat for as many test accounts as needed

2. **Get test ETH for each account** using the faucets listed above or using the method below 

3. **Transfer funds between accounts** (if needed):
   - Open MetaMask
   - Click "Send"
   - Enter recipient address and amount
   - Confirm transaction
  
4. **Switch between accounts** for testing:
   - Switch account in MetaMask
   - Refresh the frontend page
   - Click "Connect Wallet" again to connect the new account

### Testing Scenarios

- **Account A**: Post several messages, test character limits
- **Account B**: Post messages, filter by Account A's address
- **Account C**: View messages without posting (no wallet connection needed)

## Assumptions during Development

1. Application is designed for the Sepolia testnet
2. Users have MetaMask installed and configured
3. Users can add or currently have the Sepolia testnet in their MetaMask account. It's required for message posting and contract deployment (optional) 
4. Character Limit changed from 200 to 280 characters to match Twitter character limit

## AI Tools Used

Claude AI chatbot assisted me during the development. I used it to update the design of the front-end app according to my view of the app design. 
I also used it to assess if I found all the unit test cases, and it helped me to come up with a couple more tests, such as testing multiple users' ability to post messages, gas usage test and edge cases tests (rejecting empty messages and rejecting messages longer than 280 characters). 
Besides, it helped me in code review to find any possible flaws, and I used it to come up with extra small features, such as adding a button to show your messages only and adding a title that a certain message was added from your address if you logged in to the application.  

