function toggleMenu() {
    let menu = document.getElementById("profile-menu");

    if (menu.getAttribute("active") == "false") {
        document.getElementById("profile-pic").style.border = "3px solid white"
        return menu.setAttribute("active", "true")
    }

    if (menu.getAttribute("active") == "true") {
        document.getElementById("profile-pic").style.border = "3px solid transparent"
        return menu.setAttribute("active", "false")
    }
}