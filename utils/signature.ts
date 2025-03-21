// src/utils/signature.ts
import crypto from "crypto";

export function generateSignature(
  data: Record<string, string>,
  secretKey: string
): string {
  // Sort the keys in lexicographical order
  const keys = Object.keys(data).sort();

  // Create a string with key-value pairs separated by &
  const requestString = keys.map((key) => `${key}=${data[key]}`).join("&");

  // Convert secretKey from hex to bytes
  const keyBytes = Buffer.from(secretKey, "hex");

  // Create HMAC with SHA256
  const hmac = crypto.createHmac("sha256", keyBytes);

  // Update with the request string
  hmac.update(requestString);

  // Get the digest in hex format
  return hmac.digest("hex").toUpperCase();
}

export function verifySignature(
  data: Record<string, string>,
  signature: string,
  secretKey: string
): boolean {
  const computedSignature = generateSignature(data, secretKey);
  return computedSignature === signature;
}
