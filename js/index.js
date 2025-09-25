const websiteSections = ["workers", "production", "pitches", "info"];
const videoSections = 5;
const allVideos = document.querySelectorAll("#videos video");
const allOverflowVideos = document.querySelectorAll("#overflowVideos video");
const header = document.getElementsByClassName("header")[0];
const footer = document.getElementsByClassName("footer")[0];
let curVideo = null;
let activeLink = null;

function hideVideo(video) {
    if (video && video.classList.contains("active")) {
        const overflowVideo = allOverflowVideos[Array.from(allVideos).indexOf(video)];
        video.classList.remove("active");
        overflowVideo.classList.remove("active");
        video.pause();
        overflowVideo.pause();
        if (curVideo) {
            curVideo.pause();
        }
    }
}

function startVideo(video) {
    if (video && !video.classList.contains("active")) { 
        const overflowVideo = allOverflowVideos[Array.from(allVideos).indexOf(video)];
        video.classList.add("active");
        overflowVideo.classList.add("active");
        video.play();
        overflowVideo.play();
        curVideo = video;
    }
}

for (let i = 0; i < websiteSections.length; i++) {
    for (let j = 1; j < videoSections + 1; j++) {
        const videoName = websiteSections[i] + j;
        const videoArea = document.getElementById(videoName);
        const video = document.getElementById(videoName + "Video");
        videoArea.addEventListener('mouseenter', () => {
            const category = websiteSections[i];
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