// Configuración para el migrador de artículos
module.exports = {
  // Configuración de base de datos
  database: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://devsquaadsextinguidor:dFuBc8XttwIsU7pT@cluster0.zvnsihq.mongodb.net/',
    dbName: process.env.DB_NAME || 'extinguidor'
  },
  
  // Configuración del archivo Excel
  excel: {
    filePath: process.env.EXCEL_FILE_PATH || './xlsx/articulos_para_migrar.xlsx',
    sheetName: process.env.SHEET_NAME || 'prueba'
  },
  
  // Configuración de procesamiento
  processing: {
    batchSize: parseInt(process.env.BATCH_SIZE) || 100,
    logEvery: 500 // Log cada 500 registros procesados
  },
  
  // Mapeo de columnas Excel -> Modelo
  columnMapping: {
    'Código': 'codigo',
    'Grupo': 'grupo', 
    'Familia': 'familia',
    'Descripcion Articulo': 'descripcionArticulo',
    'Precio Venta': 'precioVenta'
  },
  
  // Validaciones
  validation: {
    requiredFields: ['codigo', 'grupo', 'familia', 'descripcionArticulo'],
    uniqueField: 'codigo' // Campo único para evitar duplicados
  }
}; 