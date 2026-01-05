# 📸 Guía de Optimización de Imágenes - Fase 5

## Estructura de Directorios

```
assets/images/
├── original/          # Imágenes originales (no versionar)
├── optimized/         # Imágenes optimizadas para producción
│   ├── small/        # 400px de ancho
│   ├── medium/       # 800px de ancho
│   └── large/        # 1200px de ancho
├── webp/             # Versiones WebP (mejor compresión)
│   ├── small/
│   ├── medium/
│   └── large/
├── avif/             # Versiones AVIF (máxima compresión)
│   ├── small/
│   ├── medium/
│   └── large/
└── svg/              # SVGs optimizados con SVGO
```

## 1. Optimización de Imágenes Raster

### Herramientas Recomendadas
- **Squoosh** (https://squoosh.app/) - Mejor opción web
- **TinyPNG** (https://tinypng.com/) - Compresión PNG/JPG
- **FileOptimizer** (Windows) - Procesamiento por lotes

### Configuración Recomendada

#### JPG/JPEG
- Calidad: 80-85%
- Formato progresivo: Sí
- Eliminar metadatos EXIF: Sí

#### WebP
- Calidad: 80-85%
- Método de compresión: 4 (balance)
- Esfuerzo: 4

#### AVIF
- Calidad: 65-75% (mayor compresión visual equivalente)
- Velocidad: 4

### Tamaños Estándar

| Tamaño | Ancho | Uso típico |
|--------|-------|------------|
| small  | 400px | Móviles, thumbnails |
| medium | 800px | Tablets, cards |
| large  | 1200px | Desktop, hero images |

### Peso Máximo por Imagen
- **Límite absoluto**: 200KB
- **Objetivo recomendado**: < 100KB

## 2. Optimización de SVGs

### Herramienta Recomendada
**SVGOMG** (https://jakearchibald.github.io/svgomg/)

### Configuración SVGO Recomendada
```js
{
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergeStyles',
    'inlineStyles',
    'minifyStyles',
    'removeUselessDefs',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeViewBox: false', // Mantener viewBox
    'cleanupEnableBackground',
    'removeHiddenElems',
    'removeEmptyText',
    'convertShapeToPath',
    'convertEllipseToCircle',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'convertPathData',
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'removeUnusedNS',
    'sortDefsChildren',
    'removeTitle',
    'removeDesc'
  ]
}
```

### Checklist SVG
- [ ] Eliminar elementos `<title>` y `<desc>` si no son necesarios para accesibilidad
- [ ] Convertir estilos inline a atributos
- [ ] Optimizar paths
- [ ] Eliminar metadatos de editores (Illustrator, Figma, etc.)
- [ ] Usar `currentColor` para iconos monocromáticos
- [ ] Mantener `viewBox` para escalabilidad

## 3. Proceso de Optimización

### Paso 1: Preparar Original
1. Exportar imagen en la máxima resolución disponible
2. Guardar en `assets/images/original/`

### Paso 2: Generar Tamaños
```bash
# Ejemplo con ImageMagick (opcional, manual con herramientas web)
convert original.jpg -resize 400x original-small.jpg
convert original.jpg -resize 800x original-medium.jpg
convert original.jpg -resize 1200x original-large.jpg
```

### Paso 3: Optimizar y Convertir

#### En Squoosh:
1. Abrir imagen
2. Configurar compresión (ver configuración arriba)
3. Exportar en JPG, WebP y AVIF
4. Repetir para cada tamaño

### Paso 4: Verificar Peso
```bash
# Verificar que ninguna imagen supere 200KB
find . -type f \( -name "*.jpg" -o -name "*.webp" -o -name "*.avif" \) -size +200k
```

## 4. Nomenclatura de Archivos

```
{nombre}-{tamaño}.{formato}

Ejemplos:
- hero-banner-small.jpg
- hero-banner-medium.webp
- hero-banner-large.avif
- team-logo-small.png
```

## 5. Uso en HTML con Responsive Images

### Con `<picture>` (Art Direction)
```html
<picture>
  <!-- AVIF para navegadores modernos -->
  <source 
    type="image/avif"
    srcset="image-small.avif 400w, image-medium.avif 800w, image-large.avif 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px">
  
  <!-- WebP como fallback -->
  <source 
    type="image/webp"
    srcset="image-small.webp 400w, image-medium.webp 800w, image-large.webp 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px">
  
  <!-- JPG como fallback final -->
  <img 
    src="image-medium.jpg"
    srcset="image-small.jpg 400w, image-medium.jpg 800w, image-large.jpg 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px"
    alt="Descripción de la imagen"
    loading="lazy"
    decoding="async"
    width="800"
    height="600">
</picture>
```

### Con `srcset` simple
```html
<img 
  src="image-medium.jpg"
  srcset="image-small.jpg 400w, image-medium.jpg 800w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px"
  alt="Descripción"
  loading="lazy">
```

## 6. Componente Angular Responsive Image

Usar el componente `<app-responsive-image>` para imágenes optimizadas:

```html
<app-responsive-image
  basePath="/assets/images/optimized/"
  imageName="hero-banner"
  alt="Banner principal"
  [sizes]="{
    small: '100vw',
    medium: '50vw', 
    large: '800px'
  }"
  [aspectRatio]="16/9"
  [priority]="true"
/>
```

## 7. Checklist de Optimización

### Por Imagen
- [ ] Peso < 200KB
- [ ] 3 tamaños generados (400px, 800px, 1200px)
- [ ] Versiones WebP/AVIF creadas
- [ ] `alt` text descriptivo
- [ ] `loading="lazy"` para imágenes below the fold
- [ ] `width` y `height` especificados (evita CLS)

### Por SVG
- [ ] Optimizado con SVGOMG
- [ ] Usa `currentColor` si es monocromático
- [ ] `viewBox` presente
- [ ] Sin metadatos innecesarios
- [ ] `role="img"` y `aria-label` si es significativo
