
import "dotenv/config";
import { google } from "googleapis";

const oauth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

try {
  const result = await oauth.getAccessToken();
  console.log(result.token ? "OAuth SUCCESS" : "No access token");
} catch (error) {
  
  console.log("\n========== OAUTH ERROR ==========");

  console.log("Message:", error.message);
  console.log("Code:", error.code);
  console.log("HTTP Status:", error.response?.status);
  console.log("Error Type:", error.response?.data?.error);
  console.log("Description:", error.response?.data?.error_description);

  console.log("Request URL:", error.config?.url);
  console.log("Request Method:", error.config?.method);

  console.log("Response Headers:", error.response?.headers);
  console.log("Response Data:", error.response?.data);

  console.log("Stack:", error.stack);
  console.log("=================================");
}
