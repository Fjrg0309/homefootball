import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h1>👨‍💼 Panel de Administración</h1>
        <p>Bienvenido, {{ auth.currentUser()?.username }}</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <div class="stat-info">
            <h3>Usuarios</h3>
            <p class="stat-value">1,234</p>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <div class="stat-info">
            <h3>Productos</h3>
            <p class="stat-value">567</p>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">💰</span>
          <div class="stat-info">
            <h3>Ventas</h3>
            <p class="stat-value">€12,345</p>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">📊</span>
          <div class="stat-info">
            <h3>Pedidos</h3>
            <p class="stat-value">89</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="content-section">
          <h2>🔒 Contenido Protegido</h2>
          <p>
            Esta página está protegida por el <code>adminGuard</code>. 
            Solo usuarios con rol "admin" pueden acceder.
          </p>
          <p>
            Si intentas acceder sin estar autenticado o sin rol admin, 
            serás redirigido automáticamente.
          </p>
        </div>

        <div class="content-section">
          <h2>🚀 Características del Guard</h2>
          <ul>
            <li>✅ Verifica autenticación</li>
            <li>✅ Verifica rol de administrador</li>
            <li>✅ Modal de login automático</li>
            <li>✅ Preserva URL de retorno (returnUrl)</li>
            <li>✅ Feedback con ToastService</li>
          </ul>
        </div>

        <div class="actions">
          <button class="btn-primary" (click)="goHome()">
            🏠 Volver a Home
          </button>
          <button class="btn-danger" (click)="logout()">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        background: linear-gradient(135deg, #f093fb, #f5576c);
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

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .stat-icon {
        font-size: 2.5rem;
      }

      .stat-info {
        h3 {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 0.25rem 0;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
      }
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .content-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      h2 {
        color: #f5576c;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      code {
        background: #f5f5f5;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        color: #e91e63;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 0.5rem 0;
          color: #666;
        }
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      button {
        padding: 0.875rem 1.75rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-danger {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
      }
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 1rem;
      }

      .dashboard-header h1 {
        font-size: 2rem;
      }

      .dashboard-stats {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class AdminDashboard {
  auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  goHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.auth.logout();
    this.toastService.info('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
