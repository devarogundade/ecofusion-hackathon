# ECOFUSION

## React App

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/devarogundade/cleanup-hedera-hackathon.git

# 2. Navigate to the React app directory
cd react-app

# 3. Install dependencies
npm install
```

### 🌐 Environment Variables

Create a .env file inside the react-app directory and add your credentials:

```bash
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=

VITE_OPERATOR_ID=
VITE_OPERATOR_KEY=

VITE_PINATA_JWT=
VITE_PINATA_GATEWAY=

VITE_ACTION_REPOSITORY_ID=
VITE_ACTION_REPOSITORY_TOKEN_ID=

VITE_CARBON_CREDIT_ID=
VITE_CARBON_CREDIT_TOKEN_ID=

VITE_MARKETPLACE_ID=

VITE_FB_API_KEY=
VITE_FB_APP_ID=
VITE_FB_AUTH_DOMAIN=
VITE_FB_MEASUREMENT_ID=
VITE_FB_MESSAGING_SENDER_ID=
VITE_FB_PROJECT_ID=
VITE_FB_STORAGE_BUCKET=
```

```bash
# 4. Start the development server
vite
```

# Smart Contracts

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/devarogundade/ecofusion-hackathon.git

# 2. Navigate to the React app directory
cd smart-contract

# 3. Install dependencies
npm install
```

### 🌐 Environment Variables

```bash
# 4. Set config variables
HEDERA_PRIVATE_KEY=
```

```bash
# 5. Compile contracts
npx hardat compile
```

```bash
# 5. Start the development server
npx hardhat run scripts/deploy.ts --network testnet
```

### Hedera Developer Certificates

[chisom certificate.pdf](https://github.com/user-attachments/files/23269974/certificate.pdf)

[ibrahim_certificate.pdf](https://github.com/user-attachments/files/23269972/ibrahim_arogundade_certificate.pdf)


