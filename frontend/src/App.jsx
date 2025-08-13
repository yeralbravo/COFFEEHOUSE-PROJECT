import { Routes, Route } from 'react-router-dom';
import React from 'react';

// Componentes y Páginas
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientHome from './pages/ClientHome'; 
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CafePage from './pages/CafePage';
import InsumosPage from './pages/InsumosPage';
import InsumoDetailPage from './pages/InsumoDetailPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SupplierRequestPage from './pages/SupplierRequestPage';

// Layout de Admin
import AdminLayout from './components/admin/AdminLayout';

// Páginas de Administrador
import AdminPanel from './pages/AdminPanel';
import ActivityLogPage from './pages/ActivityLogPage';
import CreateUserPage from './pages/CreateUserPage';
import ClientsPage from './pages/ClientsPage';
import SuppliersPage from './pages/SuppliersPage';
import AdminsPage from './pages/AdminsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import SupportPage from './pages/SupportPage';
import SupplierRequestsPage from './pages/SupplierRequestsPage'; // <-- AÑADIR ESTA LÍNEA

// --- NUEVAS PÁGINAS DE ESTADÍSTICAS ---
import AdminSalesStatsPage from './pages/AdminSalesStatsPage';
import AdminProductStatsPage from './pages/AdminProductStatsPage';
import AdminUserStatsPage from './pages/AdminUserStatsPage';
import AdminOrderStatsPage from './pages/AdminOrderStatsPage';


// Páginas de Proveedor
import SupplierDashboardPage from './pages/SupplierDashboardPage';
import SupplierProductsPage from './pages/SupplierProductsPage';
import SupplierInsumosPage from './pages/SupplierInsumosPage';
import CreateEditItemPage from './pages/CreateEditItemPage';
import SupplierOrdersPage from './pages/SupplierOrdersPage';
import SupplierSalesReportPage from './pages/SupplierSalesReportPage';
import SupplierProductStatsPage from './pages/SupplierProductStatsPage';
import SupplierOrderStatsPage from './pages/SupplierOrderStatsPage';
import SupplierLowStockPage from './pages/SupplierLowStockPage'; 


function App() {
  return (
    <>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/supplier-request" element={<SupplierRequestPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* --- Rutas para Clientes y Proveedores (usan MainLayout) --- */}
        <Route element={<ProtectedRoute role={['client', 'supplier']}><MainLayout /></ProtectedRoute>}>
          <Route path='/home' element={<ClientHome />} />
          <Route path="/cafe" element={<CafePage />} />
          <Route path="/insumos" element={<InsumosPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/shipping" element={<CheckoutPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path='/mis-pedidos' element={<MyOrdersPage />} />
          <Route path='/order/:orderId' element={<OrderDetailPage />} />
          <Route path="/order-success" element={<h1 style={{textAlign: 'center', margin: '2rem'}}>¡Gracias por tu compra!</h1>} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/insumo/:insumoId" element={<InsumoDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/change-password' element={<ChangePasswordPage />} />
          
          {/* Rutas exclusivas del panel de proveedor */}
          <Route path='/supplier/dashboard' element={<SupplierDashboardPage />} />
          <Route path='/supplier/products' element={<SupplierProductsPage />} />
          <Route path='/supplier/item/create' element={<CreateEditItemPage />} />
          <Route path='/supplier/item/edit/:itemType/:itemId' element={<CreateEditItemPage />} />
          <Route path='/supplier/insumos' element={<SupplierInsumosPage />} />
          <Route path='/supplier/orders' element={<SupplierOrdersPage />} />
          <Route path='/supplier/stats/sales' element={<SupplierSalesReportPage />} />
          <Route path='/supplier/stats/products' element={<SupplierProductStatsPage />} />
          <Route path='/supplier/stats/orders' element={<SupplierOrderStatsPage />} />
          <Route path='/supplier/stats/low-stock' element={<SupplierLowStockPage />} />
          
        </Route>
        
        {/* --- Rutas Exclusivas de Administrador (usan AdminLayout) --- */}
        <Route path="/admin" element={<ProtectedRoute role='admin'><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminPanel />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="admins" element={<AdminsPage />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="activity-log" element={<ActivityLogPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          {/* --- NUEVAS RUTAS DE ESTADÍSTICAS --- */}
          <Route path="stats/sales" element={<AdminSalesStatsPage />} />
          <Route path="stats/products" element={<AdminProductStatsPage />} />
          <Route path="stats/users" element={<AdminUserStatsPage />} />
          <Route path="stats/orders" element={<AdminOrderStatsPage />} />
          <Route path="supplier-requests" element={<SupplierRequestsPage />} /> {/* <-- AÑADIR ESTA LÍNEA */}
        </Route>

      </Routes>
    </>
  );
}

export default App;