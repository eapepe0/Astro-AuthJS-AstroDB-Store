import { loginUser, logout, registerUser } from './auth';
import { loadProductsFromCart } from './cart';
import { createUpdateProduct } from './products/create-update-product.action';
import { getProductsByPage } from './products/get-products-by-page.action';
import { getProductBySlug } from './products/get-products-by-slug.action';

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Productos
  getProductsByPage,
  getProductBySlug,
  createUpdateProduct,

  // Cart
  loadProductsFromCart
};
