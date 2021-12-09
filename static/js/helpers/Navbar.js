function toggleNavbarMenu() {
    let x = document.querySelector(".navbar-mobile .vertical");
    if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

function toggleProfileMenu(ev) {
    if (ev.target.className != "profile-icon") return;
    let x = document.querySelector("#profile-nav-menu");
    if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "flex";
        setTimeout(() => {
            x.style.marginTop = "50px"
            x.style.opacity = "1";
        }, 80)
    } else {
        x.style.marginTop = "30px"
        x.style.opacity = "0";
        setTimeout(() => {
            x.style.display = "none";
        }, 80)
    }
}

function toggleProfileMenuMobile(ev) {
    if (ev.target.className != "profile-icon") return;
    let x = document.querySelector(".nav-panel.profile.mobile");
    if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "flex";
        setTimeout(() => {
            x.style.marginTop = "50px"
            x.style.opacity = "1";
        }, 80)
    } else {
        x.style.marginTop = "30px"
        x.style.opacity = "0";
        setTimeout(() => {
            x.style.display = "none";
        }, 80)
    }
}

function toggleNotificationMenu() {
    let x = document.querySelector("#notification-nav-menu");
    if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "flex";
        setTimeout(() => {
            x.style.top = "80px"
            x.style.opacity = "1";
        }, 80)
    } else {
        x.style.top = "50px"
        x.style.opacity = "0";
        setTimeout(() => {
            x.style.display = "none";
        }, 80)
    }
}

function toggleNotificationMenuMobile() {
    let x = document.querySelector(".nav-panel.notifications.mobile");
    if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "flex";
        setTimeout(() => {
            x.style.top = "80px"
            x.style.opacity = "1";
        }, 80)
    } else {
        x.style.top = "50px"
        x.style.opacity = "0";
        setTimeout(() => {
            x.style.display = "none";
        }, 80)
    }
}

function goToOwnQueue() {
    let loginData;

    try {
        loginData = JSON.parse(localStorage["login_data"]);
        if (loginData.hasQueue == false) return createNewQueue();
        window.location.pathname = `/queue/${loginData._id}`
    } catch (e) {
        console.error(e);
        return showNotificationPanel("times", "Log-in to do this!")
    }
}

function setNavbarToSigned() {
    let loginData = window.localStorage["login_data"]

    if (loginData != "undefined" | undefined | "") {
        loginData = JSON.parse(loginData);
        document.querySelectorAll("#loading-nav-warn").forEach(element => {
            element.remove()
        })
        document.querySelectorAll("#nav-profile-icon").forEach(element => {
            element.style.backgroundImage = `url(https://a.ppy.sh/${loginData._id})`;
        })
        document.querySelectorAll("#nav-panel-banner").forEach(element => {
            element.style.backgroundImage = `url(${loginData.banner})`
        })
        document.querySelectorAll("#nav-profile-icon").forEach(element => {
            element.style.display = "inline-block";
        })
        document.querySelectorAll("#nav-notifications-button").forEach(element => {
            element.style.display = "block";
        })

        if (loginData.hasQueue == "false") {
            document.querySelectorAll(".menu-queue-action").forEach(e => {
                e.innerText = "Create queue";
            })
        }
    }
}

function setNavbarToGuest() {
    document.querySelectorAll("#loading-nav-warn").forEach(element => {
        element.remove()
    })
    document.querySelectorAll("#nav-login-button").forEach(element => {
        element.style.display = "block";
    })
}