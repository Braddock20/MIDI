const LOCAL_JSON = './Clean_Playlist.json';
const FALLBACK_M3U = 'https://iptv-org.github.io/iptv/index.m3u';

/**
 * Parses both JSON and M3U. 
 * Shows JSON data first, then updates/multiplies with M3U data.
 */
export async function loadChannels() {
    let allChannels = [];

    // 1. Try to parse the Local JSON first (Guaranteed for your specific file)
    try {
        const response = await fetch(LOCAL_JSON);
        if (response.ok) {
            const jsonData = await response.json();
            // Map shorthand keys: n -> name, u -> url, l -> logo, g -> group
            const parsedJson = jsonData.map(ch => ({
                name: ch.n || 'Unknown',
                url: ch.u || '',
                logo: ch.l || '',
                group: ch.g || 'General'
            }));
            allChannels = [...parsedJson];
            console.log(`Loaded ${allChannels.length} channels from JSON.`);
        }
    } catch (e) {
        console.warn("Local JSON not found or invalid, skipping to M3U.");
    }

    // 2. Fetch and parse the M3U link to add even more channels
    try {
        const response = await fetch(FALLBACK_M3U);
        const text = await response.text();
        const m3uChannels = parseM3U(text);
        
        // Combine them (adds M3U channels to the JSON channels)
        allChannels = [...allChannels, ...m3uChannels];
        console.log(`Total channels after M3U sync: ${allChannels.length}`);
    } catch (e) {
        console.error("M3U fetch failed:", e);
    }

    return allChannels;
}

/**
 * Standard M3U Text Parser
 */
function parseM3U(text) {
    const lines = text.split('\n');
    const channels = [];
    let currentChannel = null;

    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('#EXTINF')) {
            currentChannel = {
                name: line.split(',').pop().trim(),
                group: (line.match(/group-title="([^"]+)"/)||[])[1] || 'Other',
                logo: (line.match(/tvg-logo="([^"]+)"/)||[])[1] || '',
                url: ''
            };
        } else if (line.startsWith('http') && currentChannel) {
            currentChannel.url = line;
            channels.push(currentChannel);
            currentChannel = null;
        }
    }
    return channels;
}
