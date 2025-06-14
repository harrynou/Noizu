import bcrypt from "bcrypt";
import crypto from "crypto";
export const hashString = async (str: string): Promise<string> => {
  const saltRounds = 5;
  return await bcrypt.hash(str, saltRounds);
};

export const compareHash = async (str: string, hashed_str: string): Promise<boolean> => {
  return await bcrypt.compare(str, hashed_str);
};

export function generateCodeVerifier() {
  return crypto.randomBytes(64).toString("hex"); // Random 64-character string
}

export async function generateCodeChallenge(codeVerifier: string) {
  const hash = crypto.createHash("sha256").update(codeVerifier).digest("base64");
  // URL-safe base64 encoding
  return hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
