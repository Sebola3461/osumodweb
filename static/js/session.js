function createSession() {
    let loginData = window.localStorage["login_data"]

    if (loginData != "undefined" | undefined | "") {
        loginData = JSON.parse(loginData);

        fetch("/api/refresh_token", {
            method: "POST",
            headers: {
                authorization: loginData.account_token,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user_id: loginData._id,
                account_token: loginData.account_token
            })
        }).then(r => {
            return r.json()
        }).then((d) => {
            localStorage["login_data"] = JSON.stringify(d["user"]);
            setNavbarToSigned()

            try {
                allowRequest()
            } catch (e) {
                console.error(e)
            }

            try {
                fetchConfigs()
            } catch (e) {
                console.error(e)
            }
        }).catch(e => {
            console.error(e)
            setNavbarToSigned()

            return logout()
        })
    } else {
        setNavbarToGuest()
    }
}

function startLoginProcess() {
    let login = window.open("https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=http://localhost:3000/validateme&client_id=9750&scope=public", "Login", "width=600,height=600,left=150,top=200,toolbar=0,status=0");

    login.addEventListener("unload", (ev) => {
        if (ev.target.URL.startsWith(window.location.protocol.concat("//").concat(window.location.hostname))) {
            return window.location.reload()
        }
    })
}

function logout() {
    localStorage["login_data"] = undefined;
    window.location.pathname = "/"
}

createSession()