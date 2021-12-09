document.getElementById("filter-name-select").addEventListener("keydown", (ev) => {
    let allowSearch = true;
    if (allowSearch == false) return;

    if (ev.key == "Enter") {
        updateSearchOption("name", ev.target.value)
        allowSearch = false;

        // ? Prevent request spam when hold enter key
        ev.target.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
                allowSearch = true
            }
        })
    }
})

document.getElementById("search-button").addEventListener("click", (ev) => {
    updateSearchOption("name", document.getElementById("filter-name-select").value);
})

function scrollHorizontally(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    e.target.scrollLeft -= (delta);
    e.preventDefault();
    console.log(e)
}

try {
    document.getElementById("request-spread").addEventListener("mouseover", ev => {
        function scrollHorizontally(e) {
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            document.getElementById('request-spread').scrollLeft -= (delta);
            e.preventDefault();
        }
        if (document.getElementById('request-spread').addEventListener) {
            document.getElementById('request-spread').addEventListener('mousewheel', scrollHorizontally, false);
            document.getElementById('request-spread').addEventListener('DOMMouseScroll', scrollHorizontally, false);
        } else {
            document.getElementById('request-spread').attachEvent('onmousewheel', scrollHorizontally);
        }
    })
} catch (e) {
    console.log(e)
}

function toggleCreateRequestOverlay() {
    let x = document.querySelector("#queue-request-modal");
    if (x.style.display === "none" || x.style.display === "") {
        document.getElementById("beatmaps-listing").insertAdjacentHTML("beforeend", `<p id="overlay-loading-warn">loading...</p>`)
        listUserBeatmaps()
        x.style.display = "flex";
        setTimeout(() => {
            x.style.opacity = "1";
            setTimeout(() => {
                document.querySelector("#queue-request-modal .panel").style.opacity = "1"
                document.querySelector("#queue-request-modal .panel").style.marginTop = "0"
            }, 320)
        }, 80)
    } else {
        setTimeout(() => {
            document.querySelector("#queue-request-modal .panel").style.marginTop = "-35vh"
            document.querySelector("#queue-request-modal .panel").style.opacity = "0"
            x.style.opacity = "0";
            setTimeout(() => {
                x.style.display = "none";
            }, 80)
        }, 320)

        try {
            document.querySelector("#overlay-loading-warn").remove()
            document.querySelectorAll(".beatmap-selector").forEach(s => {
                s.remove()
            })
        } catch (e) {
            console.log(e)
        }
    }
}

function updateBar(b, text) {
    let percent = b.value / new Number(b.getAttribute("max")).valueOf() * 100;
    b.setAttribute("hover-text", text.concat(` (${percent}%)`))
    b.style.backgroundImage = `linear-gradient(90deg, #2196f3 ${(percent+2.5).toFixed(2)}%, transparent 0%)`
}

function setBar(b, text, value) {
    let allow = true;
    if (allow == false) return;
    b.setAttribute("hover-text", text.concat(` (${value}%)`))
    b.style.backgroundImage = `linear-gradient(90deg, #2196f3 ${(value).toFixed(2)}%, transparent 0%)`;

    b.addEventListener("focusin", (e) => {
        allow = false;
        b.addEventListener("focusout", () => {
            allow = true;
        })
    })
}