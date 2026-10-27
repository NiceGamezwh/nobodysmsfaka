# Deploy / stock tools (Sepolia)

- `compile-member-queue.mjs` — compile `contracts/MemberCardQueue.sol`
- `deploy-member-queues.mjs` — deploy three queues (tiers 3/15/30); writes `contracts/deployed-sepolia.json`
- `add-cards.mjs` — owner `addCards` for a given contract

## Stock cards

Create a text file (one full card per line), format:

```
账号----密码
```

Then:

```bash
cd scripts && npm install
node add-cards.mjs <contractAddress> ../path/to/cards.txt
```

Requires `scripts/.env.deploy` with `DEPLOYER_PRIVATE_KEY` and `SEPOLIA_RPC_URL` (not committed).
