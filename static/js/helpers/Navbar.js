function toggleNavbarMenu() {
    let x = document.querySelector(".navbar-mobile .vertical");
    if (x.style.display === "none" || "") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}