const submitButton = document.querySelector("button");
const ulElem = document.querySelector("ul");
const inp = document.querySelector("input");
function onSubmit() {
    const inputValue = inp.value;
    if(inputValue.length > 0) {
        const liElem = document.createElement("li");
        ulElem.append(liElem);
        for (const letter of inputValue) {
            const spanElem = document.createElement("span");
            spanElem.classList.add("letter");
            spanElem.textContent = letter;
            liElem.append(spanElem);
        }
        inp.value = "";
    }
}
submitButton.addEventListener("click", (onSubmit));
inp.addEventListener("keydown", (event) => {
    if(event.key == "Enter"){
        onSubmit();
    }
});