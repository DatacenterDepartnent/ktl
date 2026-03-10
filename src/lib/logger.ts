// src/lib/logger.ts
export async function recordActivity(data: {
  userId: string;
  userName: string;
  action: string;
  details: string;
}) {
  try {
    await fetch("/api/admin/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
}
