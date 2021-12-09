class RequestSelector {
    constructor(request) {
        this.request = request;
        this.html = `<div class="request-selector">
        <div class="banner" style="background-image: url(${this.request.beatmap.covers["cover@2x"]});">
            <div class="overlay">
                <div class="status ${this.request.status}" hoverable="true" hover-text="${this.request.reply ? this.request.reply : "The owner of this queue has not yet responded to this request" }">${this.request.status}</div>
                <div class="buttons">
                    <button class="option" onclick="return playPreview(${this.request.beatmap.id}); event.preventDefault()"><i class="fa fa-play" hoverable="true" hover-text="Play beatmap preview"></i></button>
                    <button class="option" onclick="return window.open('https://osu.ppy.sh/s/${this.request.beatmap.id}'); event.preventDefault()" hoverable="true" hover-text="Go to beatmapset page"><i class="fa fa-external-link-alt"></i></button>
                </div>
            </div>
        </div>
        <div class="spread" onwheel="scrollHorizontally(event)">${this.getSpread()}</div>
        <div class="metadata">
            <p class="title">${this.request.beatmap.title}</p>
            <p class="artist">${this.request.beatmap.artist}</p>
            <p class="creator">mapped by <span onclick="window.open('https://osu.ppy.sh/u/${this.request.owner.id}')" hoverable="true" hover-text="Go to user profile">${this.request.owner.username}</span></p>
            <p class="comment-preview" hoverable="true" hover-text="${this.request.comment}">${this.request.comment}</p>
        </div>
    </div>`
    }

    prepareEvents(element) {
        element.addEventListener("click", (ev) => {
            if (ev.srcElement.tagName == "I" || ev.srcElement.tagName == "BUTTON") return;
            showRequestManagerPanel(this.request)
        })

        new VanillaContextMenu({
            scope: element,
            menuItems: [{
                    label: 'Accept',
                    callback: () => {
                        if (confirm("Are you sure?")) {
                            updateBeatmapStatus("accept", this.request.id, undefined, element)
                        }
                    },
                },
                {
                    label: 'Finish',
                    callback: () => {
                        if (confirm("Are you sure?")) {
                            updateBeatmapStatus("finish", this.request.id, undefined, element)
                        }
                    },
                },
                {
                    label: 'Reject',
                    callback: () => {
                        if (confirm("Are you sure?")) {
                            updateBeatmapStatus("reject", this.request.id, undefined, element)
                        }
                    },
                }
            ],
        });
    }

    getSpread() {
        let diffs = "";
        let modes = {
            osu: 0,
            taiko: 0,
            fruits: 0,
            mania: 0
        }
        let modesList = ["osu", "taiko", "fruits", "mania"]

        modesList.forEach(m => {
            modes[m] = this.request.beatmap.beatmaps.filter(d => d.mode == m).length;
        })

        modesList.forEach(mo => {
            if (modes[mo] != 0) {
                diffs = diffs + addDiff(mo, this.request.beatmap.beatmaps.filter(d => d.mode == mo))
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


}