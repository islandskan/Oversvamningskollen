export async function pushNotifier(message) {
  const payload = {
    app_id: process.env.NATIVE_NOTIFY_APP_ID,
    app_token: process.env.NATIVE_NOTIFY_APP_TOKEN,
    title: 'Varning: Vattennivån ökar snabbt!',
    message: message,
  };

  try {
    const response = await fetch('https://app.nativenotify.com/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Push skickad till ALLA:', data);
  } catch (error) {
    console.error('Fel vid broadcast-push:', error);
  }
}

