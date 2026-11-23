import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import { CartProvider } from './hooks/CartContext';
import { ProductProvider } from './hooks/ProductContext';
import AppNavbar from './components/Navbar';
import AppFooter from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AppointmentPage from './pages/AppointmentPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import AdminDashboard from './pages/AdminDashboard';
import MisComprasPage from './pages/MisComprasPage';
import NoAutorizadoPage from './pages/NoAutorizadoPage';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <AuthProvider>
            <ProductProvider>
                <CartProvider>
                    <Router>
                        <div className="d-flex flex-column min-vh-100">
                            <AppNavbar />
                            <main className="flex-grow-1">
                                <Routes>
                                    {/* Rutas públicas (tienda) */}
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/servicios" element={<ServicesPage />} />
                                    <Route path="/producto/:id" element={<ProductDetailPage />} />
                                    <Route path="/carrito" element={<CartPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/registro" element={<RegisterPage />} />
                                    <Route path="/nosotros" element={<AboutPage />} />
                                    <Route path="/contacto" element={<ContactPage />} />
                                    <Route path="/blog" element={<BlogPage />} />
                                    <Route path="/no-autorizado" element={<NoAutorizadoPage />} />

                                    {/* Requieren sesión iniciada (cualquier rol) */}
                                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                    <Route path="/agendar" element={<ProtectedRoute><AppointmentPage /></ProtectedRoute>} />
                                    <Route path="/compra-exitosa" element={<ProtectedRoute><PurchaseSuccessPage /></ProtectedRoute>} />
                                    <Route path="/mis-compras" element={<ProtectedRoute><MisComprasPage /></ProtectedRoute>} />

                                    {/* Panel interno: ADMIN (acceso total) y VENDEDOR (solo productos y órdenes) */}
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute roles={['ADMIN', 'VENDEDOR']}>
                                                <AdminDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="*" element={<div className="text-center py-5"><h2>404 - Página no encontrada</h2></div>} />
                                </Routes>
                            </main>
                            <AppFooter />
                        </div>
                    </Router>
                </CartProvider>
            </ProductProvider>
        </AuthProvider>
    );
}

export default App;
