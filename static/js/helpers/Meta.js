function updateQueueData() {
    let queue_id = window.location.pathname.split("/").pop();

    fetch(`/api/queue/${queue_id}`).then(r => {
        return r.json()
    }).then(queue_data => {
        document.getElementById("queue-banner").style.backgroundImage = `url(${queue_data.banner})`;
        document.getElementById("queue-avatar").style.backgroundImage = `url(https://a.ppy.sh/${queue_data._id})`;
        document.getElementById("queue-name").innerText = queue_data.name;
        document.getElementById("queue-flag-image").style.backgroundImage = `url(${queue_data.country.flag_url})`;
        let converter = new showdown.Converter()

        document.getElementById("queue-flag-name").innerText = queue_data.country.name;
        document.getElementById("queue-rules-desktop").innerHTML = converter.makeHtml(queue_data.rules);
        document.getElementById("queue-rules-mobile").innerHTML = converter.makeHtml(queue_data.rules);
        document.getElementById("queue-type").classList = queue_data.isBn ? "tag-type nominator" : "tag-type modder";
        document.getElementById("queue-type").innerText = queue_data.isBn ? "bn/nat" : "modder";

        document.getElementById("queue-status").classList = queue_data.open ? "status open" : "status closed";

        document.getElementById("queue-status").innerText = queue_data.open ? "open" : "closed";

        document.getElementById("queue-request-label-title").innerHTML = getName()

        try {
            if (JSON.parse(localStorage["login_data"])._id == queue_id) {
                document.getElementById("queue-buttons").insertAdjacentHTML("afterbegin", `<button onclick="window.location.pathname = '/settings'">Configure</button>`)
            }
        } catch (e) {
            console.error(e)
        }

        let status = ["rejected", "accepted", "finished", "pending"]

        for (let i = 0; i < 4; i++) {
            document.getElementById(`${status[i]}-req-size`).innerText = queue_data.stats[status[i]]
        }

        function getName() {
            if (queue_data.name.endsWith("s")) return `<i class="fa fa-list"></i> ${queue_data.name}' requests`;
            return `<i class="fa fa-list"></i> ${queue_data.name}'s requests`
        }
    }).catch(e => {
        console.error(e)
    })
}

function updateVisualRequest(status, element) {
    element.querySelector(".banner .overlay .status").innerText = status;
    element.querySelector(".banner .overlay .status").classList = `status ${status}`;

    if (sessionStorage["queue-listing-pending"] == "true") {
        if (status != "accepted") {
            return removeSelector(element);
        }
    } else {
        if (status == "accepted") {
            return removeSelector(element);
        }
    }
}

function selectBeatmapToRequest(id) {
    let data = JSON.parse(sessionStorage["user-beatmaps-cache"]).filter(b => b.id == id)[0];
    let queue_id = window.location.pathname.split("/").pop();
    let comment = document.getElementById("request-text").value.trimEnd().trimStart()

    if (comment == "") comment = undefined;

    sessionStorage["request-cache"] = JSON.stringify({
        queue_id: queue_id,
        beatmap_id: id,
        comment: comment
    });

    console.log(sessionStorage)

    document.getElementById("request-banner").style.backgroundImage = `url(${data.covers["cover@2x"]})`
    document.getElementById("request-title").innerText = data.title;
    document.getElementById("request-artist").innerText = data.artist;

    document.getElementById("request-spread").innerHTML = "";

    let diffs = "";
    let modes = {
        osu: 0,
        taiko: 0,
        fruits: 0,
        mania: 0
    }
    let modesList = ["osu", "taiko", "fruits", "mania"]

    modesList.forEach(m => {
        modes[m] = data.beatmaps.filter(d => d.mode == m).length;
    })

    modesList.forEach(mo => {
        if (modes[mo] != 0) {
            diffs = diffs + addDiff(mo, data.beatmaps.filter(d => d.mode == mo))
        }
    })

    function addDiff(mode, diffs) {
        let difficulties = diffs.sort((a, b) => { return a.difficulty_rating - b.difficulty_rating })
        let _d = "";

        difficulties.forEach(df => {
            _d = _d + `<div class="difficulty"><jsvg-icon hoverable="true" hover-text="${df.version} (${df.difficulty_rating} ⭐)" color="${getDifficultySpectrum(df.difficulty_rating)}" w="35" h="35" icon="mode-${mode}"></jsvg-icon></div>`;
        })
        return _d;
    }

    document.getElementById("request-spread").innerHTML = diffs;
}

function allowRequest() {
    document.getElementById("queue-header-request-button").removeAttribute("disabled");
    document.getElementById("queue-header-request-button").innerText = "Request";
}

function updateRequestComment(value) {
    if (sessionStorage["request-cache"] == undefined) return;
    let staticData = JSON.parse(sessionStorage["request-cache"])
    staticData.comment = value.trimStart().trimEnd();
    sessionStorage["request-cache"] = JSON.stringify(staticData)
}

function selectPageArea(element) {
    document.querySelectorAll("div.page-area .option.area").forEach(b => {
        b.setAttribute("active", "false")
    })

    element.setAttribute("active", "true")
}

updateQueueData()