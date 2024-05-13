"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    guardarFileTemp(file, carpeta, usuario) {
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaParte(carpeta, usuario);
            const nombres = this.generarNombre(file.name);
            const nombreArchivo = file.mv(`${path}/${nombres.url}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(nombres);
                }
            });
        });
    }
    generarNombre(nombreO) {
        const nombreArr = nombreO.split('.');
        const extencion = nombreArr[nombreArr.length - 1];
        const idUnico = (0, uniqid_1.default)();
        const nombres = {
            name: nombreO,
            url: `${idUnico}.${extencion}`,
        };
        return nombres;
    }
    crearCarpetaParte(carpeta, usuario) {
        const pathParte = path_1.default.resolve(__dirname, '../uploads', carpeta);
        const pathParteT = path_1.default.resolve(__dirname, '../uploads', carpeta, usuario);
        const pathParteTemp = pathParteT + '/temp';
        const exsiste = fs_1.default.existsSync(pathParte);
        const exsistet = fs_1.default.existsSync(pathParteT);
        const exsistetemp = fs_1.default.existsSync(pathParteTemp);
        if (!exsiste) {
            fs_1.default.mkdirSync(pathParte);
        }
        if (!exsistet) {
            fs_1.default.mkdirSync(pathParteT);
        }
        if (!exsistetemp) {
            fs_1.default.mkdirSync(pathParteTemp);
        }
        return pathParteTemp;
    }
    pasarDeTempAParte(carpeta, usuario) {
        const pathParte = path_1.default.resolve(__dirname, '../uploads', carpeta);
        const pathParteTemp = path_1.default.resolve(__dirname, '../uploads', carpeta, usuario, 'temp');
        if (!fs_1.default.existsSync(pathParteTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathParte)) {
            fs_1.default.mkdirSync(pathParte);
        }
        const docTemp = this.obtenerDocENTemp(carpeta, usuario);
        docTemp.forEach(doc => {
            fs_1.default.renameSync(`${pathParteTemp}/${doc}`, `${pathParte}/${doc}`);
        });
        return docTemp;
    }
    obtenerDocENTemp(carpeta, usuario) {
        const pathParteTemp = path_1.default.resolve(__dirname, '../uploads', carpeta, usuario, 'temp');
        return fs_1.default.readdirSync(pathParteTemp) || [];
    }
}
exports.default = FileSystem;
