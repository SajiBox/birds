import { ProviderAdapter, CreateTaskResult, CheckTaskResult, createProviderError } from "./interface";

const KIE_API_BASE = "https://api.kie.ai/api/v1";

class KieProvider implements ProviderAdapter {
  async createTask(key: string, model: string, input: any): Promise<CreateTaskResult> {
    const res = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, input }),
    });
    const data = await res.json();
    if (!res.ok || data.code !== 200) throw createProviderError(res.status, data.msg || "Error");
    return { providerTaskId: data.data.taskId };
  }

  async checkTask(key: string, providerTaskId: string): Promise<CheckTaskResult> {
    const res = await fetch(`${KIE_API_BASE}/jobs/recordInfo?taskId=${providerTaskId}`, {
      headers: { "Authorization": `Bearer ${key}` },
    });
    const data = await res.json();
    if (!res.ok) throw createProviderError(res.status, "Error");
    
    const state = data.data.state?.toLowerCase();
    let status: any = state === "success" ? "completed" : state === "fail" ? "failed" : "processing";
    let urls: string[] | undefined;
    if (data.data.resultJson) {
      try { urls = JSON.parse(data.data.resultJson).resultUrls; } catch {}
    }
    return { status, urls, error: data.data.failMsg, progress: state === "success" ? 100 : 50 };
  }
}
export const kieProvider = new KieProvider();