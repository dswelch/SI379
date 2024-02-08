const list = document.querySelector("ul#todo-list");
const inp = document.querySelector("input#todo-input");
const button = document.querySelector("button");

function onSubmit() {
    const inputValue = inp.value;
    inp.value = "";
    if(inputValue.length > 0) {
        const liElem = document.createElement("li");
        list.append(liElem);
        liElem.innerText = inputValue;
        const doneButton = document.createElement("button");
        doneButton.classList.add("done");
        doneButton.innerText = "Done";
        doneButton.addEventListener("click", () => {
            liElem.classList.toggle("done");
        });
        liElem.append(doneButton);
    }
}
button.addEventListener("click", (onSubmit));
inp.addEventListener("keydown", (event) => {
    if(event.key == "Enter"){
        onSubmit();
    }
});