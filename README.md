# Carbon Credits Platform on Stellar Soroban

A decentralized carbon credits marketplace built on the Stellar Soroban blockchain that enables transparent tracking, issuance, transfer, and retirement of carbon credits. The platform features a modern Next.js frontend with wallet integration, allowing users to interact with smart contracts seamlessly for managing carbon offset projects and credits.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7f0934a4-c284-40d9-91dd-8bbcb4462fb7" />
CBNTTKV2AEWOAGAKEDYL43PQZRPDTXUQO52WDOEQDWS5L2NMEUDSKKLW
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stellar](https://img.shields.io/badge/blockchain-Stellar_Soroban-blue.svg)
![Rust](https://img.shields.io/badge/smart%20contract-Rust-orange.svg)
![Next.js](https://img.shields.io/badge/frontend-Next.js-black.svg)

## 🌟 Features

- **Project Registration**: Register carbon offset projects with details like location, type, and description
- **Credit Issuance**: Issue carbon credits for verified projects with vintage tracking
- **Credit Transfers**: Transfer carbon credits between addresses securely
- **Credit Retirement**: Retire credits to prevent double counting and track environmental impact
- **Transparent Tracking**: All project and credit data stored immutably on-chain
- **Balance Queries**: Check carbon credit balances for any address
- **Project Management**: View all registered projects and their credit issuance history
- **Modern UI**: User-friendly Next.js interface with wallet integration

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Smart Contract Functions](#smart-contract-functions)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## 🎯 Overview

This platform provides a blockchain-based solution for carbon credit management, addressing key challenges in the carbon market:

- **Transparency**: All transactions and project data are publicly verifiable on-chain
- **Immutability**: Credit issuance and retirement records cannot be tampered with
- **Double Counting Prevention**: Retirement mechanism ensures credits can't be used twice
- **Accessibility**: Low transaction costs on Stellar make carbon credit management affordable
- **Interoperability**: Built on Stellar Soroban for seamless integration with the Stellar ecosystem

## 📝 Smart Contract Functions

### Core Functions

#### `init(env: Env)`
Initializes the contract and sets up storage counters.

#### `register_project(env: Env, issuer: Address, name: String, location: String, project_type: String, description: String) -> u32`
Registers a new carbon offset project and returns the assigned project ID.

#### `issue_credits(env: Env, issuer: Address, project_id: u32, amount: i128, vintage: u32, recipient: Address) -> CreditBatch`
Issues carbon credits for a specific project. Only the project issuer can issue credits. Returns batch information including project ID, amount, vintage, and issuance timestamp.

#### `transfer(env: Env, from: Address, to: Address, amount: i128)`
Transfers carbon credits from one address to another.

#### `retire(env: Env, owner: Address, amount: i128) -> i128`
Retires carbon credits, removing them from circulation and preventing double counting. Returns the total retired amount.

### Query Functions

#### `balance(env: Env, address: Address) -> i128`
Returns the carbon credit balance for a given address.

#### `get_project(env: Env, project_id: u32) -> CarbonProject`
Retrieves detailed information about a specific project.

#### `get_all_projects(env: Env) -> Vec<CarbonProject>`
Returns a list of all registered projects.

#### `total_retired(env: Env) -> i128`
Returns the total amount of retired credits across the platform.

#### `get_credits(env: Env, address: Address) -> Vec<CarbonCredit>`
Returns all carbon credits owned by a specific address.

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** and Cargo (for smart contract development)
- **Stellar Freighter** wallet browser extension
- **Soroban CLI** (optional, for contract deployment)

### Smart Contract Setup

1. Navigate to the contract directory:
```bash
cd contract
```

2. Build the smart contract:
```bash
cargo build --target wasm32-unknown-unknown --release
```

3. The compiled WASM file will be located at:
```
target/wasm32-unknown-unknown/release/carbon_credits.wasm
```

4. Run tests:
```bash
cargo test
```

### Frontend Setup

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Generate contract bindings (if you have Soroban CLI installed):
```bash
soroban contract bindings typescript \
  --wasm ../contract/target/wasm32-unknown-unknown/release/carbon_credits.wasm \
  --output-dir ./
```

4. Set up environment variables (create `.env.local` if needed):
```bash
# Add any required environment variables here
# Example:
# NEXT_PUBLIC_SOROBAN_NETWORK=testnet
# NEXT_PUBLIC_CONTRACT_ID=<your-contract-id>
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Usage

### Basic Workflow

1. **Install and Connect Wallet**
   - Install the Stellar Freighter wallet browser extension
   - Make sure you're connected to the Stellar Testnet
   - Connect your wallet through the web interface

2. **Register a Project**
   - Navigate to the project registration page
   - Fill in project details (name, location, type, description)
   - Submit the transaction to register your carbon offset project

3. **Issue Credits**
   - Select your registered project
   - Specify the amount of credits to issue
   - Set the vintage (year)
   - Specify the recipient address
   - Submit the transaction

4. **Transfer Credits**
   - Navigate to the transfer page
   - Enter recipient address and amount
   - Confirm the transaction

5. **Retire Credits**
   - Select credits to retire
   - Specify the amount
   - Confirm retirement (credits will be permanently removed from circulation)

### Project Types

Supported project types include:
- `reforestation` - Forest restoration and tree planting projects
- `renewable_energy` - Solar, wind, hydroelectric energy projects
- `carbon_capture` - Direct air capture and storage projects
- Custom types as needed

## 📁 Project Structure

```
.
├── contract/                 # Soroban smart contract
│   ├── src/
│   │   ├── lib.rs           # Main contract implementation
│   │   └── test.rs          # Contract tests
│   ├── Cargo.toml           # Rust dependencies
│   └── target/              # Build output
│
├── app/                      # Next.js frontend application
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── components/      # React components
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/           # Shared UI components
│   ├── lib/                  # Utility functions and contract invocations
│   ├── package.json          # Node.js dependencies
│   └── next.config.ts       # Next.js configuration
│
└── README.md                 # This file
```

## 🛠 Tech Stack

- **Blockchain**: Stellar Soroban
- **Smart Contract Language**: Rust
- **Frontend Framework**: Next.js 16
- **UI Library**: React 19
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Wallet Integration**: Stellar Wallet Kit, Freighter API

## 🔧 Development

### Building the Contract

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
```

### Running Tests

```bash
cd contract
cargo test
```

### Frontend Development

```bash
cd app
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## 🧪 Testing

The smart contract includes comprehensive tests covering:

- Project registration and retrieval
- Credit issuance and validation
- Credit transfers
- Credit retirement
- Balance queries
- Authorization checks (only issuers can issue credits)
- Error handling (insufficient balance, unauthorized access)

Run tests with:
```bash
cd contract
cargo test
```

## 🚢 Deployment

### Deploying the Smart Contract

1. Build the contract (see Installation section)

2. Deploy using Soroban CLI:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_credits.wasm \
  --source <your-account> \
  --network testnet
```

3. Initialize the contract:
```bash
soroban contract invoke \
  --id <contract-id> \
  --source <your-account> \
  --network testnet \
  -- init
```

### Deploying the Frontend

1. Build the frontend:
```bash
cd app
npm run build
```

2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

3. Update environment variables with your contract ID and network settings

## 📊 Smart Contract Data Structures

### CarbonProject
- `id`: Unique project identifier
- `name`: Project name
- `location`: Geographic location
- `project_type`: Type of carbon offset project
- `description`: Project description
- `issuer`: Address of the project issuer
- `created_at`: Timestamp of project creation
- `total_credits_issued`: Total credits issued for this project

### CarbonCredit
- `id`: Unique credit identifier
- `project_id`: Associated project ID
- `amount`: Credit amount
- `owner`: Current owner address
- `issued_at`: Timestamp of issuance
- `vintage`: Year the credit was issued
- `retired`: Whether the credit has been retired

### CreditBatch
- `project_id`: Associated project ID
- `amount`: Batch amount
- `vintage`: Credit vintage
- `issued_at`: Timestamp of issuance

## 🔒 Security Considerations

- Only project issuers can issue credits for their projects
- Transfers require sufficient balance
- Retirement permanently removes credits from circulation
- All operations are validated on-chain
- Project and credit data is immutable once stored

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Stellar Soroban](https://soroban.stellar.org/)
- Inspired by the need for transparent carbon credit markets
- Uses [shadcn/ui](https://ui.shadcn.com/) for UI components

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Note**: This project is for demonstration purposes. Before using in production, ensure proper security auditing and compliance with carbon credit market regulations in your jurisdiction.
