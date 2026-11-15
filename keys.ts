export type ErrorClass = "disabled" | "exhausted" | "provider" | "params" | "temporary";

export function classifyProviderError(status: number, message: string): ErrorClass {
  const msg = message.toLowerCase();
  if (status === 401 || status === 403 || msg.includes("unauthorized")) return "disabled";
  if (status === 402 || msg.includes("insufficient") || msg.includes("quota")) return "exhausted";
  if ((status === 400 || status === 422) && msg.includes("model not found")) return "provider";
  if (status === 400 || status === 422) return "params";
  return "temporary";
}

export function maskKey(key: string) {
  if (!key || key.length < 11) return key.slice(0, 3) + "••••";
  return key.slice(0, 7) + "••••••••" + key.slice(-4);
}