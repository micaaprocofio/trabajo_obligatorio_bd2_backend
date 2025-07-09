
## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- MySQL 8+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd trabajo-obligatorio-bd2-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

4. **Configurar la base de datos**
```bash
# Ejecutar el script de creación de BD
mysql -u root -p < ../trabajo-obligatorio-bd2-mer/01_create_database.sql

# Ejecutar datos de prueba
mysql -u root -p < ../trabajo-obligatorio-bd2-mer/02_insert_sample_data.sql
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```
