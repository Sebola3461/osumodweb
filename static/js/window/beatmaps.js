function getOwnBeatmaps() {
    let loginData = JSON.parse(localStorage["login_data"]);

    fetch(`/api/beatmaps/${loginData["_id"]}?token=${loginData["account_token"]}`).then(r => {
        return r.json();
    }).then(beatmaps => {
        beatmaps.forEach(b => {
            document.getElementById("request-beatmap-maps").insertAdjacentHTML("beforeend", new StaticBeatmapSelector(b).html)
        });
    }).catch(e => {
        console.log(e)
        window.alert(e)
    })
}