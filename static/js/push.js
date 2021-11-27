function enablePushNotifications() {
    if (window.localStorage["login_data"] == undefined) return window.alert("Invalid login credentials, try log-in again.");
    let loginData = JSON.parse(window.localStorage["login_data"])

    const publicVapidKey = 'BOGn5q4VEeKaVw7mBoMtgBCipLksIk5xrgZOAhpd47VOOdE5I64yYvjpjX4uzXKGcE7g1FStgvqYAXhi8TFZ8tI';

    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if ('serviceWorker' in navigator) {
        send().catch(err => console.error(err));
    }

    async function send() {
        const register = await navigator.serviceWorker.register('/worker.js', {
            scope: '/'
        });
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch("/api/notifyme", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": loginData.account_token
            },
            body: JSON.stringify({
                user_id: loginData._id,
                scopes: ["newQueueRequest", "queueRequestUpdate"],
                subscription: subscription
            })
        });
    }
}