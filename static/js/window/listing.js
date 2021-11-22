sessionStorage["listing"] = JSON.stringify({
    mode: 0,
    isBn: false,
    genres: "any",
    languages: "any",
    open: "any",
    username: ""
})


function listQueues() {
    let listing = JSON.parse(sessionStorage["listing"])

    fetch(`/api/listing?isBn=${listing.isBn}&modes=${listing.mode}&languages=${listing.languages}&genres=${listing.genres}&open=${listing.open}`).then(r => {
        return r.json();
    }).then((queues) => {
        document.getElementById("queues-listing").innerHTML = "";

        if (queues.length < 1) {
            updateLoadingBar(0)
            return document.getElementById("queues-listing").innerHTML = `<div class="not-found-results">
            <img src="https://osu.ppy.sh/images/layout/beatmaps/not-found.png">
            <p>... nope, nothing found.</p>
        </div>`
        }

        queues.forEach(queue => {
            document.getElementById("queues-listing").appendChild(new QueueSelector(queue).parent)
        })
    }).catch(e => {
        console.error(e)
    })
}

function changeListingMode(mode) {
    let listing = JSON.parse(sessionStorage["listing"])
    sessionStorage["listing"] = JSON.stringify({
        mode: mode,
        isBn: listing.isBn,
        username: listing.username,
        genres: listing.genres,
        languages: listing.languages,
        open: listing.open,
    })

    listQueues()
}

function changeListingBn(bn) {
    let listing = JSON.parse(sessionStorage["listing"])
    sessionStorage["listing"] = JSON.stringify({
        mode: listing.mode,
        isBn: bn,
        username: listing.username,
        genres: listing.genres,
        languages: listing.languages,
        open: listing.open,
    })

    listQueues()
}

function changeListingLanguage(language) {
    let listing = JSON.parse(sessionStorage["listing"])
    sessionStorage["listing"] = JSON.stringify({
        mode: listing.mode,
        isBn: listing.isBn,
        username: listing.username,
        genres: listing.genres,
        languages: language,
        open: listing.open,
    })

    listQueues()
}

function changeListingGenre(genre) {
    let listing = JSON.parse(sessionStorage["listing"])
    sessionStorage["listing"] = JSON.stringify({
        mode: listing.mode,
        isBn: listing.isBn,
        username: listing.username,
        genres: genre,
        languages: listing.languages,
        open: listing.open,
    })

    listQueues()
}

function changeListingStatus(status) {
    let listing = JSON.parse(sessionStorage["listing"])
    sessionStorage["listing"] = JSON.stringify({
        mode: listing.mode,
        isBn: listing.isBn,
        username: listing.username,
        genres: listing.genres,
        languages: listing.languages,
        open: status,
    })

    listQueues()
}

function searchQueues() {
    updateLoadingBar(40)
    let listing = JSON.parse(sessionStorage["listing"]);
    let username = document.getElementById("queue-username-search").value.trimStart().trimEnd();
    if (username == "") {
        updateLoadingBar(0)
        return listQueues()
    }

    sessionStorage["listing"] = JSON.stringify({
        mode: listing.mode,
        isBn: listing.isBn,
        username: username,
        genres: listing.genres,
        languages: listing.languages,
        open: listing.open,
    })

    listing = JSON.parse(sessionStorage["listing"]);

    updateLoadingBar(80);

    fetch(`/api/search?username=${listing.username}&mode=${listing.mode}&isBn=${listing.isBn}&languages=${listing.languages}&genres=${listing.genres}`).then(r => {
        return r.json();
    }).then(queues => {
        document.getElementById("queues-listing").innerHTML = "";

        if (queues.length < 1) {
            updateLoadingBar(0)
            return document.getElementById("queues-listing").innerHTML = `<div class="not-found-results">
            <img src="https://osu.ppy.sh/images/layout/beatmaps/not-found.png">
            <p>... nope, nothing found.</p>
        </div>`
        }

        queues.forEach(queue => {
            document.getElementById("queues-listing").appendChild(new QueueSelector(queue).parent)
        })
        updateLoadingBar(100)
    }).catch(e => {
        updateLoadingBar(0)
        return window.alert(e)
    })
}

function setupQueueListing(queue) {
    sessionStorage["queue_listing"] = JSON.stringify({
        mode: queue["modes"][0],
        genres: "any",
        languages: "any",
        status: "any",
        search: ""
    })
}

function listRequests() {
    let listing = JSON.parse(sessionStorage["queue_listing"]);

    fetch(`/api/queues/requests?search=${listing.creator}&genres=${listing.genres}&languages=${listing.languages}&modes=${listing.modes}&status=${listing.status}`).then(r => {
        return r.json()
    }).then(reqs => {
        console.log(reqs)
    })
}