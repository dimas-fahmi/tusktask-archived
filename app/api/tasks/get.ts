import { createResponse } from "@/src/lib/utils/createResponse";
import { NextRequest } from "next/server";

const PATH = "API_TASKS_GET";

export async function tasksGet(req: NextRequest) {
  return createResponse(200, "connected", "Hello World", { req, PATH });
}
