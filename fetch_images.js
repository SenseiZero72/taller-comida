const terms = [
  'Coca-Cola Original', 'Leche Danone', 'Zuko', 'Paladini', 'Yogurt Ser',
  'Oreo', 'Jugo BC', 'La Campagnola', 'Lays',
  'Queso Finlandia', 'Cerveza Quilmes', 'Havanna', 'Villavicencio',
  'Arroz Gallo', 'Taragui'
];

async function run() {
  const results = {};
  for (const term of terms) {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=3`);
      const data = await res.json();
      let img = null;
      if (data.products && data.products.length > 0) {
        for (const p of data.products) {
          if (p.image_front_url) {
            img = p.image_front_url;
            break;
          }
        }
      }
      results[term] = img;
    } catch (e) {
      results[term] = null;
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
run();
