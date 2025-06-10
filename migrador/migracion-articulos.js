#!/usr/bin/env node

const mongoose = require('mongoose');
const XLSX = require('xlsx');
const colors = require('colors');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Modelo de Artículo (replicado del backend)
const articuloSchema = new mongoose.Schema({
  cantidad: { type: Number, required: true },
  codigo: { type: String, required: true, unique: true },
  grupo: { type: String, required: true },
  familia: { type: String, required: true },
  descripcionArticulo: { type: String, required: true },
  precioVenta: { type: Number, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  eliminado: { type: Boolean, default: false }
}, {
  timestamps: { 
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
  }
});

// Crear índice único para código
articuloSchema.index({ codigo: 1 }, { unique: true });

const Articulo = mongoose.model('Articulo', articuloSchema);

class MigradorArticulos {
  constructor() {
    this.stats = {
      totalLeidos: 0,
      procesados: 0,
      insertados: 0,
      duplicados: 0,
      errores: 0,
      inicioTiempo: Date.now()
    };
    this.articulosExistentes = new Set();
  }

  async conectarDB() {
    try {
      console.log('🔌 Conectando a MongoDB...'.cyan);
      await mongoose.connect(config.database.uri);
      console.log('✅ Conexión exitosa a MongoDB'.green);
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:'.red, error.message);
      process.exit(1);
    }
  }

  async cargarArticulosExistentes() {
    try {
      console.log('📋 Cargando artículos existentes...'.cyan);
      const codigos = await Articulo.distinct('codigo', { eliminado: { $ne: true } });
      this.articulosExistentes = new Set(codigos);
      console.log(`✅ ${codigos.length} códigos de artículos cargados en memoria`.green);
    } catch (error) {
      console.error('❌ Error cargando artículos existentes:'.red, error.message);
      throw error;
    }
  }

  leerArchivoExcel() {
    try {
      const rutaArchivo = path.resolve(config.excel.filePath);
      
      if (!fs.existsSync(rutaArchivo)) {
        throw new Error(`El archivo ${rutaArchivo} no existe`);
      }

      console.log(`📖 Leyendo archivo Excel: ${rutaArchivo}`.cyan);
      
      const workbook = XLSX.readFile(rutaArchivo);
      const sheetName = config.excel.sheetName;
      
      if (!workbook.Sheets[sheetName]) {
        throw new Error(`La hoja "${sheetName}" no existe en el archivo`);
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      this.stats.totalLeidos = data.length;
      console.log(`✅ ${data.length} filas leídas del archivo Excel`.green);
      
      return data;
    } catch (error) {
      console.error('❌ Error leyendo archivo Excel:'.red, error.message);
      throw error;
    }
  }

  validarYMapearArticulo(filaExcel, numeroFila) {
    try {
      const articulo = {};
      
      // Mapear columnas según configuración
      for (const [columnaExcel, campoModelo] of Object.entries(config.columnMapping)) {
        const valor = filaExcel[columnaExcel];
        
        if (valor === undefined || valor === null || valor === '') {
          if (config.validation.requiredFields.includes(campoModelo) && campoModelo !== 'precioVenta') {
            throw new Error(`Campo requerido "${columnaExcel}" vacío en fila ${numeroFila}`);
          }
          continue;
        }

        // Conversiones especiales
        if (campoModelo === 'precioVenta') {
          // Si el precio está vacío, asignar 0 por defecto
          if (valor === undefined || valor === null || valor === '' || 
              (typeof valor === 'string' && valor.trim() === '')) {
            articulo[campoModelo] = 0;
          } else {
            const precio = parseFloat(valor);
            if (isNaN(precio)) {
              throw new Error(`Precio inválido "${valor}" en fila ${numeroFila}`);
            }
            articulo[campoModelo] = precio;
          }
        } else if (campoModelo === 'codigo') {
          articulo[campoModelo] = String(valor).trim();
        } else {
          articulo[campoModelo] = String(valor).trim();
        }
      }

      // Agregar campos por defecto
      articulo.cantidad = 0; // Cantidad inicial
      articulo.eliminado = false;

      // Validar duplicados
      if (this.articulosExistentes.has(articulo.codigo)) {
        return { valido: false, razon: 'duplicado', articulo };
      }

      return { valido: true, articulo };
    } catch (error) {
      return { valido: false, razon: 'error', error: error.message, articulo: null };
    }
  }

  async procesarPorLotes(articulos) {
    const lotes = [];
    const tamanoLote = config.processing.batchSize;

    // Dividir en lotes
    for (let i = 0; i < articulos.length; i += tamanoLote) {
      lotes.push(articulos.slice(i, i + tamanoLote));
    }

    console.log(`📦 Procesando ${lotes.length} lotes de ${tamanoLote} artículos cada uno`.cyan);

    for (let i = 0; i < lotes.length; i++) {
      try {
        const lote = lotes[i];
        await Articulo.insertMany(lote, { ordered: false });
        this.stats.insertados += lote.length;
        
        // Agregar códigos a memoria para evitar duplicados en el mismo archivo
        lote.forEach(art => this.articulosExistentes.add(art.codigo));
        
        console.log(`✅ Lote ${i + 1}/${lotes.length} procesado (${lote.length} artículos)`.green);
        
        // Log de progreso cada N registros
        if (this.stats.insertados % config.processing.logEvery === 0) {
          console.log(`📊 Progreso: ${this.stats.insertados}/${this.stats.totalLeidos} artículos procesados`.blue);
        }
      } catch (error) {
        const loteActual = lotes[i];
        // Manejo de errores por duplicados en el lote
        if (error.code === 11000) {
          console.log(`⚠️  Algunos duplicados encontrados en lote ${i + 1}`.yellow);
          // Intentar insertar de uno en uno para manejar duplicados
          for (const articulo of loteActual) {
            try {
              await Articulo.create(articulo);
              this.stats.insertados++;
              this.articulosExistentes.add(articulo.codigo);
            } catch (singleError) {
              if (singleError.code === 11000) {
                this.stats.duplicados++;
              } else {
                this.stats.errores++;
                console.error(`❌ Error insertando artículo ${articulo.codigo}:`.red, singleError.message);
              }
            }
          }
        } else {
          console.error(`❌ Error en lote ${i + 1}:`.red, error.message);
          this.stats.errores++;
        }
      }
    }
  }

  async migrar() {
    try {
      console.log('🚀 INICIANDO MIGRACIÓN DE ARTÍCULOS'.rainbow);
      console.log('='.repeat(50));

      // 1. Conectar a DB
      await this.conectarDB();

      // 2. Cargar artículos existentes
      await this.cargarArticulosExistentes();

      // 3. Leer archivo Excel
      const datosExcel = this.leerArchivoExcel();

      // 4. Procesar y validar datos
      console.log('🔄 Procesando y validando datos...'.cyan);
      const articulosValidos = [];
      
      for (let i = 0; i < datosExcel.length; i++) {
        const resultado = this.validarYMapearArticulo(datosExcel[i], i + 2); // +2 porque empezamos en fila 2
        
        this.stats.procesados++;
        
        if (resultado.valido) {
          articulosValidos.push(resultado.articulo);
        } else if (resultado.razon === 'duplicado') {
          this.stats.duplicados++;
        } else if (resultado.razon === 'error') {
          this.stats.errores++;
          console.error(`⚠️  Fila ${i + 2}: ${resultado.error}`.yellow);
        }
      }

      console.log(`✅ Validación completada: ${articulosValidos.length} artículos válidos`.green);

      // 5. Insertar por lotes
      if (articulosValidos.length > 0) {
        await this.procesarPorLotes(articulosValidos);
      }

      // 6. Mostrar estadísticas finales
      this.mostrarEstadisticas();
      
    } catch (error) {
      console.error('❌ Error en migración:'.red, error.message);
      console.error(error.stack);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB'.cyan);
    }
  }

  mostrarEstadisticas() {
    const tiempoTotal = (Date.now() - this.stats.inicioTiempo) / 1000;
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 ESTADÍSTICAS FINALES'.rainbow);
    console.log('='.repeat(50));
    console.log(`Total leídos:       ${this.stats.totalLeidos}`.blue);
    console.log(`Procesados:         ${this.stats.procesados}`.blue);
    console.log(`Insertados:         ${this.stats.insertados}`.green);
    console.log(`Duplicados:         ${this.stats.duplicados}`.yellow);
    console.log(`Errores:           ${this.stats.errores}`.red);
    console.log(`Tiempo total:      ${tiempoTotal.toFixed(2)}s`.cyan);
    console.log(`Velocidad:         ${(this.stats.procesados / tiempoTotal).toFixed(2)} registros/s`.cyan);
    console.log('='.repeat(50));
    
    if (this.stats.insertados > 0) {
      console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE'.green.bold);
    } else {
      console.log('⚠️  NO SE INSERTARON NUEVOS ARTÍCULOS'.yellow.bold);
    }
  }
}

// Ejecutar migración si se ejecuta directamente
if (require.main === module) {
  const migrador = new MigradorArticulos();
  migrador.migrar().catch(error => {
    console.error('💥 Error fatal en migración:'.red.bold, error.message);
    process.exit(1);
  });
}

module.exports = MigradorArticulos; 