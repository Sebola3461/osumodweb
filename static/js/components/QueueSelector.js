class QueueSelector {
    constructor(queue_data) {
        this.queue_data = queue_data;
        this.parent = document.createElement("div");
        this.parent.className = "queue-selector";
        this.status = this.queue_data.open ? "open" : "closed";
        this.type = this.queue_data.isBn ? "nominator" : "modder";
        this.modes = ["osu", "taiko", "catch", "mania"]

        this.parent.innerHTML = `
        <div class="status ${this.status}"></div>
        <div class="pfp-container">
            <div class="image" style="background-image:url('https://a.ppy.sh/${this.queue_data._id}');"></div>
        </div>
        <div class="info">
            <p class="username">${this.queue_data.name}</p>
            <p class="tag modder">${this.type}</p>
            <div class="modes">
                ${this.getModes()}
            </div>
        </div>`;

        this.parent.addEventListener("click", () => {
            window.location.pathname = `/queue/${queue_data._id}`;
        })
    }

    getModes() {
        let icons = [];
        this.queue_data.modes.forEach(mode => {
            let number = new Number(mode).valueOf()
            icons.push(`<mode-icon mode="${this.modes[number]}" color="white" w="14" h="14"></mode-icon>`)
        })
        return icons.join("");
    }
}