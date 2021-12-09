sessionStorage["queue-sort-mode"] = "date";
sessionStorage["queue-listing-mode"] = "any";

function listQueues() {
    let filters = JSON.parse(localStorage["search"]);

    let search = new URL(`${window.location.origin}/api/listing`);

    Object.keys(filters).forEach(key => search.searchParams.append(key, filters[key]));

    console.log(search)

    document.getElementById("queues-listing").style.filter = "brightness(0.5) blur(1px);";

    fetch(search.href).then(r => {
        return r.json()
    }).then(queues => {
        document.getElementById("queues-listing").innerHTML = "";
        document.getElementById("queues-listing").style.filter = "";
        if (queues.length < 1) return showNotFoundQueuesWarn();
        queues.forEach(q => {
            document.getElementById("queues-listing").appendChild(new QueueSelector(q).parent)
        })
    })
}

function validateSearchFilters() {
    let filters = localStorage["search"];
    if (filters == undefined || "undefined") {
        return localStorage["search"] = JSON.stringify({ modes: "any", isBn: "any", open: "any", languages: "any", genres: "any", name: "" })
    } else {
        return void {};
    }
}

function syncSearchInptus() {
    let filters = JSON.parse(localStorage["search"]);
    Object.keys(filters).forEach(filter => {
        console.log(filter)
        try {
            let el = document.getElementById(`filter-${filter}-select`);
            el.value = filters[filter];
        } catch (e) {
            console.log(e)
        }
    })
}

function updateSearchOption(option, value) {
    let options = JSON.parse(localStorage["search"]);
    options[option] = value;
    localStorage["search"] = JSON.stringify(options);
    listQueues()
}

async function showNotFoundQueuesWarn() {
    let cat = await fetch("https://aws.random.cat/meow")
    cat = await cat.json()
    cat = cat["file"];

    document.querySelector(".block-listing").style.filter = ""


    document.querySelector(".block-listing").innerHTML = `<div class="not-found-queues">
    <p>Nothing found. But don't be sad, check out this kitten :)</p>
    <div class="image" style="background-image: url('${cat}');"></div>
    </div>`;
}

async function showNotFoundRequestsWarn() {
    let cat = await fetch("https://aws.random.cat/meow")
    cat = await cat.json()
    cat = cat["file"];

    document.querySelector(".block-listing").style.filter = ""


    document.querySelector(".block-listing").innerHTML = `<div class="not-found-queues">
    <p>Nothing here. Only this cat</p>
    <div class="image" style="background-image: url('${cat}');"></div>
    </div>`;
}

function listUserBeatmaps() {
    let loginData = JSON.parse(localStorage["login_data"]);

    fetch(`/api/beatmaps/${loginData["_id"]}?token=${loginData["account_token"]}`).then(r => {
        return r.json();
    }).then(beatmaps => {
        sessionStorage["user-beatmaps-cache"] = JSON.stringify(beatmaps);
        document.querySelector("#overlay-loading-warn").remove()

        beatmaps.forEach(b => {
            let el = new StaticBeatmapSelector(b);
            document.getElementById("beatmaps-listing").insertAdjacentHTML("beforeend", el.html)
        });
    }).catch(e => {
        console.log(e)
    })
}

function listQueueRequests() {
    let queue_id = window.location.pathname.split("/").pop();

    document.getElementById("requests-listing").style.filter = "brightness(0.5) opacity(0.45)";
    document.body.style.cursor = "progress";

    fetch(`/api/queue/${queue_id}`).then(r => {
        return r.json()
    }).then(queue => {
        if (queue.requests.length < 1) return showNotFoundRequestsWarn();
        document.getElementById("requests-listing").innerHTML = "";
        queue.requests.forEach(r => {
            let el = new RequestSelector(r)
            document.getElementById("requests-listing").insertAdjacentHTML("beforeend", el.html)
            el.prepareEvents(document.getElementById("requests-listing").children[document.getElementById("requests-listing").children.length - 1])
        })
        document.getElementById("requests-listing").style.filter = "none";
        document.body.style.cursor = "";
    })
}

function filterQueueRequests(pending) {
    let queue_id = window.location.pathname.split("/").pop();
    sessionStorage["queue-listing-pending"] = pending;

    document.getElementById("requests-listing").style.filter = "brightness(0.5) opacity(0.45)";
    document.body.style.cursor = "progress";

    fetch(`/api/queue/${queue_id}`).then(r => {
        return r.json()
    }).then(queue => {
        let reqs;

        if (pending == "true" || pending == true) {
            reqs = queue.requests.filter(r => r.status != "rejected").filter(r => r.status != "finished")
        } else {
            reqs = queue.requests.filter(r => r.status != "accepted").filter(r => r.status != "pending")
        }

        if (reqs.length < 1) {
            document.body.style = "";
            return showNotFoundRequestsWarn();
        }

        if (sessionStorage["queue-sort-mode"] == "date") {
            reqs.sort((a, b) => { return new Date(b.date) - new Date(a.date) })
        }

        if (sessionStorage["queue-sort-mode"] == "artist") {
            reqs.sort(function(a, b) {
                if (a.artist < b.artist) {
                    return -1;
                }
                if (a.artist > b.artist) {
                    return 1;
                }
                return 0;
            })
        }

        if (sessionStorage["queue-sort-mode"] == "title") {
            reqs.sort(function(a, b) {
                if (a.beatmap.title.toUpperCase() < b.beatmap.title.toUpperCase()) {
                    return -1;
                }
                if (a.beatmap.title.toUpperCase() > b.beatmap.title.toUpperCase()) {
                    return 1;
                }
                return 0;
            })
        }

        document.getElementById("requests-listing").innerHTML = "";

        reqs.forEach(r => {
            if (sessionStorage["queue-listing-mode"] != "any") {
                if (r.beatmap.beatmaps.filter(b => b.mode == sessionStorage["queue-listing-mode"]).length < 1) return;
            }

            let el = new RequestSelector(r)
            document.getElementById("requests-listing").insertAdjacentHTML("beforeend", el.html)
            el.prepareEvents(document.getElementById("requests-listing").children[document.getElementById("requests-listing").children.length - 1])
        })

        if (document.getElementById("requests-listing").children.length < 1) return showNotFoundRequestsWarn();

        document.getElementById("requests-listing").style.filter = "none";
        document.body.style.cursor = "";
    })
}

function changeQueueRequestsSort(mode) {
    sessionStorage.setItem("queue-sort-mode", mode);
    filterQueueRequests(sessionStorage["queue-listing-pending"])
}

function changeQueueRequestsMode(mode) {
    sessionStorage.setItem("queue-listing-mode", mode);
    filterQueueRequests(sessionStorage["queue-listing-pending"])
}

try {
    validateSearchFilters();
} catch (e) {
    console.log(e)
}
try {
    syncSearchInptus();
} catch (e) {
    console.log(e)
}
try {
    listQueues()
} catch (e) {
    console.log(e)
}