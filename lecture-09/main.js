const box = document.querySelector("#box");
function toggleColor() {
    clearTimeout(colorTimeout);
    if(box.classList.contains("red")) {
        box.classList.remove("red");
        box.classList.add("blue");
    } else {
        box.classList.remove("blue");
        box.classList.add("red");
    }
    colorTimeout = setTimeout(toggleColor, 3000);
}
box.addEventListener("click", toggleColor);

let colorTimeout = setTimeout(toggleColor, 3000);
toggleColor();