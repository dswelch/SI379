// Write your code here
const bodyElem = document.querySelector("body");
getRandomDogImageURL((url) => {
    const image = document.createElement("img");
    image.setAttribute("src", url);
    bodyElem.append(image);
});