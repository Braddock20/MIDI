const video = document.getElementById('video');
let hls = null;

export function play(ch) {
    const url = ch.url;

    // 1. Destroy previous HLS instance to prevent memory leaks
    if (hls) {
        hls.destroy();
    }

    // 2. Check if the browser supports HLS.js
    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => console.error("Autoplay blocked:", e));
        });
        
        // Error handling for dead links
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("Stream failed:", data.type);
            }
        });

    } 
    // 3. Fallback for Safari (which supports HLS natively)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    } else {
        alert("Your browser does not support HLS streaming.");
    }
}

export function fullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
    }
}
 
