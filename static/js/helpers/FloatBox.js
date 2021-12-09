let box = document.getElementById("float-box");

document.addEventListener("mousemove", (ev) => {
    box = document.getElementById("float-box");

    if (ev.clientY + box.getBoundingClientRect().height <= window.innerHeight) {
        box.style.top = `${ev.clientY + 10}px`;
    } else {
        box.style.top = `${ev.clientY - box.getBoundingClientRect().height}px`;
    }

    if (ev.clientX + box.getBoundingClientRect().width <= document.body.getBoundingClientRect().width - box.getBoundingClientRect().width) {
        box.style.left = `${ev.clientX + 10}px`;
    } else {
        box.style.left = `${ev.clientX - box.getBoundingClientRect().width}px`;
    }

    if (ev.target.getAttribute("hoverable") == "true") {
        showFloatBox(ev.target.getAttribute("hover-text"))
        document.addEventListener("mouseout", (ev) => {
            hideFloatBox()
        })
    }
})

function showFloatBox(text) {
    if (text == "") return;
    box.innerHTML = text;
    box.style.opacity = "1";
}

function hideFloatBox() {
    box.style.opacity = "0";
}