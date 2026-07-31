// Upstash Redis 轻量客户端（基于 REST API，无需额外依赖）。
// 用途：为「领取卡密」提供服务端跨实例的幂等与并发锁，彻底避免刷新/重复请求
// 导致合约 getKami() 被多次调用而重复消耗库存。
//
// 说明：按用户要求，凭证直接硬编码在此处（未走环境变量）。
const UPSTASH_REDIS_REST_URL = "https://trusty-locust-77382.upstash.io";
const UPSTASH_REDIS_REST_TOKEN =
  "gQAAAAAAAS5GAAIgcDE2MTQ2ZTYzOWZhNjY0MGQ4ODIyM2IwZmJiZDkyZTkwNg";

// 向 Upstash 发送单条命令。命令以字符串数组形式传入，例如 ["SET", key, value, "NX"]。
async function command<T = unknown>(args: (string | number)[]): Promise<T> {
  const res = await fetch(UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    // 领取是关键路径，禁用缓存，始终实时执行
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash 请求失败 ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { result: T; error?: string };
  if (data.error) throw new Error(`Upstash 命令错误: ${data.error}`);
  return data.result;
}

// 读取字符串值，不存在返回 null。
export async function redisGet(key: string): Promise<string | null> {
  return command<string | null>(["GET", key]);
}

// 永久写入字符串值（无过期）。
export async function redisSet(key: string, value: string): Promise<void> {
  await command(["SET", key, value]);
}

// 原子获取锁：仅当 key 不存在时写入，并设置过期秒数，防止死锁。
// 返回 true 表示成功抢到锁，false 表示已被其他请求占用。
export async function redisAcquireLock(key: string, ttlSeconds: number): Promise<boolean> {
  const result = await command<string | null>(["SET", key, "1", "NX", "EX", String(ttlSeconds)]);
  return result === "OK";
}

// 释放锁。
export async function redisDel(key: string): Promise<void> {
  await command(["DEL", key]);
}
