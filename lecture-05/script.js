const box = document.querySelector("#clickable_elem");

const onClick = () => {
    box.classList.add("clicked");
    setTimeout(() => {
        box.classList.remove("clicked");
    }, 1000);
}

box.addEventListener("click", onClick);