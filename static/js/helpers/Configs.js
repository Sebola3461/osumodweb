function fetchConfigs() {
    if (localStorage["login_data"] == "undefined" || undefined) return showNotificationPanel("times", "Log-in to access this page.");

    let loginData = JSON.parse(localStorage["login_data"]);

    fetch(`/api/queue/${loginData._id}`).then(r => {
        return r.json()
    }).then(queue => {
        syncConfigs(queue)
        document.querySelector(".layout-wrapper").style = "--splash-display: none;"
    }).catch(e => {
        console.error(e);
        return showNotificationPanel("times", e.message)
    })
}

function syncConfigs(configs) {
    let languages = ['English', 'Chinese', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Spanish', 'Swedish', 'Russian', 'Polish', 'Instrumental', 'Other'];

    let genres = ['Video Game', 'Anime', 'Rock', 'Pop', 'Other', 'Novelty', 'Hip Hop', 'Electronic', 'Metal', 'Classical', 'Folk', 'Jazz']

    let notificationScopes = ["queue:update", "user:update"]

    let loginData = JSON.parse(localStorage["login_data"])

    if (loginData.hasQueue == true) {
        document.getElementById("queue-open-value").value = configs.open;
        document.getElementById("queue-m4m-value").value = configs.m4m;
        document.getElementById("queue-autoclose-allow-value").value = configs.autoclose.enable;
        document.getElementById("queue-autoclose-size-value").value = configs.autoclose.size;
        document.getElementById("queue-rules-value").value = configs.rules;
        updateRulesLivePreview(configs.rules)

        queueGenres.preselected = [];
        configs.genres.forEach(l => {
            let i = genres.findIndex(i => i == l);
            if (i < 0) return;
            queueGenres.preselected.push(i)
        })
        queueGenres.preselect()
        queueGenres.render()

        queueLanguages.preselected = [];
        configs.languages.forEach(l => {
            let i = languages.findIndex(i => i == l);
            if (i < 0) return;
            queueLanguages.preselected.push(i)
        })
        queueLanguages.preselect()
        queueLanguages.render()

        document.querySelectorAll(".queue-request-mode").forEach(element => {
            element.removeAttribute("checked");
        })

        configs.modes.forEach(m => {
            m = new Number(m).valueOf()
            document.querySelectorAll(".queue-request-mode")[m].checked = "true";
        })

        document.querySelector(".create-queue-overlay").remove()
        document.body.style = "--display-queue-options: block;"
    }

    try {
        queueNotificationScope.preselected = [];
        loginData.push.scopes.forEach(l => {
            let i = notificationScopes.findIndex(i => i == l);
            if (i < 0) return;
            queueNotificationScope.preselected.push(i)
        })
        queueNotificationScope.preselect()
        queueNotificationScope.render()
    } catch (e) {
        document.getElementById("queue-notifications-allow-value").value = "false";
        queueNotificationScope.preselected = [0, 1]
        queueNotificationScope.preselect()
        queueNotificationScope.render()
    }
}

function saveConfigs() {
    let options = {
        open: document.getElementById("queue-open-value").value,
        m4m: document.getElementById("queue-m4m-value").value,
        autoclose: {
            enable: document.getElementById("queue-autoclose-allow-value").value,
            size: Math.abs(document.getElementById("queue-autoclose-size-value").value)
        },
        modes: getSelectedModes(),
        rules: document.getElementById("queue-rules-value").value,
        genres: getGenres(),
        languages: getLanguages()
    }

    function getSelectedModes() {

        let modes = []

        document.querySelectorAll(".queue-request-mode").forEach(option => {
            if (option.checked == true) {
                modes.push(option.getAttribute("value"))
            }
        })

        if (modes.length < 1) return [0]

        return modes;
    }

    function getGenres() {
        let genres = ['Video Game', 'Anime', 'Rock', 'Pop', 'Other', 'Novelty', 'Hip Hop', 'Electronic', 'Metal', 'Classical', 'Folk', 'Jazz']

        let v = []
        queueGenres.selected.filter(o => o.removed == false).forEach(m => {
            v.push(genres[m.index])
        })

        if (v.length < 1) return ["Electronic"]

        return v;
    }

    function getLanguages() {
        let languages = ['English', 'Chinese', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Spanish', 'Swedish', 'Russian', 'Polish', 'Instrumental', 'Other']

        let v = []
        queueLanguages.selected.filter(o => o.removed == false).forEach(m => {
            v.push(languages[m.index])
        })

        if (v.length < 1) return ["English"]

        return v;
    }

    function getNotificationsScopes() {
        let scopes = ['queue:update', 'user:update']

        let v = []
        queueNotificationScope.selected.filter(o => o.removed == false).forEach(m => {
            v.push(scopes[m.index])
        })

        if (v.length < 1) return scopes;

        return v;
    }

    document.querySelector(".save-button").setAttribute("disabled", "true")
    updateUserPushConfig(document.getElementById("queue-notifications-allow-value").value, getNotificationsScopes())
    updateQueueConfigs(options)
}