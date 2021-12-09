class QueueSelector {
    constructor(queue_data) {
        this.queue = queue_data;
        this.parent = document.createElement("div");
        this.parent.classList = this.queue.open ? "queue-selector open" : "queue-selector closed";
        if (this.queue._id == "15821708") {
            this.parent.classList = this.parent.classList + " fumo"
        }
        this.banner = document.createElement("div");
        this.banner.className = "banner";
        this.banner.style.backgroundImage = `url('${this.queue.banner}')`;
        this.overlay = document.createElement("div");
        this.overlay.className = "overlay";
        this.status = document.createElement("div")
        this.status.className = "status";
        this.status.style.backgroundColor = `var(--theme-color)`;
        this.status.innerText = this.queue.open ? "open" : "closed";
        this.modes = document.createElement("div");
        this.modes.className = "modes";
        this.getModes();
        this.metadata = document.createElement("div")
        this.metadata.className = "metadata";
        this.left = document.createElement("div")
        this.left.className = "left";
        this.avatar = document.createElement("div");
        this.avatar.className = "avatar";
        this.avatar.style.backgroundImage = `url('https://a.ppy.sh/${this.queue._id}')`
        this.tagType = document.createElement("div");
        this.tagType.classList = this.queue.isBn ? "tag-type nominator" : "tag-type modder";
        this.tagType.innerText = this.queue.isBn ? "bn/nat" : "modder";
        this.title = document.createElement("p")
        this.title.className = "title";
        this.title.innerText = this.queue.name;
        this.parent.addEventListener("click", () => {
            window.location.pathname = `/queue/${this.queue._id}`
        });
        this.metadata.appendChild(this.left)
        this.metadata.appendChild(this.title)
        this.left.appendChild(this.avatar)
        this.left.appendChild(this.tagType)
        this.overlay.appendChild(this.status)
        this.overlay.appendChild(this.modes)
        this.banner.appendChild(this.overlay)
        this.parent.appendChild(this.banner)
        this.parent.appendChild(this.metadata)
    }

    getModes() {
        let modes = ["osu", "taiko", "catch", "mania"]
        this.queue.modes.forEach(mode => {
            mode = new Number(mode).valueOf()
            this.modes.insertAdjacentHTML("beforeend", `<jsvg-icon color="#fff" icon="mode-${modes[mode]}" w="16" h="16"></jsvg-icon>`)
        })
    }
}