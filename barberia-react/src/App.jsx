import React, { useEffect } from 'react';
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
import ProtectedRoute from './components/ProtectedRoute';
import storageService from './services/storage.service';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    useEffect(() => {
        storageService.inicializarDatos();
    }, []);

    return (
        <AuthProvider>
            <ProductProvider>
                <CartProvider>
                    <Router>
                    <div className="d-flex flex-column min-vh-100">
                        <AppNavbar />
                        <main className="flex-grow-1">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/servicios" element={<ServicesPage />} />
                                <Route path="/producto/:id" element={<ProductDetailPage />} />
                                <Route path="/agendar" element={<AppointmentPage />} />
                                <Route path="/carrito" element={<CartPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/compra-exitosa" element={<PurchaseSuccessPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/registro" element={<RegisterPage />} />
                                <Route path="/nosotros" element={<AboutPage />} />
                                <Route path="/contacto" element={<ContactPage />} />
                                <Route path="/blog" element={<BlogPage />} />
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requiredRole="Administrator">
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
