const websiteSections = ["service-providers", "production", "pitches", "info"];
const videoSections = 5;
const allVideos = document.querySelectorAll("#videos video");
const allOverflowVideos = document.querySelectorAll("#overflow-videos video");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
let curVideo = null;
let activeLink = null;

function hideVideo(videoName) {
    const video = document.getElementsByClassName(videoName);
    if (video[0] && video[0].classList.contains("active")) {
        video[0].classList.remove("active");
        video[1].classList.remove("active");
        video[0].pause();
        video[1].pause();
    }
}

function startVideo(videoName) {
    const video = document.getElementsByClassName(videoName);
    if (video[0] && !video[0].classList.contains("active")) {
        video[0].classList.add("active");
        video[1].classList.add("active");
        video[0].play();
        video[1].play();
    }
    curVideo = videoName;
}

for (let i = 0; i < websiteSections.length; i++) {
    for (let j = 1; j < videoSections + 1; j++) {
        const category = websiteSections[i];
        const videoName = category + "-" + j;
        const videoArea = document.getElementById(videoName);
        const video = videoName + "-video";
        videoArea.addEventListener('mouseenter', () => {
            const hoverLink = document.getElementById(category + "-link");
            if ( hoverLink != activeLink ) {
                if (activeLink) {
                    activeLink.classList.remove('active-link');
                }
                hoverLink.classList.add('active-link');
                activeLink = document.getElementById(category + "-link");
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
        activeLink.classList.remove('active-link');
        activeLink = null;
    }
    hideVideo(curVideo);
    curVideo = null;
});

header.addEventListener('mouseenter', () => {
    if (activeLink) {
        activeLink.classList.remove('active-link');
        activeLink = null;
    }
    hideVideo(curVideo);
    curVideo = null;
});

const videoCredits = document.querySelector('#video-credits');
const indexLink = document.querySelector('#footer p');
videoCredits.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) {
        indexLink.style.opacity = 1;
    } else {
        indexLink.style.opacity = 0;
    }
});

videoCredits.addEventListener('mouseleave', () => {
    indexLink.style.opacity = 1;
});