# Migrador de Artículos

Script para migrar artículos masivamente desde archivos Excel (xlsx) a MongoDB.

## 📋 Requisitos

- Node.js 14+
- MongoDB ejecutándose
- Archivo Excel con las columnas especificadas

## 🔧 Instalación

1. Navegar al directorio del migrador:
```bash
cd back-v2/migrador
```

2. Instalar dependencias:
```bash
npm install
```

## 📊 Formato del Archivo Excel

El archivo Excel debe tener las siguientes columnas (exactamente con estos nombres):

| Columna | Descripción | Tipo | Requerido |
|---------|-------------|------|-----------|
| Código | Código único del artículo | Texto | ✅ |
| Grupo | Grupo al que pertenece | Texto | ✅ |
| Familia | Familia del artículo | Texto | ✅ |
| Descripcion Articulo | Descripción detallada | Texto | ✅ |
| Precio Venta | Precio de venta (si está vacío se asigna 0) | Número | ⚠️ |

### Ejemplo:
```
Código    | Grupo        | Familia   | Descripcion Articulo           | Precio Venta
EXT001    | Extintores   | CO2       | Extintor de CO2 5kg           | 89.50
EXT002    | Extintores   | Polvo     | Extintor de Polvo ABC 6kg     | 45.75
...
```

## 🚀 Uso

### Método 1: Configuración por defecto

1. Colocar el archivo Excel como `articulos.xlsx` en la carpeta `migrador`
2. Ejecutar:
```bash
npm run migrate
```

### Método 2: Configuración personalizada

1. Editar el archivo `config.js` con tus configuraciones:
```javascript
module.exports = {
  database: {
    uri: 'mongodb://127.0.0.1:27017/tu_base_datos'
  },
  excel: {
    filePath: './mi_archivo.xlsx',
    sheetName: 'MiHoja'
  }
};
```

2. Ejecutar:
```bash
node migracion-articulos.js
```

### Método 3: Variables de entorno

```bash
MONGODB_URI=mongodb://localhost:27017/extinguidor \
EXCEL_FILE_PATH=./mis_articulos.xlsx \
BATCH_SIZE=50 \
npm run migrate
```

## ⚙️ Configuración

### Variables de entorno disponibles:

- `MONGODB_URI`: URI de conexión a MongoDB
- `DB_NAME`: Nombre de la base de datos
- `EXCEL_FILE_PATH`: Ruta al archivo Excel
- `SHEET_NAME`: Nombre de la hoja Excel
- `BATCH_SIZE`: Tamaño del lote para procesamiento (por defecto: 100)

### Configuración en `config.js`:

```javascript
{
  database: {
    uri: 'mongodb://127.0.0.1:27017/extinguidor'
  },
  excel: {
    filePath: './articulos.xlsx',
    sheetName: 'Sheet1'
  },
  processing: {
    batchSize: 100,      // Procesamiento por lotes
    logEvery: 500        // Log cada N registros
  }
}
```

## 🔍 Validaciones

El script realiza las siguientes validaciones:

1. **Campos requeridos**: Verifica que todos los campos obligatorios estén presentes
2. **Duplicados**: Evita insertar artículos con códigos ya existentes
3. **Tipos de datos**: Valida que el precio sea numérico (si está presente)
4. **Formato**: Limpia espacios en blanco y valida formato
5. **Precio por defecto**: Si el campo "Precio Venta" está vacío, se asigna automáticamente el valor 0

## 📊 Estadísticas

Al finalizar, el script muestra:

- Total de registros leídos
- Registros procesados exitosamente
- Artículos insertados
- Duplicados encontrados
- Errores de validación
- Tiempo total de procesamiento
- Velocidad de procesamiento

## 🔧 Optimizaciones para grandes volúmenes

Para archivos de 6,000+ registros:

1. **Procesamiento por lotes**: Configura `BATCH_SIZE` según tu hardware (100-500)
2. **Memoria**: El script carga códigos existentes en memoria para validación rápida
3. **Logs progresivos**: Muestra progreso cada 500 registros por defecto

## ❗ Solución de problemas

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
mongosh --eval "db.runCommand('ping')"
```

### Error de archivo no encontrado
```bash
# Verificar ruta del archivo
ls -la ./articulos.xlsx
```

### Error de memoria (archivos muy grandes)
```bash
# Reducir el tamaño del lote
BATCH_SIZE=50 npm run migrate
```

### Columnas no encontradas
- Verificar que los nombres de las columnas coincidan exactamente
- Revisar que no haya espacios adicionales en los headers

## 🔐 Seguridad

- El script NO elimina datos existentes
- Utiliza validación de duplicados por código
- Maneja errores de forma segura sin interrumpir todo el proceso
- Realiza rollback automático en caso de errores críticos

## 📝 Logs

Los logs incluyen:
- 🔌 Conexión a base de datos
- 📖 Lectura del archivo Excel
- 📋 Carga de artículos existentes
- 🔄 Progreso de procesamiento
- ✅ Inserción exitosa por lotes
- ⚠️ Advertencias de duplicados
- ❌ Errores de validación
- 📊 Estadísticas finales

Ejemplo de salida:
```
🚀 INICIANDO MIGRACIÓN DE ARTÍCULOS
🔌 Conectando a MongoDB...
✅ Conexión exitosa a MongoDB
📋 Cargando artículos existentes...
✅ 1234 códigos de artículos cargados en memoria
📖 Leyendo archivo Excel: ./articulos.xlsx
✅ 6000 filas leídas del archivo Excel
🔄 Procesando y validando datos...
✅ Validación completada: 5890 artículos válidos
📦 Procesando 59 lotes de 100 artículos cada uno
✅ Lote 1/59 procesado (100 artículos)
...
📊 ESTADÍSTICAS FINALES
Total leídos:       6000
Procesados:         6000
Insertados:         5890
Duplicados:         110
Errores:           0
Tiempo total:      45.32s
Velocidad:         132.39 registros/s
✅ MIGRACIÓN COMPLETADA EXITOSAMENTE
``` 