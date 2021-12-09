self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/favicon.ico",
        actions: [{ action: openNotification, title: "Go to queue" }]
    })

    self.addEventListener("notificationclick", openNotification);

    function openNotification() {
        clients.openWindow(`https://osumodweb.herokuapp.com/api/notifications/${data.queue}/${data.id}?token=${data.token}`)
    }
})