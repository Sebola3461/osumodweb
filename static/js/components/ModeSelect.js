class ModeSelect extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" })
        this.callback = this.getAttribute("callback")
        this.modes = ["osu!", "osu!taiko", "osu!catch", "osu!mania"];
        this.default = this.getAttribute("default");
        this.parent = document.createElement("div");
        this.parent.className = "osu-select-mode";

        for (let i = 0; i < 4; i++) {
            let option = document.createElement("div");
            option.className = "option";
            option.innerText = this.modes[i];
            option.setAttribute("onclick", `${this.callback}(${i})`)
            option.addEventListener("click", () => {
                this.changeOption(i)
            })
            this.parent.appendChild(option)
        }

        this.css = document.createElement("style")
        this.css.innerHTML = `div.osu-select-mode {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: center;
            align-items: center;
        }
        
        div.osu-select-mode .option {
            margin-left: 10px;
            margin-right: 10px;
            text-shadow: 0 1px 3px rgb(0 0 0 / 75%);
            color: hsl(var(--hsl-h1));
            transition: color 80ms linear;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        
        div.osu-select-mode .option[selected="true"] {
            color: white;
        }`;

        if (this.default != undefined) {
            this.parent.children[this.default].setAttribute("selected", "true");
        } else {
            this.parent.children[0].setAttribute("selected", "true");
        }

        this.shadow.appendChild(this.css);
        this.shadow.appendChild(this.parent);
    }

    changeOption(index) {
        let options = this.parent.children;
        for (let i = 0; i < options.length; i++) {
            options[i].setAttribute("selected", "false");
        }
        options[index].setAttribute("selected", "true")
    }
}

customElements.define("mode-select", ModeSelect)