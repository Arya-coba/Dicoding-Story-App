import StoriesAPI from "../data/api.js"; 

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

export async function subscribeUser() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: await urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  try {
    await StoriesAPI.subscribePushNotification(subscription);
    console.log('Push Subscription sent to API');
  } catch (error) {
    console.error('Failed to subscribe push notification:', error);
    throw error; 
  }
}

export async function unsubscribeUser() {
  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();
  
  if (!existingSubscription) {
    console.warn('Belum ada langganan notifikasi.');
    return;
  }

  const endpoint = existingSubscription.endpoint;
  
  try {
    await StoriesAPI.unsubscribePushNotification(endpoint);
    await existingSubscription.unsubscribe(); 
    console.log('Berhasil berhenti berlangganan');
  } catch (error) {
    console.error('Gagal berhenti berlangganan:', error);
    throw error; 
  }
}