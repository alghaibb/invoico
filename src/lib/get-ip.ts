import { headers } from "next/headers";

export function getIp() {
  const headersList = headers(); // Get headers without any arguments
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  // Check for forwarded IP first, fall back to real IP
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  // Default return if neither header is present
  return null;
}
