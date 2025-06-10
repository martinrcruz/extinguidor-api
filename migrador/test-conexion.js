#!/usr/bin/env node

const mongoose = require('mongoose');
const colors = require('colors');
const config = require('./config');

async function testConnection() {
  try {
    console.log('🔍 PROBANDO CONEXIÓN A MONGODB'.cyan.bold);
    console.log('='.repeat(50));
    console.log(`🔌 URI: ${config.database.uri}`.blue);
    
    // Conectar a MongoDB
    console.log('⏳ Conectando...'.yellow);
    await mongoose.connect(config.database.uri);
    console.log('✅ Conexión exitosa'.green);
    
    // Verificar base de datos
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Base de datos: ${dbName}`.blue);
    
    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Colecciones encontradas: ${collections.length}`.blue);
    collections.forEach(col => {
      console.log(`  - ${col.name}`.gray);
    });
    
    // Verificar modelo de artículos
    const articuloSchema = new mongoose.Schema({
      codigo: { type: String, required: true, unique: true },
      grupo: { type: String, required: true },
      familia: { type: String, required: true },
      descripcionArticulo: { type: String, required: true },
      precioVenta: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      eliminado: { type: Boolean, default: false }
    });
    
    const Articulo = mongoose.model('TestArticulo', articuloSchema);
    
    // Contar artículos existentes
    const count = await Articulo.countDocuments();
    console.log(`📈 Artículos existentes: ${count}`.green);
    
    // Verificar si hay duplicados
    const duplicates = await Articulo.aggregate([
      { $group: { _id: '$codigo', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    if (duplicates.length > 0) {
      console.log(`⚠️  Códigos duplicados encontrados: ${duplicates.length}`.yellow);
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`  - ${dup._id}: ${dup.count} veces`.yellow);
      });
    } else {
      console.log('✅ No hay códigos duplicados'.green);
    }
    
    console.log('\n✅ PRUEBA COMPLETADA EXITOSAMENTE'.green.bold);
    
  } catch (error) {
    console.error('❌ ERROR:'.red.bold, error.message);
    if (error.code) {
      console.error(`🔍 Código de error: ${error.code}`.red);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB'.cyan);
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = testConnection; 