# ECOFUSION

Ecofusion provides an open and transparent way for individuals and organizations to transform their everyday sustainable actions into verified carbon value.

Users can record activities such as tree planting, recycling, or renewable energy use directly on the platform. An AI verification system analyzes submitted evidence (photos, videos, metadata) to estimate CO₂ reduction and confirm authenticity.

Ecofusion uses Distributed Ledger Technology (DLT) to store all verified sustainability actions on a decentralized, tamper-proof ledger. This ensures full transparency, prevents duplicate claims, and creates trusted traceability from individual actions to certified carbon credits.

All verified actions are aggregated into larger community projects that meet certification standards set by recognized bodies like Verra. Once a project is certified, Ecofusion mints carbon tokens through the Hedera Token Service (HTS) to represent the total verified carbon credits.

This entire tokenization cycle is anchored on DLT, which provides decentralized validation, immutable audit trails, and guarantees that every carbon token minted corresponds to a real, verifiable carbon credit. Participants receive fractional tokens based on their contributions, creating a fair and transparent reward system.

Each token is fully backed by a certified carbon credit, ensuring accountability and trust. By combining AI verification, DLT transparency, and community participation, Ecofusion makes it simple for anyone to contribute to global climate goals while gaining measurable environmental and financial value.

Ecofusion ensures that Africans can monetize verified climate actions or participate in global carbon markets, unlocking value that was previously out of reach.
<img width="1141" height="699" alt="Untitled Diagram drawio (2)" src="https://github.com/user-attachments/assets/830cf2de-4486-41d4-935c-2ce538294e50" />

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
# 6. Start the development server
npx hardhat run scripts/deploy.ts --network testnet
```

### Hedera Developer Certificates

[chisom certificate.pdf](https://github.com/user-attachments/files/23269974/certificate.pdf)

[ibrahim_certificate.pdf](https://github.com/user-attachments/files/23269972/ibrahim_arogundade_certificate.pdf)

[pitch deck](https://drive.google.com/file/d/1T9TyETQDXetKu1DeSdFqKjbgeLLwh0lv/view?usp=sharing)

# Deployment Links

- **Action Repository:** [https://hashscan.io/testnet/contract/0.0.7170359](https://hashscan.io/testnet/contract/0.0.7170359)  
- **Action NFT (HTS):** [https://hashscan.io/testnet/token/0.0.7170361](https://hashscan.io/testnet/token/0.0.7170361)  
- **Carbon Credit:** [https://hashscan.io/testnet/contract/0.0.7170364](https://hashscan.io/testnet/contract/0.0.7170364)  
- **Carbon Credit Token (HTS):** [https://hashscan.io/testnet/token/0.0.7170366](https://hashscan.io/testnet/token/0.0.7170366)  
- **Marketplace:** [https://hashscan.io/testnet/contract/0.0.7170368](https://hashscan.io/testnet/contract/0.0.7170368)










