class OsuSelect extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.parent = document.createElement("div")
        this.parent.className = "osuselect";
        this.callback = this.getAttribute("callback")
        this.default = this.getAttribute("default");
        this.default ? this.default = new Number(this.default).valueOf() : undefined

        for (let i = 0; i < this.children.length; i++) {
            let option = this.children[i]
            let optionDiv = document.createElement("div");
            let optionP = document.createElement("p")
            optionDiv.classList = "select-option";
            optionP.innerText = option.textContent;
            optionDiv.setAttribute("onclick", `${this.callback}(${option.getAttribute("value")})`)
            optionDiv.addEventListener("click", () => {
                this.changeSelect(i)
            });
            if (this.default != undefined) {
                if (i == this.default) {
                    optionDiv.setAttribute("selected", "true")
                }
            }
            optionDiv.appendChild(optionP)
            this.parent.appendChild(optionDiv)
        }

        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "OPTION") {
                this.children[i].remove()
            }
        }

        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `div.osuselect {
            width: max-content;
            height: 46px;
            min-height: 46px;
            border-bottom: 1px solid hsl(var(--hsl-h1));
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            align-items: center;
            justify-content: space-around;
        }
        
        div.osuselect .select-option {
            width: max-content;
            height: max-content;
            margin-right: 10px;
            color: hsl(var(--hsl-l2))
        }
        
        div.osuselect .select-option[selected="true"] {
            color: #ffffff;
        }
        
        div.osuselect div:last-of-type {
            margin-right: 0;
        }
        
        div.osuselect .select-option p {
            line-height: 46px;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }
        
        div.osuselect .select-option:hover p::before {
            opacity: 1;
        }
        
        div.osuselect .select-option[selected="true"] p::before {
            opacity: 1;
        }
        
        div.osuselect .select-option p {
            font-size: 14px;
            font-weight: 600;
        }
        
        div.osuselect .select-option p::before {
            content: "";
            width: 100%;
            height: 5px;
            border-radius: 4px;
            position: relative;
            bottom: -46px;
            background: hsl(var(--hsl-h1));
            opacity: 0;
            transition: opacity 40ms linear;
        }`;
        this.shadow.append(this.styleElement)
        this.shadow.append(this.parent)

    }

    changeSelect(index) {
        let options = this.parent.children;

        for (let i = 0; i < options.length; i++) {
            options[i].setAttribute("selected", "false")
        }

        this.parent.children[index].setAttribute("selected", "true");
    }
}

customElements.define("osu-select", OsuSelect)