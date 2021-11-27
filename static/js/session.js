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
            })
        }).then(r => {
            return r.json()
        }).then((d) => {
            console.log(d)
            localStorage["login_data"] = JSON.stringify(d["user"]);
        }).catch(e => {
            console.error(e)
            return logout()
        })
    }
}

function startLoginProcess() {
    let login = window.open("https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=http://localhost:3000/validateme&client_id=9750&scope=public", "Login", "width=600,height=600,left=150,top=200,toolbar=0,status=0");

    setInterval(() => {
        if (login.closed == true) {
            window.location.reload()
        }
    }, 50)
}

function logout() {
    localStorage["login_data"] = undefined;
    window.location.pathname = "/"
}

createSession()