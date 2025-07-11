import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "your-secret-key";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { userId: string; expires: Date }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(
  input: string,
): Promise<{ userId: string; expires: Date }> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as { userId: string; expires: Date };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function createSession(userId: string) {
  const session = await encrypt({
    userId,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const { prisma } = await import("../../database/client");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return user;
}
