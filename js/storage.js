const KEY = 'favorites';

export function getFavs(){
  return JSON.parse(localStorage.getItem(KEY)||'[]');
  }

  export function toggleFav(name){
    const f = getFavs();
      const i = f.indexOf(name);
        i >= 0 ? f.splice(i,1) : f.push(name);
          localStorage.setItem(KEY, JSON.stringify(f));
          }