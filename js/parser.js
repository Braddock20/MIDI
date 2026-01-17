const LOCAL_JSON = './clean_playlist.json';
const FALLBACK_M3U = 'https://iptv-org.github.io/iptv/index.m3u';

export async function loadChannels() {
  try {
    const res = await fetch(LOCAL_JSON, { cache: 'force-cache' });
    if (!res.ok) throw new Error('JSON not found');

    const raw = await res.json();

    // 🔥 NORMALIZE JSON STRUCTURE
    return raw.map(ch => ({
      name: ch.n || 'Unknown',
      url: ch.u || '',
      logo: ch.l || '',
      group: ch.g || 'Other'
    }));

  } catch (err) {
    console.warn('Local JSON failed, loading M3U fallback');
    return await loadFromM3U();
  }
}

async function loadFromM3U() {
  const res = await fetch(FALLBACK_M3U);
  const text = await res.text();

  const lines = text.split('\n');
  const channels = [];
  let current = {};

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith('#EXTINF')) {
      current = {
        name: line.split(',').pop(),
        logo: (line.match(/tvg-logo="([^"]+)"/) || [])[1] || '',
        group: (line.match(/group-title="([^"]+)"/) || [])[1] || 'Other',
        url: ''
      };
    } else if (line.startsWith('http')) {
      current.url = line;
      channels.push(current);
    }
  }

  return channels;
  }
