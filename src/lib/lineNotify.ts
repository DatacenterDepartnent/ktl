/**
 * Send a notification to LINE via the Line Notify API.
 */
export async function sendLineNotify(message: string) {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.warn("LINE_NOTIFY_TOKEN is not configured.");
    return false;
  }

  try {
    const res = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({ message })
    });
    return res.ok;
  } catch (error) {
    console.error("Line Notify Error:", error);
    return false;
  }
}
