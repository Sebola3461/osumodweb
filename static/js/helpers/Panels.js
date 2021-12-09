function showRequestManagerPanel(request) {
    let queueId = window.location.pathname.split("/").pop();

    if (localStorage["login_data"] == undefined) return showNotificationPanel("times", "You can't manage this request, check if you are loged-id!");

    if (localStorage["login_data"] == "undefined") return showNotificationPanel("times", "You can't manage this request, check if you are loged-id!");

    if (localStorage["login_data"] == "") return showNotificationPanel("times", "You can't manage this request, check if you are loged-id!");

    if (JSON.parse(localStorage["login_data"])._id != queueId) return showNotificationPanel("times", "You cannot manage this request because this queue is not yours.");

    document.querySelector("#queue-request-manager-overlay .panel .banner").style.backgroundImage = `url(${request.beatmap.covers["cover@2x"]})`;
    document.querySelector("#queue-request-manager-overlay .panel .banner").style.backgroundImage = `url(${request.beatmap.covers["cover@2x"]})`;
    document.querySelector("#queue-request-manager-overlay .panel .modding-area .nav-data .spread-container .data .option p.bpm").innerText = request.beatmap.bpm;
    document.querySelector("#queue-request-manager-overlay .panel .modding-area .nav-data .spread-container .request-date").innerHTML = `Requested at <span>${moment(new Date(request.date)).calendar()} (${moment(new Date(request.date)).fromNow()})</span>`;
    document.querySelector("#queue-request-manager-overlay .panel .modding-area .nav-data .spread-container .spread").innerHTML = getSpread();
    document.querySelector("#queue-request-manager-overlay .panel .modding-area .nav-data .spread-container .data .option p.duration").innerText = numeral(request.beatmap.beatmaps[0].total_length).format("0:0");
    document.querySelector("#queue-request-manager-overlay .panel .modding-area .mapper-comment").innerText = request.comment;

    document.querySelector("#queue-request-manager-overlay .panel button.rejected").addEventListener("click", async() => {
        await updateBeatmapStatus("reject", request.id, document.querySelector("#queue-request-manager-overlay .panel .modding-area textarea").value)
        hideRequestManagerPanel()
    })

    document.querySelector("#queue-request-manager-overlay .panel button.accepted").addEventListener("click", async() => {
        await updateBeatmapStatus("accept", request.id, document.querySelector("#queue-request-manager-overlay .panel .modding-area textarea").value)
        hideRequestManagerPanel()
    })

    document.querySelector("#queue-request-manager-overlay .panel button.finished").addEventListener("click", async() => {
        await updateBeatmapStatus("finish", request.id, document.querySelector("#queue-request-manager-overlay .panel .modding-area textarea").value)
        hideRequestManagerPanel()
    })


    document.getElementById("queue-request-manager-overlay").style.display = "flex";
    document.getElementById("queue-request-manager-overlay").style.opacity = "1";
    setTimeout(() => {
        document.querySelector("#queue-request-manager-overlay .panel").style.marginTop = "0px";
        document.querySelector("#queue-request-manager-overlay .panel").style.opacity = "1";
    }, 420)

    function getSpread() {
        let diffs = "";
        let modes = {
            osu: 0,
            taiko: 0,
            fruits: 0,
            mania: 0
        }
        let modesList = ["osu", "taiko", "fruits", "mania"]

        modesList.forEach(m => {
            modes[m] = request.beatmap.beatmaps.filter(d => d.mode == m).length;
        })

        modesList.forEach(mo => {
            if (modes[mo] != 0) {
                diffs = diffs + addDiff(mo, request.beatmap.beatmaps.filter(d => d.mode == mo))
            }
        })

        function addDiff(mode, diffs) {
            let difficulties = diffs.sort((a, b) => { return a.difficulty_rating - b.difficulty_rating })
            let _d = "";

            difficulties.forEach(df => {
                _d = _d + `<div class="difficulty"><jsvg-icon hoverable="true" hover-text="${df.version} (${df.difficulty_rating} ⭐)" color="${getDifficultySpectrum(df.difficulty_rating)}" w="25" h="25" icon="mode-${mode}"></jsvg-icon></div>`;
            })
            return _d;
        }

        return diffs;
    }
    return;
}

function hideRequestManagerPanel() {
    document.querySelector("#queue-request-manager-overlay .panel").style.marginTop = "-10vh";
    document.querySelector("#queue-request-manager-overlay .panel").style.opacity = "0";

    setTimeout(() => {
        setTimeout(() => {
            document.querySelector("#queue-request-manager-overlay .panel .modding-area textarea").value = "";
            document.getElementById("queue-request-manager-overlay").style.opacity = "0";
            document.getElementById("queue-request-manager-overlay").style.display = "none";
        }, 420)
    }, 450)
}

async function showGenericWarn(callback) {
    document.getElementById("generic-warn").style.display = "flex";
    document.getElementById("generic-warn").style.opacity = "1";

    setTimeout(() => {
        document.getElementById("generic-warn-panel").style.display = "block";
        document.getElementById("generic-warn-panel").style.marginTop = "0px";
        document.getElementById("generic-warn-panel").style.opacity = "1";
    }, 80)

    document.querySelector("#generic-warn-panel .buttons button.finished").addEventListener("click", async() => {
        removePanel()
        callback()
    })

    document.querySelector("#generic-warn-panel .buttons button.accepted").addEventListener("click", async() => {
        removePanel()
    })

    function removePanel() {
        document.getElementById("generic-warn-panel").style.marginTop = "-10vh";
        document.getElementById("generic-warn-panel").style.opacity = "0";

        setTimeout(() => {
            document.getElementById("generic-warn-panel").style.display = "none";
            document.getElementById("generic-warn").style.opacity = "0";
            document.getElementById("generic-warn").style.display = "none";
        }, 420)
    }
}

let converter = new showdown.Converter()

function updateRulesLivePreview(markdown) {
    document.querySelector(".queue-rules-preview").innerHTML = converter.makeHtml(markdown)
}