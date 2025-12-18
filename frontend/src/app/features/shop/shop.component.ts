import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shop-container">
      <div class="shop-header">
        <h1>🛍️ Tienda Online</h1>
        <p>Componente cargado con Lazy Loading</p>
      </div>

      <div class="lazy-info">
        <h2>⚡ Lazy Loading Implementado</h2>
        <p>
          Este componente se carga de forma perezosa usando <code>loadChildren</code>.
          El bundle JavaScript se descarga solo cuando navegas a esta ruta.
        </p>
        <div class="benefits">
          <div class="benefit-card">
            <span class="icon">📦</span>
            <h3>Bundle Separado</h3>
            <p>Código en chunk independiente</p>
          </div>
          <div class="benefit-card">
            <span class="icon">⚡</span>
            <h3>Carga Rápida</h3>
            <p>Initial bundle más pequeño</p>
          </div>
          <div class="benefit-card">
            <span class="icon">🚀</span>
            <h3>Precarga</h3>
            <p>PreloadAllModules activo</p>
          </div>
        </div>
      </div>

      <div class="products-grid">
        @for (product of products; track product.id) {
          <div class="product-card">
            <div class="product-image">
              {{ product.image }}
            </div>
            <div class="product-info">
              <span class="category">{{ product.category }}</span>
              <h3>{{ product.name }}</h3>
              <p class="price">{{ product.price | currency:'EUR' }}</p>
              <button class="btn-add">Añadir al Carrito</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .shop-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .shop-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        background: linear-gradient(135deg, #4facfe, #00f2fe);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        font-size: 1.1rem;
      }
    }

    .lazy-info {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;

      h2 {
        color: #00f2fe;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      code {
        background: #f5f5f5;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        color: #e91e63;
      }
    }

    .benefits {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .benefit-card {
      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;

      .icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      h3 {
        font-size: 1rem;
        color: #333;
        margin: 0.5rem 0 0.25rem 0;
      }

      p {
        font-size: 0.85rem;
        color: #666;
        margin: 0;
      }
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-8px);
      }

      .product-image {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
      }

      .product-info {
        padding: 1.5rem;

        .category {
          display: inline-block;
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        h3 {
          font-size: 1.1rem;
          color: #333;
          margin: 0.5rem 0;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4facfe;
          margin: 0.75rem 0 1rem 0;
        }

        .btn-add {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
          }
        }
      }
    }

    @media (max-width: 768px) {
      .shop-container {
        padding: 1rem;
      }

      .shop-header h1 {
        font-size: 2rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ShopComponent {
  products: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electrónica', image: '💻' },
    { id: 2, name: 'Smartphone X', price: 899.99, category: 'Electrónica', image: '📱' },
    { id: 3, name: 'Auriculares', price: 199.99, category: 'Accesorios', image: '🎧' },
    { id: 4, name: 'Cámara 4K', price: 699.99, category: 'Fotografía', image: '📷' },
    { id: 5, name: 'Smartwatch', price: 349.99, category: 'Wearables', image: '⌚' },
    { id: 6, name: 'Tablet Pro', price: 799.99, category: 'Electrónica', image: '📱' }
  ];
}
