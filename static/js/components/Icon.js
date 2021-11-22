class Icon extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" })
        this.mode = this.getAttribute("mode");
        this.color = this.getAttribute("color");
        this.w = this.getAttribute("w");
        this.h = this.getAttribute("h");
        this.style.color = this.color;
        this.style.width = `${this.w}px`;
        this.style.height = `${this.h}px`;
        fetch(`/static/assets/svg/mode-${this.mode}.svg`).then(r => {
            return r.text()
        }).then((svg) => {
            this.shadow.innerHTML = svg;
        })
    }
}

customElements.define("mode-icon", Icon)