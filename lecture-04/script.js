const box = document.querySelector("#box");

const toggleColor = () => {
    if(box.classList.contains("red")){
        box.classList.remove("red");
        box.classList.add("blue");
    }
    else if(box.classList.contains("blue")){
        box.classList.remove("blue");
        box.classList.add("red");
    }
    else{
        box.classList.add("red");
    }
}

while(true){
    setTimeout(toggleColor, 2000);
}