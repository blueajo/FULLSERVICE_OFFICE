const websiteSections = ["workers", "production", "pitches", "info"];
const videoSections = 5;
const allVideos = document.querySelectorAll("video");
const header = document.getElementsByClassName("header")[0];
const footer = document.getElementsByClassName("footer")[0];
let curVideo = null;
let activeLink = null;

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

const linkAreas = [["workers", document.getElementById('workersLink')],
                   ["production", document.getElementById('productionLink')],
                   ["pitches", document.getElementById('pitchesLink')],
                   ["info", document.getElementById('infoLink')]];

for (let i = 0; i < websiteSections.length; i++) {
    for (let j = 1; j < videoSections + 1; j++) {
        const videoName = websiteSections[i] + j;
        const videoArea = document.getElementById(videoName);
        const video = document.getElementById(videoName + "Video");
        videoArea.addEventListener('mouseenter', () => {
            const category = videoArea.classList[1]; // this is hacky
            const hoverLink = document.getElementById(category + "Link");
            if ( hoverLink != activeLink ) {
                if (activeLink) {
                    activeLink.classList.remove('activeLink');
                }
                hoverLink.classList.add('activeLink');
                activeLink = document.getElementById(category + "Link");
            }
            hideVideo(curVideo);
            // show new video
            startVideo(video);
        });

        videoArea.addEventListener('click', () => {
            activeLink.click();
        });
    }
}

footer.addEventListener('mouseenter', () => {
    if (activeLink) {
        activeLink.classList.remove('activeLink');
        activeLink = null;
    }
    hideVideo(curVideo);
    curVideo = null;
});

header.addEventListener('mouseenter', () => {
    if (activeLink) {
        activeLink.classList.remove('activeLink');
        activeLink = null;
    }
    hideVideo(curVideo);
    curVideo = null;
});