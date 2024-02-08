function getRandomDogImageURL(callback) {
    fetch('https://random.dog/woof.json')
        .then(response => response.json())
        .then(data => {
            // Check if the URL ends with '.mp4'
            if (data.url.endsWith('.mp4')) {
                console.log('MP4 found, trying again...');
                // If it is an MP4, call the function again
                getRandomDogImageURL(callback);
            } else {
                // If it's not an MP4, pass the URL to the callback
                callback(data.url);
            }
        })
        .catch(error => console.error('Error fetching data: ', error));
}
