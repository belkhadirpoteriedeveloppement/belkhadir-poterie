// netlify/functions/api.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { handler as submitOrderHandler } from "./submit-order";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const path = event.path || event.rawUrl || "";
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    if (path.includes("/orders") && event.httpMethod === "POST") {
      return await submitOrderHandler(event, context);
    }

    if (path.includes("/ping") && event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Netlify API Function Active - Belkhadir Poterie",
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Route not found", path, method: event.httpMethod }),
    };
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", message: error.message }),
    };
  }
};
