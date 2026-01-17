import { play } from './player.js';
import { getFavs, toggleFav } from './storage.js';

export function render(channels){
  const rail = document.getElementById('rail');
    const title = document.getElementById('title');
      const bg = document.getElementById('bg');
        const favs = getFavs();

          rail.innerHTML = '';

            channels.forEach(ch=>{
                const c = document.createElement('div');
                    c.className = 'card' + (favs.includes(ch.name)?' fav':'');
                        c.textContent = ch.name;

                            c.onclick = ()=>{
                                  play(ch);
                                        title.textContent = ch.name;
                                              bg.style.backgroundImage = `url(${ch.logo||''})`;
                                                  };

                                                      rail.appendChild(c);
                                                        });
                                                        }