function removeSelector(element) {
    element.style.opacity = "0"
    element.style.width = "0px";
    element.style.height = "0px";
    element.style.margin = "125px 120px";
    setTimeout(() => {
        element.style.margin = "0px";
        setTimeout(() => {
            element.remove()
        }, 420)
    }, 240)
}