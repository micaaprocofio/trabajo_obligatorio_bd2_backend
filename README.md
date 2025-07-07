# Sistema de Votación - Backend v2.0

## 🚀 Descripción

Backend del Sistema de Votación Uruguayo desarrollado en Node.js con Express y MySQL. Esta versión 2.0 ha sido completamente modernizada para trabajar con la nueva estructura de base de datos que incluye entidades geográficas (Departamento, Circuito, Establecimiento) y un sistema político más completo.

## 📋 Características Principales

### 🔄 **Migración a Nueva Base de Datos**
- ✅ Compatibilidad con la nueva estructura de tablas
- ✅ Campos actualizados (`CI_Ciudadano`, `CredencialCivica`, `VotoObservado`)
- ✅ Nuevas entidades geográficas y políticas
- ✅ Sistema de roles por circuito (`RolEnCircuito`)

### 🏗️ **Arquitectura Modernizada**
- ✅ Estructura MVC limpia y escalable
- ✅ Modelos separados por entidad
- ✅ Controladores con manejo de errores robusto
- ✅ Validaciones centralizadas
- ✅ Configuración de base de datos con pooling

### 🔧 **Funcionalidades Ampliadas**
- ✅ 40+ endpoints API RESTful
- ✅ Sistema completo de gestión geográfica
- ✅ Manejo de políticos y asignaciones a listas
- ✅ Estadísticas avanzadas de votación
- ✅ Validaciones exhaustivas

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

## 📊 Estructura de la Base de Datos

### 🗺️ **Entidades Geográficas**
- **Departamento**: Divisiones administrativas de Uruguay
- **Circuito**: Subdivisiones dentro de cada departamento
- **Establecimiento**: Centros de votación dentro de cada circuito

### 👥 **Entidades de Personas**
- **Ciudadano**: Información básica con CI y CredencialCivica
- **Politico**: Ciudadanos que participan en política
- **RolEnCircuito**: Autoridades de mesa por circuito

### 🗳️ **Entidades de Votación**
- **Eleccion**: Eventos electorales
- **Lista**: Listas de candidatos por partido
- **Voto**: Registros de votos emitidos
- **ContenidoVoto**: Contenido específico de cada voto

## 🔗 API Endpoints

### 📋 **Información del Sistema**
```
GET /api/health          - Estado del sistema
GET /api/info            - Información detallada del API
```

### 👤 **Ciudadanos**
```
GET /api/ciudadanos/buscar?credencial=X      - Buscar por credencial cívica
GET /api/ciudadanos/buscar-ci?ci=X          - Buscar por CI
POST /api/registrar-votante                 - Registrar votante
```

### 🗳️ **Votación**
```
GET /api/listas?eleccion_id=X               - Listas de una elección
GET /api/papeletas                          - Papeletas especiales
POST /api/votar                             - Emitir voto
GET /api/elecciones                         - Todas las elecciones
GET /api/estadisticas/:id_eleccion          - Estadísticas de votación
```

### 🏛️ **Autoridades**
```
POST /api/autoridades/validar               - Validar autoridad de mesa
```

### 🗺️ **Geografía**
```
GET /api/geografia/departamentos            - Todos los departamentos
GET /api/geografia/departamentos/:id        - Departamento específico
GET /api/geografia/circuitos               - Todos los circuitos
GET /api/geografia/circuitos/:id           - Circuito específico
GET /api/geografia/establecimientos        - Todos los establecimientos
GET /api/geografia/establecimientos/:id    - Establecimiento específico
```

### 👨‍💼 **Políticos**
```
GET /api/politicos                         - Todos los políticos
GET /api/politicos/:id                     - Político específico
POST /api/politicos                        - Crear político
DELETE /api/politicos/:id                  - Eliminar político
POST /api/politicos/asignar-lista          - Asignar político a lista
```

## 📝 Ejemplos de Uso

### Buscar Ciudadano por Credencial
```bash
curl -X GET "http://localhost:3001/api/ciudadanos/buscar?credencial=ABC123"
```

### Emitir un Voto
```bash
curl -X POST "http://localhost:3001/api/votar" \
  -H "Content-Type: application/json" \
  -d '{
    "id_eleccion": 1,
    "id_establecimiento": 1,
    "id_lista": 1
  }'
```

### Validar Autoridad de Mesa
```bash
curl -X POST "http://localhost:3001/api/autoridades/validar" \
  -H "Content-Type: application/json" \
  -d '{
    "credencial_civica": "ABC123"
  }'
```

## 🔄 Cambios Principales v2.0

### 🔧 **Actualizaciones de Esquema**
- `Ciudadano` ahora usa `CI` (INT) como clave primaria
- `CredencialCivica` como campo único adicional
- `RolEnEstablecimiento` migrado a `RolEnCircuito`
- `RegistroVoto` incluye `VotoObservado` en lugar de `Autorizado`
- `Voto` sin campo `observado` (simplificado)

### 📊 **Nuevas Funcionalidades**
- Gestión completa de geografía electoral
- Sistema de políticos y asignaciones
- Estadísticas avanzadas de votación
- Validaciones robustas de datos
- Manejo de errores mejorado

### 🏗️ **Arquitectura Mejorada**
- Separación clara de responsabilidades
- Modelos especializados por entidad
- Validadores centralizados
- Configuración con variables de entorno
- Pool de conexiones MySQL optimizado

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage
```

## 📦 Tecnologías Utilizadas

- **Node.js** 18+
- **Express.js** 4.18+
- **MySQL2** 3.6+
- **CORS** para manejo de CORS
- **dotenv** para variables de entorno

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=adminadmin
DB_NAME=sistema_votacion
DB_PORT=3306
```

### Configuración de Base de Datos
```javascript
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'adminadmin',
    database: process.env.DB_NAME || 'sistema_votacion',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
```

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar que MySQL esté ejecutándose
sudo systemctl status mysql

# Verificar credenciales en .env
cat .env | grep DB_
```

### Error de Tablas No Encontradas
```bash
# Ejecutar script de creación de BD
mysql -u root -p < ../trabajo-obligatorio-bd2-mer/01_create_database.sql
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Desarrolladores

- Proyecto desarrollado para el curso de Base de Datos II
- Universidad de la República - Uruguay

## 🔗 Enlaces Relacionados

- [Frontend React](../mi-app-votacion/)
- [Scripts de Base de Datos](../trabajo-obligatorio-bd2-mer/)
- [Documentación Completa](./docs/)

---

**Versión:** 2.0.0  
**Última Actualización:** 2024  
**Estado:** ✅ Producción Ready

