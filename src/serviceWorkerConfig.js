const { PUBLIC_URL } = process.env

const receivePushNotification = (event, registration) => {
  console.log('[Service Worker] Push Received.')

  alert(JSON.stringify(event))

  // const { image, tag, url, title, text } = event.data.json()

  const image = 'https://via.placeholder.com/128/ff0000'
  const tag = 'tag'
  const url = PUBLIC_URL
  const title = 'title'
  const text = 'text'

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag,
    image,
    badge: 'https://spyna.it/icons/favicon.ico',
    actions: [
      {
        action: 'Detail',
        title: 'View',
        icon: 'https://via.placeholder.com/128/ff0000',
      },
    ],
  }
  event.waitUntil(registration.showNotification(title, options))
}

const openPushNotification = event => {
  console.log('[Service Worker] Notification click Received.', event.notification.data)

  event.notification.close()
  // event.waitUntil(clients.openWindow(event.notification.data))
}

const config = store => ({
  // onUpdate: (registration) => {
  //   registration.unregister().then(() => {
  //     window.location.reload()
  //   })
  // },
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          if (store) {
          } else {
            alert('Update Available! Please refresh your browser.')
          }
        }
      })
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' })
    }
  },
  onSuccess: registration => {
    console.info('Service worker on success state')
    console.log(registration)

    window.addEventListener('push', e => receivePushNotification(e, registration))
    window.addEventListener('notificationclick', openPushNotification)
  },
  store,
})

export default config
