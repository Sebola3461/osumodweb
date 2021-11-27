class JSVG extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" })
        this.icon = this.getAttribute("icon");
        this.color = this.getAttribute("color");
        this.w = this.getAttribute("w");
        this.h = this.getAttribute("h");
        this.style.color = this.color;
        this.style.width = `${this.w}px`;
        this.style.height = `${this.h}px`;

        fetch(`/static/assets/svg/${this.icon}.svg`).then(r => {
            return r.text()
        }).then((svg) => {
            this.shadow.innerHTML = svg;

            this.shadow.children[0].style.width = `${this.w}px`;
            this.shadow.children[0].style.height = `${this.h}px`;
        })
    }
}

customElements.define("jsvg-icon", JSVG)