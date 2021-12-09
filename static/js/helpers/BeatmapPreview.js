function playPreview(beatmap_id) {
    let audio = document.getElementById("preview-audio");
    audio.src = `https://b.ppy.sh/preview/${beatmap_id}.mp3`;
    audio.play();
    audio.volume = document.getElementById("music-volume").value;
    showPanel()
    audio.ontimeupdate = () => {
        document.getElementById("music-position").setAttribute("max", audio.duration)
        updateBar(document.getElementById("music-position"), "Song position")
        document.getElementById("music-position").value = audio.currentTime;
        if (audio.currentTime == "0") return setBar(document.getElementById("music-position"), "Song position", 0)
    }
    audio.onended = () => {
        audio.currentTime = "0";
        setBar(document.getElementById("music-position"), "Song position", 0)
        setTimeout(() => { hidePanel() }, 200)
    }
}

function updateVolume(size) {
    document.getElementById("preview-audio").volume = size;
}

function resumePreview() {
    document.getElementById("music-state-icon").classList = "fa fa-pause";
    document.getElementById("preview-audio").play();
    document.getElementById("music-state").setAttribute("onclick", "pausePreview()")
}

function changePreviewPosition(time) {
    pausePreview()
    document.getElementById("preview-audio").currentTime = time;
    resumePreview()
}

function pausePreview() {
    document.getElementById("music-state-icon").classList = "fa fa-play";
    document.getElementById("preview-audio").pause();
    document.getElementById("music-state").setAttribute("onclick", "resumePreview()")
}

function showPanel() {
    document.querySelector(".music-player").style.bottom = "0";
    document.querySelector(".music-player").style.display = "flex";
    document.querySelector(".music-player").style.opacity = "1"
}

function hidePanel() {
    document.querySelector(".music-player").style.opacity = "0";
    document.querySelector(".music-player").style.bottom = "-50px";
    setTimeout(() => {
        document.querySelector(".music-player").style.display = "none";
    }, 120)
}