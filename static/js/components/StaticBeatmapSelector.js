class StaticBeatmapSelector {
    constructor(beatmap) {
        this.map = beatmap;
        this.html = `<div class="beatmap-selector" onclick="selectBeatmapToRequest(${this.map.id})" style="background-image: url(${beatmap.covers["cover@2x"]})" map-id="${this.map.id}">
        <div class="metadata">
            <p class="title" hoverable="true" hover-text="${beatmap.title}">${beatmap.title}</p>
            <p class="artist">by ${beatmap.artist}</p>
            <div class="modes">
                ${this.getSpread()}
            </div>
        </div>
    </div>`;
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
            staticDiff = staticDiff + `<jsvg-icon color="${getDifficultySpectrum(difficulties.pop().difficulty_rating)}" w="15" h="15" icon="mode-${mode}"></jsvg-icon>`;

            return staticDiff;
        }

        return diffs;
    }

}