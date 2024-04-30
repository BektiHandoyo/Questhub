const menuIcon = document.getElementById("menu-icon");
const nav = document.getElementById("page-nav");

menuIcon.addEventListener('click', () => {
    if(nav.style.display == "none"){
        nav.style.display = "block";
        menuIcon.style.border = "1px solid black"
    } else {
        nav.style.display = "none";
        menuIcon.style.border = "none"
    }
})

const divs = document.querySelectorAll('.nav-item');

divs.forEach(el => el.addEventListener('click', event => {
    nav.style.display = "none";
    menuIcon.style.border = "none";;
}));