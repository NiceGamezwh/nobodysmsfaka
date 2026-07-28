import { NextResponse } from "next/server";
import { PRODUCTS, TIER_LIST } from "@/lib/products";
import { getUnusedCount } from "@/lib/contract";

// 返回各档位当前链上未使用卡密数量（库存）。
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const entries = await Promise.all(
    TIER_LIST.map(async (tier) => {
      try {
        const count = await getUnusedCount(PRODUCTS[tier].contract, PRODUCTS[tier].member === true);
        return [tier, count] as const;
      } catch (err: any) {
        console.log("[v0] 查询库存失败 tier=", tier, err?.message);
        return [tier, null] as const;
      }
    }),
  );

  const stock: Record<string, number | null> = {};
  for (const [tier, count] of entries) stock[tier] = count;

  return NextResponse.json({ success: true, stock });
}
