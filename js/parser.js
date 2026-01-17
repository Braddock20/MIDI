const IPTV_LINK = 'https://iptv-org.github.io/iptv/index.m3u'; 

/**
 * FASTEST M3U PARSER
 * Optimized for high-speed link extraction using native regex.
 */
export async function loadChannels() {
    try {
        const response = await fetch(IPTV_LINK);
        const text = await response.text();
        
        const channels = [];
        
        /**
         * The "Magic" Regex:
         * 1. Looks for #EXTINF
         * 2. Jumps to the comma and captures the Name: (.*?)
         * 3. Jumps to the next line and captures the URL: (http[^\s]+)
         * 4. 'g' flag makes it search the whole file at once
         */
        const regex = /#EXTINF:.*?,(.*?)\n(http[^\s]+)/g;
        let match;

        // Fastest way to iterate in JS for large text blocks
        while ((match = regex.exec(text)) !== null) {
            channels.push({
                name: match[1].trim(),
                url: match[2].trim()
            });
        }

        console.log(`Parsed ${channels.length} channels instantly.`);
        return channels;

    } catch (error) {
        console.error("Critical speed-parse error:", error);
        return [];
    }
}
