const video = document.querySelector('.video');
const videoPlayer = document.querySelector('.videoVisible');
const soundControl = document.querySelector('.soundControl');
const barSoundContainer = document.querySelector('.soundBarControls');
const controlsSoundLines = document.querySelectorAll('.soundBarControls li');
const thumbnailsContainer = document.getElementById('thumbnails');
const containThumbNails = document.querySelector('.containThumbNails');
const crossClose = document.querySelector('.containerCross svg path');

videoPlayer.setAttribute('aria-vol', videoPlayer.volume)

const play = document.querySelector('.play');
const pause = document.querySelector('.pause');

videoPlayer.addEventListener('mouseover',()=>{
    videoPlayer.addEventListener('mousemove',(e)=>{
        console.log(videoPlayer.getBoundingClientRect().height)
        if (e.clientY <= videoPlayer.getBoundingClientRect().height/10){
            containThumbNails.style.top = '0';

        }else {
            containThumbNails.style.top = '';

        }


    })
    

})
videoPlayer.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    });
play.addEventListener('click',()=>{
    videoPlayer.play()
    containThumbNails.style.top = '';
})
pause.addEventListener('click',()=>{
    videoPlayer.pause();
    containThumbNails.style.top = '0';
})
crossClose.addEventListener('click',()=>{
    containThumbNails.style.top = '';

})
soundControl.addEventListener('mouseenter',()=>{
    barSoundContainer.style.opacity = 1;
    barSoundContainer.style.transform = "scaleY(1)";
})
soundControl.addEventListener('mouseleave',()=>{
    barSoundContainer.style.opacity = 0;
    barSoundContainer.style.transform = "scaleY(0)";
})
soundControl.children[0].addEventListener('click', (e) => {
    let path = soundControl.children[0].querySelectorAll('path');
    const isMuted = soundControl.getAttribute('muted') === 'true';
    if (isMuted) {
        const storedVolume = videoPlayer.getAttribute('aria-vol');
        videoPlayer.volume = storedVolume !== null ? storedVolume : 1;
        soundControl.setAttribute('muted', 'false');
        path.forEach(e => {
            e.style.fill = "";
            e.style.strokeWidth = "";
            e.style.stroke = "";
        });
        controlsSoundLines.forEach(e => {
            e.style.filter = 'grayscale(0%)';
        });
    } else {
        videoPlayer.volume = 0;
        soundControl.setAttribute('muted', 'true');
        path.forEach(e => {
            e.style.fill = "transparent";
            e.style.strokeWidth = "5px";
            e.style.stroke = "white";
        });
        controlsSoundLines.forEach(e => {
            e.style.filter = 'grayscale(100%)';
        });
    }
});

controlsSoundLines.forEach((e, i) => {
    let index;
    e.style.background = "rgb(255, 85, 0)";
    e.addEventListener('click', () => {
        index = i;
        controlsSoundLines.forEach((element, idx) => {
            if (idx >= i) {
                element.style.background = "rgb(255, 85, 0)";
            } else {
                element.style.background = "";
            }
        })
        let vol;
        if (index != 0) {
            vol = 10 - index;
            const newVolume = Number("0" + '.' + vol);
            videoPlayer.setAttribute('aria-vol', newVolume);
            if (soundControl.getAttribute('muted') !== 'true') {
                videoPlayer.volume = newVolume;
            }
        } else {
            const newVolume = 1;
            videoPlayer.setAttribute('aria-vol', newVolume);
            if (soundControl.getAttribute('muted') !== 'true') {
                videoPlayer.volume = newVolume;
            }
        }
    });
});

let framesOf = [];

window.addEventListener('load',(e)=>{
    
    captureFrames();
    playFrom(1,videoPlayer)
    
    
    
})

function captureFrames() {
    const video = document.querySelector('.video');
    const canvas = document.getElementById('canvasElement');
    const context = canvas.getContext('2d');
    console.log(video.duration/13)
    let captureInterval = Math.floor(video.duration/13);
    // if (Math.floor(video.duration % 2)===1){
    //     captureInterval = 24;
    // }else{
    //     captureInterval = 25;
    // }
     // seconds
    const numFrames = Math.floor((video.duration) / captureInterval);
    // Set reduced resolution for thumbnails
    const thumbnailWidth = 160; // Set desired width
    const thumbnailHeight = 100; // Set desired height
    canvas.width = thumbnailWidth;
    canvas.height = thumbnailHeight;
    video.addEventListener('loadeddata', () => {
        let currentFrame = 1;

        const capture = () => {
            if (currentFrame < numFrames) {
                video.currentTime = currentFrame * captureInterval;

                video.addEventListener('seeked', () => {
                    // Draw the video frame on the canvas with the new resolution
                    context.drawImage(video, 1, 0, canvas.width, canvas.height);
                    const dataURL = canvas.toDataURL('image/png');

                    const img = document.createElement('img');
                    img.setAttribute('aria-time',video.currentTime);
                    img.classList.add('framesOf')
                    img.src = dataURL;
                    thumbnailsContainer.appendChild(img);
                    framesOf.push(img);

                    currentFrame++;
                    capture();
                    framesOf.forEach(e => {
                        e.addEventListener('mouseenter',()=>{
                            e.style.transform = 'scale(1.9) translateY(1rem)'
                            e.style.zIndex = 1

                        })
                        e.addEventListener('mouseout',()=>{
                            e.style.transform = 'scale(1) translateY(0rem)'
                            e.style.zIndex = -1

                        })

                        e.addEventListener('click', () => {
                            console.log(e.getAttribute('aria-time'))
                            if(videoPlayer.paused){
                                playFrom(e.getAttribute('aria-time'), videoPlayer, false);
                            }else{
                                playFrom(e.getAttribute('aria-time'), videoPlayer,true);

                            }
                            containThumbNails.style.top = '';

                        })
                    })
                }, { once: true });
            }
        };

        capture();
    }, { once: true });
    
    video.load();
}
function playFrom(seconds,video,bool) {
    video.currentTime = seconds; // Set the current time
    if(bool === true){
        video.play(); // Start playing the video
    }else{
        video.pause();
    }
}
