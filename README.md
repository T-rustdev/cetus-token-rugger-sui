## 🚨 SUI Token Rugger
This bot automates the distribution of **small amounts of SUI and tokens** from a main wallet to **multiple new wallets**, then executes **sell orders** from those wallets. It can be configured to **gradually or instantly dump** tokens based on your strategy. All settings are **fully customizable** to meet your specific needs.

---

## 🛠️ Setup & Usage

### 1️⃣ Installation
- Clone the repository and navigate into the project directory:
```sh
git clone https://github.com/T-rustdev/cetus-token-rugger-sui.git
cd cetus-token-rugger-sui
```

### 2️⃣ Configure Environment Variables
- Rename `.env.example` to `.env`
- Set the required variables:
```plaintext
PRIVATE_KEY=your_main_wallet_private_key
POOL_ID=your_token_pool_id
RPC_ENDPOINT=https://rpc.ankr.com/sui/<API-KEY>
RPC_WEBSOCKET_ENDPOINT=wss://rpc.ankr.com/sui/ws/<API-KEY>
SELL_INTERVAL=50
SELL_INTERVAL_RANDOM=true
MIN_TOKEN_AMOUNT=100
MAX_TOKEN_AMOUNT=900
```

### 3️⃣ Run the Bot
- Start the bot:
```sh
npm start
```
- Gather SUI from ungathered wallets:
```sh
npm run gather
```

---

## 🔧 Features
✅ **Automated Token Distribution** – Sends small token amounts to multiple wallets before selling.<br>  
✅ **Configurable Dump Speed** – Choose between slow, medium, or fast selling strategies.<br>  
✅ **Optimized Gas Fees** – Efficient SUI transactions to minimize costs.<br>
✅ **Multi-Wallet Execution** – Distributes sell orders across different wallets for a natural-looking market exit.<br>  
✅ **Easy to Configure** – Adjust settings like token amount, speed, RPC node, and wallet count.<br>  

---

## 📞 Contact
📩 For full access, reach out via:

- **Telegram:** [T-rustdev](https:/t.me/T_rustdev)

Feel free to reach out for **help, modifications, or custom blockchain projects!** 🚀
