export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  marcas: string;
  tags?: string[];
  nutriScore?: string;
  ecoScore?: string;
  novaGroup?: number;
  imagen?: string;
  ingredientes?: string;
  alergenos?: string;
  nutrientes?: {
    energiaKcal?: number;
    energiaKj?: number;
    grasas?: number;
    grasasSaturadas?: number;
    carbohidratos?: number;
    azucares?: number;
    fibra?: number;
    proteinas?: number;
    sal?: number;
  };
}

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v2';
const HEADERS = {
  'User-Agent': 'TallerComida - React Native Expo App - Version 1.0 - contact@tallercomida.com',
  'Accept': 'application/json',
};

// Caché en memoria para evitar llamadas HTTP duplicadas
const searchCache = new Map<string, Producto[]>();
const productCache = new Map<string, Producto>();

// Función auxiliar para formatear tags/categorías (quitar prefijos como "en:", "es:")
const cleanTag = (tag: string): string => {
  if (!tag) return '';
  return tag.includes(':') ? tag.split(':')[1] : tag;
};

// Asegura que las etiquetas de categoría y salud usen el prefijo indexado de idioma 'en:'
const ensureLanguagePrefix = (value: string): string => {
  if (!value) return '';
  return value.includes(':') ? value : `en:${value}`;
};

// Utilidad para esperar (sleep)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Función fetch envuelta en un bucle de reintento automático con backoff exponencial.
 * Esto ayuda a recuperarse de errores de red temporales y rate limits (HTTP 503 / 429).
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 600): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // Si obtenemos un 503 (Servicio no disponible/Rate Limit) y aún quedan intentos
    if (response.status === 503 && retries > 0) {
      console.warn(`[API] Servidor ocupado (503). Reintentando en ${delay}ms... (${retries} intentos restantes)`);
      await sleep(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`[API] Error de red. Reintentando en ${delay}ms... (${retries} intentos restantes)`, error);
      await sleep(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Mapea el formato de Open Food Facts al de nuestra aplicación
const mapApiProductToAppProduct = (apiProduct: any): Producto => {
  const nutriments = apiProduct.nutriments || {};
  
  // Limpiar y mapear tags
  const tags = [
    ...(apiProduct.labels_tags || []),
    ...(apiProduct.categories_tags || [])
  ]
    .map(cleanTag)
    .filter((v, i, a) => v && a.indexOf(v) === i) // eliminar duplicados y vacíos
    .slice(0, 5); // limitar a 5 tags

  return {
    id: apiProduct.code || '',
    nombre: apiProduct.product_name_es || apiProduct.product_name || apiProduct.product_name_en || 'Producto desconocido',
    categoria: apiProduct.categories_tags && apiProduct.categories_tags.length > 0 
      ? cleanTag(apiProduct.categories_tags[0])
      : 'Otros',
    marcas: apiProduct.brands || 'Marca desconocida',
    tags: tags.length > 0 ? tags : undefined,
    nutriScore: apiProduct.nutriscore_grade ? apiProduct.nutriscore_grade.toUpperCase() : 'E',
    ecoScore: apiProduct.ecoscore_grade ? apiProduct.ecoscore_grade.toUpperCase() : 'D',
    novaGroup: apiProduct.nova_group ? Number(apiProduct.nova_group) : 4,
    imagen: apiProduct.image_url || apiProduct.image_front_url || apiProduct.image_small_url,
    ingredientes: apiProduct.ingredients_text_es || apiProduct.ingredients_text || apiProduct.ingredients_text_en || 'Ingredientes no especificados',
    alergenos: apiProduct.allergens_from_ingredients || apiProduct.allergens || 'Ninguno detectado',
    nutrientes: {
      energiaKcal: nutriments['energy-kcal_100g'] !== undefined ? Number(nutriments['energy-kcal_100g']) : undefined,
      energiaKj: nutriments['energy-kj_100g'] !== undefined ? Number(nutriments['energy-kj_100g']) : undefined,
      grasas: nutriments.fat_100g !== undefined ? Number(nutriments.fat_100g) : undefined,
      grasasSaturadas: nutriments['saturated-fat_100g'] !== undefined ? Number(nutriments['saturated-fat_100g']) : undefined,
      carbohidratos: nutriments.carbohydrates_100g !== undefined ? Number(nutriments.carbohydrates_100g) : undefined,
      azucares: nutriments.sugars_100g !== undefined ? Number(nutriments.sugars_100g) : undefined,
      fibra: nutriments.fiber_100g !== undefined ? Number(nutriments.fiber_100g) : undefined,
      proteinas: nutriments.proteins_100g !== undefined ? Number(nutriments.proteins_100g) : undefined,
      sal: nutriments.salt_100g !== undefined ? Number(nutriments.salt_100g) : undefined,
    }
  };
};

export interface SearchFilters {
  category?: string;
  tag?: string;
  brand?: string;
}

/**
 * Busca productos en Open Food Facts de acuerdo con un término y filtros (con caché y reintentos)
 */
export async function searchProducts(
  query: string = '',
  filters?: SearchFilters,
  page: number = 1
): Promise<Producto[]> {
  const cleanQuery = query.trim();

  // Si parece ser un código de barras (solo dígitos, de 8 a 14 caracteres), buscar directamente
  const isBarcode = /^\d{8,14}$/.test(cleanQuery);
  if (isBarcode) {
    try {
      const product = await getProductByCode(cleanQuery);
      return product ? [product] : [];
    } catch (error) {
      console.error('[API] Error buscando por código de barras directamente:', error);
    }
  }

  const cacheKey = `${cleanQuery.toLowerCase()}_cat:${filters?.category || ''}_brand:${filters?.brand || ''}_tag:${filters?.tag || ''}_page:${page}`;
  
  // Si ya tenemos los resultados en caché, retornarlos directamente
  if (searchCache.has(cacheKey)) {
    console.log(`[API Cache] Sirviendo búsqueda desde la caché local (${cacheKey})`);
    return searchCache.get(cacheKey) || [];
  }

  try {
    const params = new URLSearchParams();
    let url = '';

    if (query.trim()) {
      // Búsqueda por texto libre (v1 API CGI search)
      params.append('search_terms', query.trim());
      params.append('search_simple', '1');
      params.append('action', 'process');
      params.append('json', '1');
      params.append('page', page.toString());

      if (filters?.category) {
        params.append('tagtype_0', 'categories');
        params.append('tag_contains_0', 'contains');
        params.append('tag_0', ensureLanguagePrefix(filters.category));
      }
      if (filters?.brand) {
        params.append('tagtype_1', 'brands');
        params.append('tag_contains_1', 'contains');
        params.append('tag_1', filters.brand);
      }
      if (filters?.tag) {
        params.append('tagtype_2', 'labels');
        params.append('tag_contains_2', 'contains');
        params.append('tag_2', ensureLanguagePrefix(filters.tag));
      }

      params.append(
        'fields',
        'code,product_name,product_name_es,product_name_en,brands,image_url,image_front_url,image_small_url,nutriscore_grade,ecoscore_grade,nova_group,categories_tags,labels_tags'
      );
      params.append('page_size', '24');

      url = `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`;
    } else {
      // Búsqueda estructurada por filtros únicamente (v2 API search)
      if (filters?.category) {
        params.append('categories_tags', ensureLanguagePrefix(filters.category));
      }

      if (filters?.brand) {
        params.append('brands_tags', filters.brand);
      }

      if (filters?.tag) {
        params.append('labels_tags', ensureLanguagePrefix(filters.tag));
      }

      params.append(
        'fields',
        'code,product_name,product_name_es,product_name_en,brands,image_url,image_front_url,image_small_url,nutriscore_grade,ecoscore_grade,nova_group,categories_tags,labels_tags'
      );
      params.append('page_size', '24');
      params.append('page', page.toString());
      params.append('json', 'true');

      url = `${API_BASE_URL}/search?${params.toString()}`;
    }

    console.log('[API] Buscando en:', url);

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Error en respuesta del servidor: ${response.status}`);
    }

    const data = await response.json();
    const productsList = data.products || [];
    const mappedProducts = productsList.map(mapApiProductToAppProduct);

    // Guardamos en caché si la llamada fue exitosa
    searchCache.set(cacheKey, mappedProducts);

    return mappedProducts;
  } catch (error) {
    console.error('[API Error] Error buscando productos:', error);
    throw error;
  }
}

/**
 * Obtiene el detalle de un producto específico por su código de barras (con caché y reintentos)
 */
export async function getProductByCode(code: string): Promise<Producto | null> {
  if (!code) return null;

  // Si el producto ya está en caché, retornarlo al instante
  if (productCache.has(code)) {
    console.log(`[API Cache] Sirviendo detalle del producto ${code} desde caché local`);
    return productCache.get(code) || null;
  }

  try {
    const url = `${API_BASE_URL}/product/${code}.json`;
    console.log('[API] Obteniendo producto:', url);

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener producto ${code}: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      return null;
    }

    const mappedProduct = mapApiProductToAppProduct(data.product);

    // Almacenamos en caché local
    productCache.set(code, mappedProduct);

    return mappedProduct;
  } catch (error) {
    console.error(`[API Error] Error obteniendo producto ${code}:`, error);
    throw error;
  }
}

