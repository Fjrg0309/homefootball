/**
 * Entidad Product desde la API
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO para crear productos (sin id, sin timestamps)
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

/**
 * DTO para actualizar productos (campos opcionales)
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: string;
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
