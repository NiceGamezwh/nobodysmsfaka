/**
 * Admin stock uploader for MemberCardQueue.
 * Usage:
 *   node scripts/add-cards.mjs <contractAddress> ./cards.txt
 *   node scripts/add-cards.mjs <contractAddress> --inline 'card1' 'card2'
 *
 * cards.txt: one full card string per line (API账号----API密码).
 * Reads DEPLOYER_PRIVATE_KEY + SEPOLIA_RPC_URL from scripts/.env.deploy
 * (or process env). Does not print card secrets.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const p = path.join(__dirname, ".env.deploy");
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(p, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      }),
  );
}

const env = loadEnv();
let pk = env.DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY || process.env.WALLET_PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY;
const rpc = env.SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL;
if (!pk || !rpc) {
  console.error("missing DEPLOYER_PRIVATE_KEY or SEPOLIA_RPC_URL");
  process.exit(1);
}
if (!pk.startsWith("0x")) pk = "0x" + pk;

const [, , contractAddress, ...rest] = process.argv;
if (!contractAddress || !ethers.isAddress(contractAddress)) {
  console.error("Usage: node scripts/add-cards.mjs <contractAddress> <cards.txt | --inline card...>");
  process.exit(1);
}

let cards = [];
if (rest[0] === "--inline") {
  cards = rest.slice(1).map((c) => c.trim()).filter(Boolean);
} else if (rest[0]) {
  cards = fs
    .readFileSync(path.resolve(rest[0]), "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
} else {
  console.error("Provide cards.txt path or --inline cards");
  process.exit(1);
}

if (!cards.length) {
  console.error("No cards to add");
  process.exit(1);
}

const ABI = [
  "function addCards(string[] calldata newCards) external",
  "function remaining() external view returns (uint256)",
  "function total() external view returns (uint256)",
  "function owner() external view returns (address)",
  "event CardsAdded(uint256 startIndex, uint256 count)",
];

const provider = new ethers.JsonRpcProvider(rpc);
const wallet = new ethers.Wallet(pk, provider);
const contract = new ethers.Contract(contractAddress, ABI, wallet);

console.log("deployer", wallet.address);
console.log("contract", contractAddress);
console.log("adding", cards.length, "card(s) (secrets not printed)");

const before = await contract.remaining();
const tx = await contract.addCards(cards);
console.log("tx", tx.hash);
const receipt = await tx.wait();
const after = await contract.remaining();
const total = await contract.total();
console.log("status", receipt.status, "remaining", before.toString(), "->", after.toString(), "total", total.toString());
