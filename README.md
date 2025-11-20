# Coffee House - Sistema de E-commerce

Sistema completo de e-commerce que funciona como plataforma intermediaria entre proveedores de cafés especiales e insumos para preparación de café, y los consumidores finales.

## Descripción

Coffee House es una aplicación web full-stack que opera como marketplace especializado en café. El sistema conecta:

- **Proveedores de Cafés Especiales**: Pueden ofrecer sus productos premium
- **Proveedores de Insumos**: Ofrecen equipamiento y herramientas para preparación de café (prensas, cafeteras, molinillos, etc.)
- **Consumidores Finales**: Pueden explorar, comparar y comprar productos de diferentes proveedores

### Características del Sistema

- **Portal de Clientes**: Navegación de productos de múltiples proveedores, carrito de compras, proceso de checkout y seguimiento de pedidos
- **Panel de Proveedores**: Gestión de inventario, productos e insumos propios
- **Panel de Administración**: Gestión completa de usuarios, pedidos, estadísticas y soporte de la plataforma
- **Sistema de Pagos**: Integración con Mercado Pago
- **Sistema de Notificaciones**: Notificaciones en tiempo real para usuarios
- **Sistema de Reviews**: Valoraciones y comentarios de productos

## Tecnologías Utilizadas

### Backend
- **Node.js** con **Express.js**
- **MySQL** como base de datos
- **JWT** para autenticación
- **Bcrypt** para encriptación de contraseñas
- **Nodemailer** para envío de correos
- **Mercado Pago SDK** para procesamiento de pagos
- **Multer** para manejo de archivos
- **Helmet** y **express-rate-limit** para seguridad

### Frontend
- **React 19** con **Vite**
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- **Chart.js** para visualización de datos
- **SweetAlert2** para alertas y modales
- **React Icons** para iconografía

## Requisitos Previos

- **Node.js** (v16 o superior)
- **MySQL** (v8 o superior)
- **npm** o **yarn**
- Cuenta de **Mercado Pago** (para funcionalidad de pagos)
- Cuenta de correo para **Nodemailer** (para envío de emails)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/yeralbravo/COFFEEHOUSE-PROJECT.git
cd COFFEEHOUSE-PROJECT
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend` con las siguientes variables:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=coffeehouse

# JWT
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_app

# Email del Administrador
ADMIN_EMAIL=admin@coffeehouse.com

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_PUBLIC_KEY=tu_public_key
```

**Nota importante sobre el administrador:**
El email configurado en `ADMIN_EMAIL` será asignado automáticamente como administrador al registrarse. Para obtener acceso de administrador:
1. Configura el `ADMIN_EMAIL` en el archivo `.env` con el correo que deseas usar
2. Regístrate en la aplicación usando ese mismo correo
3. El sistema automáticamente te asignará privilegios de administrador

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:5000
VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key
```

### 4. Configurar la Base de Datos

1. Crear la base de datos en MySQL:
```sql
CREATE DATABASE coffeehouse;
```

2. Las tablas se crearán automáticamente al iniciar el backend por primera vez

## Ejecución

### Modo Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```
El servidor se ejecutará en `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
La aplicación se ejecutará en `http://localhost:5173`

### Modo Producción

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Estructura del Proyecto

```
COFFEEHOUSE-PROJECT/
├── backend/
│   ├── config/          # Configuraciones (DB)
│   ├── middleware/      # Middlewares (auth, upload)
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   ├── services/        # Servicios (email)
│   ├── server.js        # Punto de entrada del servidor
│   └── package.json
│
├── frontend/
│   ├── public/          # Archivos públicos
│   ├── src/
│   │   ├── assets/      # Recursos estáticos
│   │   ├── components/  # Componentes React
│   │   ├── context/     # Context API
│   │   ├── hooks/       # Custom Hooks
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── services/    # Servicios API
│   │   ├── style/       # Estilos globales
│   │   ├── App.jsx      # Componente principal
│   │   └── main.jsx     # Punto de entrada
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Características Principales

### Para Clientes (Consumidores Finales)
- Registro e inicio de sesión
- Exploración del catálogo de productos de múltiples proveedores
- Comparación de productos y precios
- Carrito de compras multi-proveedor
- Proceso de checkout con múltiples direcciones
- Pagos seguros con Mercado Pago
- Seguimiento de pedidos en tiempo real
- Sistema de reviews y calificaciones de productos
- Búsqueda y filtrado avanzado de productos
- Gestión de perfil y preferencias
- Recuperación de contraseña

### Para Proveedores
- Dashboard con estadísticas de ventas
- Gestión de productos propios (cafés especiales o insumos)
- Control de inventario en tiempo real
- Alertas de stock bajo
- Reportes de ventas y análisis
- Gestión de pedidos recibidos
- Configuración de precios
- Carga de imágenes y descripciones de productos

### Para Administradores (Plataforma)
- Panel de administración completo del marketplace
- Gestión de usuarios (clientes, proveedores, admins)
- Aprobación y verificación de nuevos proveedores
- Gestión y moderación de pedidos
- Estadísticas globales y reportes de la plataforma
- Sistema de soporte y mensajes de contacto
- Gestión de solicitudes de proveedores
- Registro de actividades y auditoría para Admin (logs)
- Moderación de reviews y contenido

## Scripts Disponibles

### Backend
```bash
npm run dev      # Ejecutar en modo desarrollo con nodemon
```

### Frontend
```bash
npm run dev      # Ejecutar servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de build de producción
npm run lint     # Ejecutar ESLint
```

## Seguridad

- Autenticación basada en JWT
- Encriptación de contraseñas con bcrypt
- Protección contra ataques comunes con Helmet
- Rate limiting para prevenir abusos
- Validación de datos con express-validator
- CORS configurado correctamente

## API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/forgot-password` - Recuperar contraseña

### Productos
- `GET /api/products` - Listar productos de todos los proveedores
- `GET /api/products/:id` - Detalle de producto
- `POST /api/products` - Crear producto (Proveedor/Admin)
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:id` - Detalle de pedido
- `PUT /api/orders/:id/status` - Actualizar estado

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar del carrito

## Roles de Usuario

1. **Cliente**: Consumidor final que puede comprar productos de diferentes proveedores
2. **Proveedor**: Puede gestionar y vender sus propios productos (cafés especiales o insumos)
3. **Administrador**: Gestiona la plataforma y modera la actividad del marketplace

## Licencia

Este proyecto está bajo la Licencia ISC.

---

Marketplace de Café Especial
