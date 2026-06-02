import crypto from "crypto";

export function createShareToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashShareToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getAppBaseUrl(request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;

  if (configured) {
    return configured.startsWith("http") ? configured : `https://${configured}`;
  }

  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");
  return host ? `${proto}://${host}` : "";
}

export async function createSecureShareLink(tx, request, { userId, recipientEmail, itemType, itemId, title, summary }) {
  const token = createShareToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  const link = await tx.secureShareLink.create({
    data: {
      clerkUserId: userId,
      tokenHash: hashShareToken(token),
      recipientType: "caregiver",
      recipientEmail: recipientEmail || null,
      itemType,
      itemId: itemId || null,
      title,
      summary,
      expiresAt,
    },
  });

  return {
    id: link.id,
    url: `${getAppBaseUrl(request)}/share/${token}`,
    expiresAt,
  };
}
