const LOCAL_JSON = './Clean_Playlist.json';
const FALLBACK_M3U = 'https://iptv-org.github.io/iptv/index.m3u';

/**
 * Main function to load channels. 
 * Prioritizes Clean_Playlist.json but falls back to M3U if needed.
 */
export async function loadChannels() {
    try {
        const response = await fetch(LOCAL_JSON);
        if (!response.ok) throw new Error('Could not load local JSON');
        
        const data = await response.json();
        
        // 100% Guaranteed mapping of your shorthand JSON keys:
        // n -> name, u -> url, l -> logo, g -> group
        return data.map(channel => ({
            name: channel.n || 'Unknown Channel',
            url: channel.u || '',
            logo: channel.l || '',
            group: channel.g || 'General'
        }));
        
    } catch (error) {
        console.warn("JSON parsing failed, switching to M3U fallback:", error);
        return await loadM3U();
    }
}

/**
 * Fallback parser for standard M3U files
 */
async function loadM3U() {
    try {
        const response = await fetch(FALLBACK_M3U);
        const text = await response.text();
        const lines = text.split('\n');
        const channels = [];
        let currentChannel = {};

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('#EXTINF')) {
                currentChannel = {
                    name: line.split(',').pop(),
                    group: (line.match(/group-title="([^"]+)"/)||[])[1] || 'Other',
                    logo: (line.match(/tvg-logo="([^"]+)"/)||[])[1] || '',
                    url: ''
                };
            } else if (line.startsWith('http')) {
                currentChannel.url = line;
                channels.push(currentChannel);
            }
        }
        return channels;
    } catch (err) {
        console.error("M3U Fallback also failed:", err);
        return [];
    }
}
