const imgList = document.querySelector("div#thumbnails");
let eventList;
// get initial event list
getUMEvents((list) => {
    console.log(list);
    eventList = list;
});
console.log(eventList);
// getting the first index, don't know where it will be
let currentIndex = -1;
function getInitialIndex(){
    const selectedEvent = document.querySelector("#selected");
    for (let i = 0; i < eventList.length; i++) {
        // assuming that titles are unique to events
        if (selectedEvent.event_title === eventList[i].event_title){
            currentIndex = i;
        }
    }
}
// make sure we found something
if (currentIndex === -1) {
    console.log("didn't find initial selected event");
}

// setSelectedIndex((i+1)%events.length);
function setSelectedIndex(){

};

// TODO need to make moveSelected function, copy lecture-09 for timeout clearing
const timeout = setTimeout(moveSelected, 10000);