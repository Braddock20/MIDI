class UltimateEngine {
    constructor(videoElementId, options = {}) {
        this.video = document.getElementById(videoElementId);
        this.options = {
            useProxy: false,
            proxyUrl: "https://api.allorigins.win/raw?url=",
            autoplay: true,
            debug: true,
            ...options
        };
        this.hls = null;
    }

    log(msg) { if (this.options.debug) console.log(`[Engine]: ${msg}`); }

    async load(url) {
        if (!url) return;
        this.log(`Loading: ${url}`);
        
        const finalUrl = this.options.useProxy 
            ? this.options.proxyUrl + encodeURIComponent(url) 
            : url;

        this.destroy();

        if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.playNative(finalUrl, url);
        } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            this.playHls(finalUrl, url);
        } else {
            this.playNative(finalUrl, url);
        }
    }

    playNative(url, originalUrl) {
        this.video.src = url;
        this.video.onloadedmetadata = () => this.video.play().catch(e => this.log("Autoplay blocked"));
        this.video.onerror = () => {
            if (!this.options.useProxy) {
                this.log("Native Error. Trying Proxy...");
                this.options.useProxy = true;
                this.load(originalUrl);
            }
        };
    }

    playHls(url, originalUrl) {
        this.hls = new Hls({ manifestLoadingMaxRetry: 3 });
        this.hls.loadSource(url);
        this.hls.attachMedia(this.video);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => this.video.play());
        this.hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal && !this.options.useProxy) {
                this.log("HLS Fatal. Trying Proxy...");
                this.options.useProxy = true;
                this.load(originalUrl);
            }
        });
    }

    destroy() {
        if (this.hls) { this.hls.destroy(); this.hls = null; }
        this.video.pause();
        this.video.removeAttribute('src');
        this.video.load();
    }
}

// Initialize the engine
const engine = new UltimateEngine('video'); // Assumes your <video id="video">

// These are the functions your main script calls
export function play(ch) {
    // Reset proxy for every new channel click
    engine.options.useProxy = false; 
    engine.load(ch.url);
}

export function fullscreen() {
    const v = document.getElementById('video');
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
}
