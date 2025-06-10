#!/usr/bin/env node

const XLSX = require('xlsx');
const colors = require('colors');
const path = require('path');
const fs = require('fs');
const config = require('./config');

class ValidadorExcel {
  constructor() {
    this.errores = [];
    this.advertencias = [];
    this.estadisticas = {
      totalFilas: 0,
      filasValidas: 0,
      filasConErrores: 0,
      duplicados: 0
    };
  }

  validarArchivo() {
    try {
      const rutaArchivo = path.resolve(config.excel.filePath);
      
      console.log('🔍 VALIDADOR DE ARCHIVO EXCEL'.rainbow);
      console.log('='.repeat(50));
      console.log(`📁 Archivo: ${rutaArchivo}`.cyan);

      // 1. Verificar existencia del archivo
      if (!fs.existsSync(rutaArchivo)) {
        this.errores.push(`❌ El archivo ${rutaArchivo} no existe`);
        return this.mostrarResultados();
      }

      // 2. Leer archivo Excel
      console.log('📖 Leyendo archivo Excel...'.cyan);
      const workbook = XLSX.readFile(rutaArchivo);
      const sheetName = config.excel.sheetName;

      if (!workbook.Sheets[sheetName]) {
        this.errores.push(`❌ La hoja "${sheetName}" no existe en el archivo`);
        console.log(`📋 Hojas disponibles: ${Object.keys(workbook.Sheets).join(', ')}`.yellow);
        return this.mostrarResultados();
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      this.estadisticas.totalFilas = data.length;
      console.log(`✅ ${data.length} filas leídas`.green);

      // 3. Validar estructura de columnas
      this.validarColumnas(data);

      // 4. Validar contenido de las filas
      this.validarContenido(data);

      // 5. Mostrar resultados
      this.mostrarResultados();

    } catch (error) {
      console.error('💥 Error crítico:'.red.bold, error.message);
    }
  }

  validarColumnas(data) {
    if (data.length === 0) {
      this.errores.push('❌ El archivo no contiene datos');
      return;
    }

    const columnasRequeridas = Object.keys(config.columnMapping);
    const columnasEncontradas = Object.keys(data[0]);

    console.log('\n🔍 Validando estructura de columnas...'.cyan);
    console.log(`📋 Columnas requeridas: ${columnasRequeridas.join(', ')}`);
    console.log(`📋 Columnas encontradas: ${columnasEncontradas.join(', ')}`);

    // Verificar columnas faltantes
    const faltantes = columnasRequeridas.filter(col => !columnasEncontradas.includes(col));
    if (faltantes.length > 0) {
      this.errores.push(`❌ Columnas faltantes: ${faltantes.join(', ')}`);
    }

    // Verificar columnas adicionales
    const adicionales = columnasEncontradas.filter(col => !columnasRequeridas.includes(col));
    if (adicionales.length > 0) {
      this.advertencias.push(`⚠️  Columnas adicionales encontradas (serán ignoradas): ${adicionales.join(', ')}`);
    }
  }

  validarContenido(data) {
    console.log('\n🔍 Validando contenido de las filas...'.cyan);
    
    const codigosVistos = new Set();
    let filaActual = 2; // Empezar en fila 2 (después del header)

    for (const fila of data) {
      const erroresFila = [];

      // Validar campos requeridos
      for (const [columnaExcel, campoModelo] of Object.entries(config.columnMapping)) {
        const valor = fila[columnaExcel];
        
        // El precio puede estar vacío (se asignará 0 por defecto)
        if (valor === undefined || valor === null || valor === '' || 
            (typeof valor === 'string' && valor.trim() === '')) {
          if (config.validation.requiredFields.includes(campoModelo) && campoModelo !== 'precioVenta') {
            erroresFila.push(`Campo "${columnaExcel}" vacío`);
          }
        }
      }

      // Validar precio (solo si no está vacío)
      if (fila['Precio Venta'] !== undefined && fila['Precio Venta'] !== null && 
          fila['Precio Venta'] !== '' && !(typeof fila['Precio Venta'] === 'string' && fila['Precio Venta'].trim() === '')) {
        const precio = parseFloat(fila['Precio Venta']);
        if (isNaN(precio) || precio < 0) {
          erroresFila.push(`Precio inválido: "${fila['Precio Venta']}"`);
        }
      }

      // Validar código único
      const codigo = fila['Código'];
      if (codigo) {
        const codigoLimpio = String(codigo).trim();
        if (codigosVistos.has(codigoLimpio)) {
          erroresFila.push(`Código duplicado: "${codigoLimpio}"`);
          this.estadisticas.duplicados++;
        } else {
          codigosVistos.add(codigoLimpio);
        }
      }

      // Registrar errores de la fila
      if (erroresFila.length > 0) {
        this.estadisticas.filasConErrores++;
        this.errores.push(`❌ Fila ${filaActual}: ${erroresFila.join(', ')}`);
      } else {
        this.estadisticas.filasValidas++;
      }

      filaActual++;
    }
  }

  mostrarResultados() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESULTADOS DE VALIDACIÓN'.rainbow);
    console.log('='.repeat(50));

    // Estadísticas
    console.log(`📈 Total de filas:          ${this.estadisticas.totalFilas}`.blue);
    console.log(`✅ Filas válidas:           ${this.estadisticas.filasValidas}`.green);
    console.log(`❌ Filas con errores:       ${this.estadisticas.filasConErrores}`.red);
    console.log(`🔄 Duplicados en archivo:   ${this.estadisticas.duplicados}`.yellow);

    // Advertencias
    if (this.advertencias.length > 0) {
      console.log('\n⚠️  ADVERTENCIAS:'.yellow.bold);
      this.advertencias.forEach(adv => console.log(adv));
    }

    // Errores
    if (this.errores.length > 0) {
      console.log('\n❌ ERRORES ENCONTRADOS:'.red.bold);
      
      // Mostrar solo los primeros 10 errores para no saturar la consola
      const erroresAMostrar = this.errores.slice(0, 10);
      erroresAMostrar.forEach(error => console.log(error));
      
      if (this.errores.length > 10) {
        console.log(`... y ${this.errores.length - 10} errores más`.red);
      }

      console.log('\n❌ VALIDACIÓN FALLIDA - CORRIGE LOS ERRORES ANTES DE MIGRAR'.red.bold);
      return false;
    } else {
      console.log('\n✅ VALIDACIÓN EXITOSA - ARCHIVO LISTO PARA MIGRACIÓN'.green.bold);
      return true;
    }
  }

  generarReporte() {
    const fecha = new Date().toISOString().split('T')[0];
    const nombreReporte = `reporte-validacion-${fecha}.json`;
    
    const reporte = {
      fecha: new Date().toISOString(),
      archivo: config.excel.filePath,
      estadisticas: this.estadisticas,
      advertencias: this.advertencias,
      errores: this.errores
    };

    fs.writeFileSync(nombreReporte, JSON.stringify(reporte, null, 2));
    console.log(`📄 Reporte guardado: ${nombreReporte}`.cyan);
  }
}

// Ejecutar validación si se ejecuta directamente
if (require.main === module) {
  const validador = new ValidadorExcel();
  const esValido = validador.validarArchivo();
  
  // Opción para generar reporte
  if (process.argv.includes('--reporte')) {
    validador.generarReporte();
  }
  
  process.exit(esValido ? 0 : 1);
}

module.exports = ValidadorExcel; 