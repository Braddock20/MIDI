const video = document.getElementById('video');

export function play(ch){
  video.src = ch.url;
    video.play().catch(()=>{});
    }

    export function fullscreen(){
      document.documentElement.requestFullscreen?.();
      }