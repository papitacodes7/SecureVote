# SecureVote - Blockchain-Based Secure Voting System

![SecureVote Logo](https://img.shields.io/badge/SecureVote-Blockchain%20Voting-blue.svg)

A secure, verifiable, and transparent voting system built on blockchain technology, designed for the Smart India Hackathon (SIH). SecureVote prevents double voting while maintaining voter privacy through cryptographic protection.

## 🎯 Problem Statement

Traditional e-voting systems face critical challenges:
- **Double Voting**: No reliable prevention mechanism
- **Vote Tampering**: Centralized systems are vulnerable
- **Lack of Transparency**: Results cannot be independently verified  
- **Privacy Concerns**: Voter anonymity not guaranteed
- **Trust Issues**: Dependence on centralized authorities

## 💡 Solution Overview

SecureVote provides a hybrid blockchain solution that:
- **Prevents Double Voting** using one-time cryptographic tokens
- **Ensures Transparency** with public blockchain audit trails
- **Maintains Privacy** through client-side AES-GCM encryption
- **Enables Verification** with cryptographic hashes and timestamps
- **Eliminates Trust Issues** through decentralized smart contracts

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Voter Client  │    │  Smart Contract │    │ Blockchain Node │
│                 │    │  (Polygon Amoy) │    │   (Polygon)     │
│ • Token Input   │◄──►│ • Vote Storage  │◄──►│ • Immutable     │
│ • AES Encrypt   │    │ • Double Check  │    │ • Transparent   │
│ • Hash & Submit │    │ • Access Control│    │ • Decentralized │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │  Admin Portal   │
                    │                 │
                    │ • Token Gen     │
                    │ • Election Mgmt │
                    │ • Result Tally  │
                    └─────────────────┘
```

## 🔐 Security Features

### Cryptographic Protection
- **AES-GCM 256-bit**: Client-side ballot encryption
- **SHA-256**: Integrity hashing for tokens and ballots
- **256-bit Entropy**: Cryptographically secure token generation
- **On-chain Verification**: Immutable double-vote prevention

### Privacy Guarantees  
- **Ballot Secrecy**: Only encrypted hashes stored on blockchain
- **Voter Anonymity**: Personal data separated from voting records
- **Key Control**: Voters control their own encryption keys

### Transparency & Verification
- **Public Audit Trail**: All vote hashes publicly verifiable
- **Transaction Logs**: Complete blockchain transaction history
- **Individual Verification**: Voters can verify their specific votes
- **Universal Verification**: Anyone can audit election results

## 📁 Project Structure

```
hackathon/
├── securevote/                 # React Frontend Application
│   ├── src/
│   │   ├── pages/             # Vote, Verify, Admin components
│   │   ├── hooks/             # Web3 contract interaction hooks
│   │   ├── utils/             # Cryptographic utilities
│   │   ├── config/            # Blockchain configuration
│   │   └── App.tsx            # Main application component
│   ├── public/
│   └── package.json
├── contracts/                 # Smart Contract (Solidity)
│   └── SecureVote.sol        # Main voting contract
├── scripts/                   # Deployment scripts
│   └── deploy.ts
├── test/                      # Contract tests
├── hardhat.config.ts          # Hardhat configuration
├── SECURITY.md               # Security documentation
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask wallet
- Polygon Amoy testnet tokens (for deployment)

### 1. Clone and Install

```bash
git clone <repository-url>
cd hackathon

# Install contract dependencies
npm install

# Install frontend dependencies
cd securevote
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create `.env` in the root directory:
```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
POLYGON_AMOY_PRIVATE_KEY=your_private_key_here
```

Update `.env` in securevote directory with deployed contract address.

### 3. Deploy Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to Polygon Amoy testnet
npx hardhat ignition deploy ./scripts/deploy.ts --network polygonAmoy

# Update REACT_APP_CONTRACT_ADDRESS in securevote/.env with deployed address
```

### 4. Start Frontend

```bash
cd securevote
npm start
```

The application will open at `http://localhost:3000`

## 🎮 Demo Flow for SIH Presentation

### 1. Admin Setup
- Navigate to Admin tab → Generate voting tokens
- Create election with details
- Download token CSV for distribution

### 2. Voter Experience  
- Connect wallet → Enter token → Cast vote
- Receive transaction hash + encryption keys
- Vote encrypted and hashed before blockchain storage

### 3. Verification
- Verify transaction hash on blockchain
- Check ballot hash in public audit trail
- Demonstrate transparency and immutability

### 4. Security Demo
- Attempt double voting → System rejects
- Show encryption preserves privacy
- Display comprehensive audit trail

## 🛠️ Key Technologies

- **Frontend**: React + TypeScript + Web3 (Wagmi + RainbowKit)
- **Blockchain**: Polygon Amoy (Testnet) 
- **Smart Contracts**: Solidity 0.8.24
- **Cryptography**: AES-GCM 256 + SHA-256
- **Development**: Hardhat + Viem

## 📊 Security Metrics

- **Token Entropy**: 256 bits (2^256 possibilities)
- **Encryption**: AES-GCM 256-bit keys  
- **Hash Security**: SHA-256 (industry standard)
- **Double Vote Prevention**: 100% effective on-chain

## 🤝 Team Workflow

### Current Implementation
- **✅ Smart Contract**: Complete voting logic with security controls
- **✅ Frontend**: React app with Web3 integration  
- **✅ Crypto Layer**: AES-GCM encryption + SHA-256 hashing
- **✅ Admin Panel**: Token generation and election management
- **✅ Security Docs**: Comprehensive threat model analysis

### Helper Tasks (As Requested)
- **Helper 1**: Government e-voting case studies and compliance research
- **Helper 2**: UI/UX design mockups in Figma
- **Helper 3**: SIH pitch deck and presentation materials
- **Helper 4**: Testing scenarios and vote simulation

## 🎯 Demo Commands

```bash
# Quick setup for hackathon demo
git clone <repo> && cd hackathon
npm install && cd securevote && npm install --legacy-peer-deps

# Deploy (with your private key in .env)
npx hardhat compile
npx hardhat ignition deploy ./scripts/deploy.ts --network polygonAmoy

# Start frontend
npm start
# Visit http://localhost:3000 for live demo!
```

## 🔍 Additional Resources

- **Security Documentation**: See [SECURITY.md](./SECURITY.md)
- **Smart Contract**: [contracts/SecureVote.sol](./contracts/SecureVote.sol)
- **Live Demo**: Available at hackathon presentation

---

**🏆 Built for Smart India Hackathon 2024**  
*Securing Democracy Through Blockchain Innovation*
