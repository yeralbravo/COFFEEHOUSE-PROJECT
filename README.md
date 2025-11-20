# Coffee House - Sistema de E-commerce

Sistema completo de e-commerce para una cafetería con funcionalidades para clientes, proveedores y administradores.

## Descripción

Coffee House es una aplicación web full-stack que permite la gestión integral de una cafetería en línea. El sistema incluye:

- **Portal de Clientes**: Navegación de productos, carrito de compras, proceso de checkout y seguimiento de pedidos
- **Panel de Proveedores**: Gestión de inventario, productos e insumos
- **Panel de Administración**: Gestión completa de usuarios, pedidos, estadísticas y soporte
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

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_PUBLIC_KEY=tu_public_key
```

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

### Para Clientes
- Registro e inicio de sesión
- Exploración del catálogo de productos
- Carrito de compras
- Proceso de checkout con múltiples direcciones
- Pagos con Mercado Pago
- Seguimiento de pedidos
- Sistema de reviews y calificaciones
- Búsqueda de productos
- Gestión de perfil
- Recuperación de contraseña

### Para Proveedores
- Dashboard con estadísticas
- Gestión de productos e insumos
- Control de inventario
- Alertas de stock bajo
- Reportes de ventas
- Gestión de pedidos

### Para Administradores
- Panel de administración completo
- Gestión de usuarios (clientes, proveedores, admins)
- Gestión de pedidos
- Estadísticas y reportes
- Sistema de soporte y mensajes de contacto
- Gestión de solicitudes de proveedores
- Registro de actividades (logs)

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
- `GET /api/products` - Listar productos
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

1. **Cliente**: Usuario regular que puede comprar productos
2. **Proveedor**: Puede gestionar productos e insumos
3. **Administrador**: Acceso completo al sistema


## Licencia

Este proyecto está bajo la Licencia ISC.

---

Desarrollado para Coffee House
