function createQueue() {
    updateLoadingBar(30)
    let loginData = localStorage["login_data"];
    if (loginData == undefined) {
        updateLoadingBar(0)
        window.alert("You need to log-in to create a queue!")
        return;
    }
    loginData = JSON.parse(loginData);

    if (loginData.hasQueue == true) {
        updateLoadingBar(0)
        window.alert("You already have a queue!");
        return;
    }

    let data = {
        user_id: loginData._id,
        maxpending: document.getElementById("maxpending").value,
        cooldown: document.getElementById("cooldown").value,
        color: document.getElementById("huerotate").value,
        modes: getModes(),
        m4m: document.getElementById("acceptm4m").checked,
        rules: document.getElementById("queuerules").value
    }

    function getModes() {
        updateLoadingBar(60)
        let _r = [];
        let checks = document.querySelectorAll(".createqueue-mode-check");

        checks.forEach(ch => {
            if (ch.checked == true) {
                _r.push(ch.getAttribute("mode"))
            }
        })

        console.log(_r)

        return _r;
    }

    if (data.modes.length < 1) {
        updateLoadingBar(0)
        window.alert("Select at least one mode for your queue!");
        return;
    }

    data.modes.forEach(mode => {
        if (mode > 3) {
            updateLoadingBar(0)
            window.alert(`Invalid mode provided: ${mode}`);
            return;
        }
        if (mode < 0) {
            updateLoadingBar(0)
            window.alert(`Invalid mode provided: ${mode}`)
            return;
        }
    })

    if (data.color > 360) {
        updateLoadingBar(0)
        window.alert("Color hue-rotate too big!");
        return;
    }
    if (data.color < 0) {
        updateLoadingBar(0)
        window.alert("Color hue-rotate too low!");
        return;
    }

    if (data.rules.trimStart().trimEnd() == "") {
        updateLoadingBar(0)
        window.alert("Add rules to your queue!");
        return;
    }

    fetch("/api/createqueue", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": loginData.account_token
        },
        body: JSON.stringify({
            data: data
        })
    }).then(r => {
        return r.json()
    }).then(d => {
        updateLoadingBar(100)
        localStorage["queue_data"] = JSON.stringify(d);
        window.location.reload()
    }).catch(e => {
        return window.alert(`Wait, wtf? Error: ${e}`)
    })
}