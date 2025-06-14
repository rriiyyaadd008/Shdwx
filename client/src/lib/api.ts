import { apiRequest } from "./queryClient";
import { BypassRequest, BypassResponse } from "@shared/schema";

export async function bypassUrl(request: BypassRequest): Promise<BypassResponse> {
  const response = await apiRequest("POST", "/api/bypass", request);
  return response.json();
}
