function updateSidebarAvatar(user_id) {
    document.getElementById("profile-pic").style.backgroundImage = `url('https://a.ppy.sh/${user_id}')`
}

function updateMenuName(username) {
    document.getElementById("panel-username").innerText = username;
}

function updatePanelToUser() {
    let loginData = JSON.parse(window.localStorage["login_data"])
    updateMenuName(loginData.username);
    updateSidebarAvatar(loginData._id);

    if (loginData.hasQueue == false) {
        document.getElementById("profile-menu").insertAdjacentHTML("beforeend", `<div class="option" onclick="addCreateQueueModal()">create queue</div>
        <div class="option" >your requests</div>
        <div class="option" onclick="logout()">log-out</div>
        `);
    } else {
        document.getElementById("profile-menu").insertAdjacentHTML("beforeend", `<div class="option">your queue</div>
        <div class="option">options</div>
        <div class="option" onclick="logout()">log-out</div>`)
    }
}

function updatePanelToGuest() {
    document.getElementById("profile-menu").insertAdjacentHTML("beforeend", `<div class="option" onclick="startLoginProcess()">login</div>`);
}

const markdown = new showdown.Converter()

function updateQueueRulesPreview(data) {
    document.getElementById("queue-rules-preview").innerHTML = markdown.makeHtml(data)
}

function updatePageColor(rotate) {
    if (!rotate) return;
    document.getElementById("color-rotate-preview").innerHTML = `
        :root {
            --base-hue: ${rotate} !important;
            --base-hue-deg: ${rotate}deg !important;
        }
    `
}

function deleteCreateQueueModal() {
    let prompt = window.confirm("Are you sure?");
    if (prompt == true) {
        document.getElementById("create-queue-overlay").remove()
    }
}

function addCreateQueueModal() {
    let parent = document.createElement("div");
    parent.className = "create-queue-overlay";
    parent.id = "create-queue-overlay";
    parent.innerHTML = `
    <div class="panel">
            <div class="title">
                <div class="wrapper default">
                    <div class="icon settings"></div>
                    <p class="name">create queue</p>
                </div>
            </div>
            <div class="section">
                <div class="left">
                    <p class="title">general</p>
                </div>
                <div class="option">
                    <div class="element input">
                        <section>
                            <p>max pending requests (0 = disabled)</p>
                            <input type="number" id="maxpending" max="60" min="0" value="0" step="1.0">
                        </section>
                        <section>
                            <p>cooldown to request (days)</p>
                            <input type="number" id="cooldown" max="60" min="0" value="0" step="1.0">
                        </section>
                        <section>
                            <p>color hue rotate (360 max)</p>
                            <input type="number" id="huerotate" oninput="updatePageColor(this.value)" max="360" min="0" value="255">
                        </section>
                    </div>
                    <div class="element check">
                        <section>
                            <input type="checkbox" id="acceptm4m" checked="true">
                            <p>allow mod for mod requests</p>
                        </section>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="left">
                    <p class="title">modes</p>
                </div>
                <div class="option">
                    <div class="element check">
                        <section>
                            <input type="checkbox" id="osumode" class="createqueue-mode-check" checked="true" mode="0">
                            <p>osu!</p>
                            <input type="checkbox" id="taikomode" class="createqueue-mode-check" checked="true" mode="1">
                            <p>osu!taiko</p>
                            <input type="checkbox" id="catchmode" class="createqueue-mode-check" checked="true" mode="2">
                            <p>osu!catch</p>
                            <input type="checkbox" id="maniamode" class="createqueue-mode-check" checked="true" mode="3">
                            <p>osu!mania</p>
                        </section>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="left">
                    <p class="title">rules</p>
                </div>
                <div class="option">
                    <div class="element rules">
                        <textarea id="queuerules" placeholder="Type your rules here! You can use markdown." oninput="updateQueueRulesPreview(this.value)"></textarea>
                        <div class="visualize-rules" id="queue-rules-preview"></div>
                        <div class="controls-container">
                            <button class="red-button" onclick="deleteCreateQueueModal()">cancel</button>
                            <button class="green-button" onclick="createQueue()">create</button>
                        </div>
                    </div>
                </div>
            </div>`
    document.body.insertAdjacentElement("beforebegin", parent)
}

document.getElementById("queue-username-search").addEventListener("keydown", (ev) => {
    if (ev.key == "Enter") {
        searchQueues()
    } else {
        if (ev.target.value.trimStart().trimEnd() == "") {
            listQueues()
        }
    }
})

function updateLoadingBar(size) {
    document.getElementById("loading-bar").style.width = `${size}vw`;
    if (size >= 100) setTimeout(() => {
        updateLoadingBar(0)
    }, 80)
}