import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const envText = fs.readFileSync(path.join(__dirname, ".env.deploy"), "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);

let pk = env.DEPLOYER_PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
const rpc = env.SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL;
if (!pk || !rpc) {
  console.error("missing DEPLOYER_PRIVATE_KEY or SEPOLIA_RPC_URL");
  process.exit(1);
}
if (!pk.startsWith("0x")) pk = "0x" + pk;

const artifact = JSON.parse(
  fs.readFileSync(path.join(root, "contracts/out/MemberCardQueue.json"), "utf8"),
);

const provider = new ethers.JsonRpcProvider(rpc);
const wallet = new ethers.Wallet(pk, provider);
console.log("deployer", wallet.address);
const bal = await provider.getBalance(wallet.address);
console.log("balance_eth", ethers.formatEther(bal));

// Recharge tiers — IDs must not collide with register 3/15/30
const tiers = [
  { tier: "r15", amount: "15.00" },
  { tier: "r30", amount: "30.00" },
  { tier: "r60", amount: "60.00" },
];
const deployments = [];

for (const { tier, amount } of tiers) {
  console.log("--- deploying MemberCardQueue for recharge tier", tier, "amount", amount, "---");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  const tx = contract.deploymentTransaction();
  console.log("deployTx", tx.hash);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const receipt = await tx.wait();
  console.log("contractAddress", address);
  console.log("status", receipt.status);

  const owner = await contract.owner();
  const remaining = await contract.remaining();
  const total = await contract.total();
  console.log("owner", owner, "remaining", remaining.toString(), "total", total.toString());

  deployments.push({
    kind: "recharge",
    tier,
    amount,
    contractAddress: address,
    deployTx: tx.hash,
    blockNumber: receipt.blockNumber,
    owner,
  });
}

const out = {
  network: "sepolia",
  chainId: 11155111,
  contract: "MemberCardQueue",
  kind: "recharge",
  deployer: wallet.address,
  deployedAt: new Date().toISOString(),
  deployments,
};
fs.writeFileSync(
  path.join(root, "contracts/deployed-recharge-sepolia.json"),
  JSON.stringify(out, null, 2),
);
console.log("wrote contracts/deployed-recharge-sepolia.json");
console.log(
  JSON.stringify(
    deployments.map((d) => ({ tier: d.tier, amount: d.amount, address: d.contractAddress, tx: d.deployTx })),
    null,
    2,
  ),
);
