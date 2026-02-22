/**
 * Push & local notifications for Satark India.
 * Call initNotifications() from the dashboard when Capacitor is available.
 */

export async function initNotifications(): Promise<void> {
  if (typeof window === 'undefined') return
  const Cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: { PushNotifications?: unknown } } }).Capacitor
  if (!Cap?.isNativePlatform?.() || !Cap.Plugins?.PushNotifications) return

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')
    await PushNotifications.requestPermissions()
    await PushNotifications.register()

    PushNotifications.addListener(
      'registration',
      (token) => {
        console.log('Satark FCM token:', token.value)
      }
    )

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Satark push received:', notification)
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('satarkPushNotification', { detail: notification }))
        }
      }
    )

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action) => {
        console.log('Satark push action:', action)
      }
    )
  } catch (e) {
    console.warn('Satark notifications init skipped:', e)
  }
}
