// 链上卡密合约调用（仅服务端，使用管理员私钥）
import { ethers } from "ethers";

// 旧普通卡密合约（两段式）最小 ABI — 保留兼容，当前全档位已切到 MemberCardQueue
export const KAMI_ABI = [
  "function getKami() external returns (string kami)",
  "function getUnusedCount() external view returns (uint256)",
  "event KamiClaimed(string kami, address indexed admin)",
];

// MemberCardQueue（API账号----API密码---安全密码）最小 ABI
export const MEMBER_ABI = [
  "function getNextCard() external returns (string)",
  "function remaining() external view returns (uint256)",
  "function total() external view returns (uint256)",
  "function addCards(string[] calldata newCards) external",
  "event CardTaken(uint256 indexed index, string card)",
];

// 硬编码的链上凭证（应用户要求）。如需覆盖可设置同名环境变量。
const SEPOLIA_RPC_URL =
  "https://eth-sepolia.g.alchemy.com/v2/7-4H1kHpf-BW1TkRsy-sfD16tUcPmk8k";
const WALLET_PRIVATE_KEY =
  "0x912b9e0128f3f87f4e21224508cba3dea7c2bfcf81b0e33a8d6b2050fc9cf364";

function getProvider(): ethers.JsonRpcProvider {
  const rpc = process.env.SEPOLIA_RPC_URL || SEPOLIA_RPC_URL;
  return new ethers.JsonRpcProvider(rpc);
}

function getWallet(): ethers.Wallet {
  const pk = process.env.WALLET_PRIVATE_KEY || WALLET_PRIVATE_KEY;
  return new ethers.Wallet(pk, getProvider());
}

/** 查询某个合约当前未使用的卡密数量 */
export async function getUnusedCount(contractAddress: string, isMember = true): Promise<number> {
  const provider = getProvider();
  if (isMember) {
    const contract = new ethers.Contract(contractAddress, MEMBER_ABI, provider);
    const count: bigint = await contract.remaining();
    return Number(count);
  }
  const contract = new ethers.Contract(contractAddress, KAMI_ABI, provider);
  const count: bigint = await contract.getUnusedCount();
  return Number(count);
}

/**
 * 从指定合约领取一个未使用的卡密。
 * 当前全档位使用 MemberCardQueue：调用 getNextCard()，从 CardTaken 事件解析完整卡密字符串
 *（格式：API账号----API密码---安全密码，合约不解析分隔符）。
 * isMember=false 时回退旧 getKami / KamiClaimed（兼容遗留合约）。
 */
export async function claimKami(contractAddress: string, isMember = true): Promise<string> {
  const wallet = getWallet();
  const abi = isMember ? MEMBER_ABI : KAMI_ABI;
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const tx = isMember ? await contract.getNextCard() : await contract.getKami();
  const receipt = await tx.wait();

  const eventName = isMember ? "CardTaken" : "KamiClaimed";
  for (const log of receipt?.logs ?? []) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed && parsed.name === eventName) {
        return (isMember ? parsed.args.card : parsed.args.kami) as string;
      }
    } catch {
      // 非本合约事件，忽略
    }
  }

  throw new Error(`交易已上链但未解析到 ${eventName} 事件`);
}
