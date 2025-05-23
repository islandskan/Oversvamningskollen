export async function sendPushNotification(expoPushToken, message) {
  const payload = {
    to: expoPushToken,
    sound: 'default',
    title: 'Varning: Vattennivån ökar snabbt!',
    body: message,
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Push skickad:', data);
  } catch (error) {
    console.error('Fel vid push-notis:', error);
  }
}