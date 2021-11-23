class StaticBeatmapSelector {
    constructor(beatmap) {
        this.map = beatmap;
        this.html = `<div class="queue-beatmap-container">
        <div class="thumbnail" style="background-image: url('${this.map.covers["cover@2x"]}');">
            <div class="overlay">
                <button class="option play"></button>
            </div>
        </div>
        <div class="metadata" style="background-image: url('${this.map.covers["list@2x"]}');">
            <div class="overlay">
                <p class="song-title">${this.map.title}</p>
                <p class="artist">${this.map.artist}</p>
                <p class="creator">mapped by <span>${this.map.creator}</span></p>
                <div class="spread">
                    ${this.getSpread()}
                </div>
            </div>
        </div>
    </div>`
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
            modes[m] = this.map.beatmaps.filter(d => d.mode == m).length;
        })

        modesList.forEach(mo => {
            if (modes[mo] != 0) {
                diffs = diffs + addDiffMode(mo, this.map.beatmaps.filter(d => d.mode == mo))
            }
        })

        function addDiffMode(mode, diffs) {
            let staticDiff = "";
            let difficulties = diffs.sort((a, b) => { return a.difficulty_rating - b.difficulty_rating });
            staticDiff = staticDiff + `<div class="diff">
                <mode-icon mode="${mode}" w="12" h="12" color="white"></mode-icon>${getDisplayers()}
            </div>`;


            function getDisplayers() {
                let _d = "";

                difficulties.forEach(df => {
                    _d = _d + `<div class="displayer" style="background-color: ${getDifficultySpectrum(df.difficulty_rating)};" aria-label="${df.version} (${df.difficulty_rating} ⭐)" data-balloon-pos="up"></div>`;
                })
                return _d;
            }

            return staticDiff;
        }

        return diffs;
    }

}