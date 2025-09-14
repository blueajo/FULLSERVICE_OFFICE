const websiteSections = ["workers", "production", "pitches", "info"];
const videoSections = 5;
const allVideos = document.querySelectorAll("video");
const header = document.getElementsByClassName("header")[0];
const footer = document.getElementsByClassName("footer")[0];
let curVideo = null;

function hideVideo(video) {
    if (video && video.classList.contains("active")) { 
        video.classList.remove("active");
        video.pause();
        if (curVideo) {
            curVideo.pause();
        }
    }
}

function startVideo(video) {
    if (video && !video.classList.contains("active")) { 
        video.classList.add("active");
        video.play();
        curVideo = video;
    }
}

for (let i = 0; i < websiteSections.length; i++) {
    for (let j = 1; j < videoSections + 1; j++) {
        const videoName = websiteSections[i] + j;
        console.log(videoName);
        const videoArea = document.getElementById(videoName);
        const video = document.getElementById(videoName + "Video");
        videoArea.addEventListener('mouseenter', () => {
            hideVideo(curVideo);
            // show new video
            startVideo(video);
        });
    }
}

footer.addEventListener('mouseenter', () => {
    hideVideo(curVideo);
    curVideo = null;
});

header.addEventListener('mouseenter', () => {
    hideVideo(curVideo);
    curVideo = null;
});