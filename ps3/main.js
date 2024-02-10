const imgListDiv = document.querySelector("div#thumbnails");
// initial event list
const eventList = [];
// index of event currently selected
let currentIndex = 0;
// timeout in milliseconds
const TIMEOUT_LENGTH = 3000

function getEventList(list){
    for (let i = 0; i < list.length; i++) {
        eventList.push(list[i]);
        const curImg = document.createElement("img");
        curImg.setAttribute("id", `index${i}`);
        curImg.setAttribute("src", list[i].styled_images.event_thumb);
        imgListDiv.append(curImg);
    }
    // set first event to be selected
    selectEvent(0);
}

function moveSelected(desiredIndex){
    // clear the timeout
    clearTimeout(moveTimeout);
    // select new event
    selectEvent(desiredIndex);

    // move currentIndex 
    currentIndex = (desiredIndex)%eventList.length;

    // set the timeout
    moveTimeout = setTimeout(function(){
        moveSelected(currentIndex+1);
    }, TIMEOUT_LENGTH);
}

function selectEvent(index){
    console.log(currentIndex);
    // deselect current thumbnail
    const curThumbnail = document.querySelector(`#index${currentIndex}`);
    curThumbnail.classList.remove("selected");

    // select thumbnail
    const nextThumbnail = document.querySelector(`#index${index}`);
    nextThumbnail.classList.add("selected");

    const event = eventList[index];
    // create new selected element
    const selected = document.querySelector("#selected");
    // image
    const image = document.querySelector("#selected-image");
    image.setAttribute("src", event.image_url);
    // title
    const title = document.querySelector("#selected-title");
    title.innerText = event.event_title;
    title.setAttribute("href", event.permalink);
    // date
    const date = document.querySelector("#selected-date");
    date.innerText = getReadableTime(event.datetime_start);
    // description
    const description = document.querySelector("#selected-description");
    description.innerText = event.description;

    document.body.append(selected);
}

// gets event list and loads imgListDiv with the event images
getUMEventsWithImages(getEventList);

// set the timeout
let moveTimeout = setTimeout(function(){
    moveSelected(currentIndex+1);
}, TIMEOUT_LENGTH);
