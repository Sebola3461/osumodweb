function requestBeatmap(button) {
    let loginData;
    let requestCache;
    button.setAttribute("disabled", "true")

    try {
        loginData = JSON.parse(localStorage["login_data"])
    } catch (e) {
        button.removeAttribute("disabled")
        return showNotificationPanel("times", "Please, Log-in to request!");
    }

    try {
        requestCache = JSON.parse(sessionStorage["request-cache"])
    } catch (e) {
        button.removeAttribute("disabled")
        return showNotificationPanel("times", "Something is wrong. Reload the window and try again.");
    }

    if (requestCache.beatmap_id == undefined) {
        button.removeAttribute("disabled")
        return showNotificationPanel("times", "Invalid beatmap id!");
    }
    if (requestCache.queue_id == undefined) {
        button.removeAttribute("disabled")
        return showNotificationPanel("times", "Invalid queue id!");
    }
    if (requestCache.comment == undefined) {
        button.removeAttribute("disabled")
        return showNotificationPanel("info-circle", "Please, add a comment to your request!");
    }

    fetch("/api/queue/request", {
        method: "post",
        headers: {
            "authorization": loginData.account_token,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user_id: loginData._id,
            queue_id: requestCache.queue_id,
            beatmap_id: requestCache.beatmap_id,
            comment: requestCache.comment
        })
    }).then(r => {
        return r.json()
    }).then(r => {
        if (r.code != undefined) {
            showNotificationPanel("times", r.message);
            return button.removeAttribute("disabled")
        }
        showNotificationPanel("check", "Request deliveried!")
        filterQueueRequests(true)
        button.removeAttribute("disabled")
    }).catch(e => {
        button.removeAttribute("disabled")
        showNotificationPanel("times", e.message);
    })
}

async function updateBeatmapStatus(status, id, reply, element) {
    let queue_id = window.location.pathname.split("/").pop();
    let loginData;

    reply ? reply = reply : "Not provided.";

    try {
        loginData = JSON.parse(localStorage["login_data"])
    } catch (e) {
        return showNotificationPanel("times", "Please, Log-in to do this!");
    }

    if (element) {
        element.style = "--loading-overlay-opacity: 1;";
    }

    fetch("/api/update/queue/request/", {
        method: "post",
        headers: {
            "authorization": loginData.account_token,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            queue_id: queue_id,
            request_id: id,
            reply: reply,
            action: status
        })
    }).then(r => {
        return r.json()
    }).then((r) => {
        if (r.code == 400) return showNotificationPanel("times", r.message);
        showNotificationPanel("check", r.message)

        try {
            filterQueueRequests(sessionStorage["queue-listing-pending"])
        } catch (e) {
            console.log(e)
        }

        if (element) {
            element.style = "--loading-overlay-opacity: 0;";
            updateVisualRequest(status.concat("ed"), element)
        }
    }).catch((e) => {
        showNotificationPanel("times", e.message)
    })
}

function createNewQueue() {
    let loginData;

    try {
        loginData = JSON.parse(localStorage["login_data"])
    } catch (e) {
        return showNotificationPanel("times", "Please, Log-in to do this!");
    }

    showNotificationPanel("info-circle", "Creating queue. Please, wait.")

    try {
        document.querySelector(".create-queue-button").setAttribute("disabled", "true")
    } catch (e) {
        console.error(e)
    }
    fetch("/api/createqueue", {
        method: "post",
        headers: {
            "content-type": "application/json",
            "authorization": loginData.account_token
        },
        body: JSON.stringify({
            user_id: loginData._id
        })
    }).then(r => {
        return r.json()
    }).then(d => {
        window.location.pathname = "/settings"
    }).catch(e => {
        console.error(e)
        return showNotificationPanel("times", e.message)
    })
}

function updateQueueConfigs(configs) {
    let loginData;

    try {
        loginData = JSON.parse(localStorage["login_data"])
    } catch (e) {
        return showNotificationPanel("times", "Please, log-in to do this! If you are loged-in, log-out and try again.")
    }

    fetch("/api/update/queue/settings", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": loginData.account_token
        },
        body: JSON.stringify({
            queue_id: loginData._id,
            options: configs
        })
    }).then(r => {
        return r.json()
    }).then(() => {
        document.querySelector(".save-button").removeAttribute("disabled")
        return showNotificationPanel("check", "Configs updated!")
    }).catch(e => {
        console.error(e)
        document.querySelector(".save-button").removeAttribute("disabled")
        return showNotificationPanel("times", r.message)
    })
}

function updateUserPushConfig(enable, scopes) {
    let loginData;

    try {
        loginData = JSON.parse(localStorage["login_data"])
    } catch (e) {
        return showNotificationPanel("times", "Please, log-in to do this! If you are loged-in, log-out and try again.")
    }

    fetch("/api/update/user/push", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": loginData.account_token
        },
        body: JSON.stringify({
            user_id: loginData._id,
            enable: enable,
            scopes: scopes
        })
    }).then(r => {
        return r.json()
    }).then(() => {
        document.querySelector(".save-button").removeAttribute("disabled")
    }).catch(e => {
        console.error(e)
        document.querySelector(".save-button").removeAttribute("disabled")
        return showNotificationPanel("times", r.message)
    })
}