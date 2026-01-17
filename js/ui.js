import { play } from './player.js';
import { getFavs } from './storage.js';

export function render(channels) {
  const rail = document.getElementById('rail');
  const title = document.getElementById('title');
  const bg = document.getElementById('bg');
  const favs = getFavs();

  rail.innerHTML = '';

  channels.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'card' + (favs.includes(ch.name) ? ' fav' : '');

    // Use logo if available
    if (ch.logo) {
      card.style.backgroundImage = `url(${ch.logo})`;
      card.style.backgroundSize = 'contain';
      card.style.backgroundRepeat = 'no-repeat';
      card.style.backgroundPosition = 'center';
    } else {
      card.textContent = ch.name;
    }

    card.onclick = () => {
      play(ch);
      title.textContent = ch.name;
      bg.style.backgroundImage = ch.logo
        ? `url(${ch.logo})`
        : '';
    };

    rail.appendChild(card);
  });
}
