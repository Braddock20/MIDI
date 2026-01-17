const LOCAL_JSON = './clean_playlist.json';
const FALLBACK_M3U = 'https://iptv-org.github.io/iptv/index.m3u';

export async function loadChannels() {
  try {
      const r = await fetch(LOCAL_JSON);
          if (!r.ok) throw 'no json';
              return await r.json();
                } catch {
                    return await loadM3U();
                      }
                      }

                      async function loadM3U() {
                        const r = await fetch(FALLBACK_M3U);
                          const t = await r.text();
                            const lines = t.split('\n');
                              const out = [];
                                let ch = {};

                                  for (let l of lines) {
                                      if (l.startsWith('#EXTINF')) {
                                            ch = {
                                                    name: l.split(',').pop(),
                                                            group: (l.match(/group-title="([^"]+)"/)||[])[1]||'Other',
                                                                    logo: '',
                                                                            url: ''
                                                                                  };
                                                                                      } else if (l.startsWith('http')) {
                                                                                            ch.url = l;
                                                                                                  out.push(ch);
                                                                                                      }
                                                                                                        }
                                                                                                          return out;
                                                                                                          }