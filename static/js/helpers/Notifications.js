function getNotifications() {
    if (localStorage["login_data"] == "undefined" || localStorage["login_data"] == undefined) return;

    let loginData = JSON.parse(localStorage["login_data"])
    fetch(`/api/notifications/${loginData._id}?token=${loginData.account_token}`).then(r => {
        return r.json()
    }).then(notifications => {
        if (notifications.length < 1) return document.querySelectorAll("#notification-nav-menu").forEach(panel => {
            document.querySelector(".navbar .right-controls i").style = "--indicator-opacity: 0;"
            panel.innerHTML = `<p class="warn">Nothing here :3c</p>`;
        })

        document.querySelectorAll("#notification-nav-menu").forEach(panel => {
            panel.innerHTML = ""
        })

        document.querySelector(".navbar .right-controls i").style = "--indicator-opacity: 1;"

        notifications.forEach(n => {
            document.querySelectorAll("#notification-nav-menu").forEach(panel => {
                panel.insertAdjacentHTML("afterbegin", `<div class="notification" onclick="window.location = '/api/notifications/${loginData._id}/${n.id}?token=${loginData.account_token}'">
            <div class="thumbnail" style="background-image: url(${n.thumbnail});"></div>
            <p class="body">${n.body}</p>
        </div>`)
            })
        })
    }).catch(e => {
        console.error(e)
    })
}

function showNotificationPanel(type, content) {
    let box = document.querySelector(".warn-float-box");
    let icon = document.querySelector(".warn-float-box i");
    let text = document.querySelector(".warn-float-box p")

    box.classList = `warn-float-box ${type}`;

    text.innerText = content;
    icon.classList = `fa fa-${type}`;
    box.style.opacity = "1"
    box.style.top = "120px";

    setTimeout(() => {
        setTimeout(() => {
            box.style.opacity = "0"
            box.style.top = "-5vh";
        }, 230)
    }, 5000)
    document
}

function checkNotificationConfigInput(value) {
    if (value == "true") return enablePushNotifications();
}

getNotifications()