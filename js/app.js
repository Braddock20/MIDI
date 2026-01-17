import { loadChannels } from './parser.js';
import { render } from './ui.js';
import { fullscreen } from './player.js';
import { toggleFav } from './storage.js';

let channels = [];

document.addEventListener('DOMContentLoaded', async ()=>{
  channels = await loadChannels();
    render(channels);
    });

    document.getElementById('search').oninput = e=>{
      const q = e.target.value.toLowerCase();
        render(channels.filter(c=>c.name.toLowerCase().includes(q)));
        };

        document.getElementById('fullscreen').onclick = fullscreen;
        document.getElementById('fav').onclick = ()=>{
          const name = document.getElementById('title').textContent;
            toggleFav(name);
            };