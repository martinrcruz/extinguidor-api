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
            console.log(path);
            console.log(nombres);
            file.mv(`${path}/${nombres.nuevo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombre(nombreO) {
        const nombreArr = nombreO.split('.');
        const extencion = nombreArr[nombreArr.length - 1];
        const idUnico = (0, uniqid_1.default)();
        const nombres = {
            original: nombreO,
            nuevo: `${idUnico}.${extencion}`
        };
        return nombres;
    }
    crearCarpetaParte(carpeta, usuario) {
        const pathParte = path_1.default.resolve(__dirname, '../uploads', carpeta);
        const pathParteT = path_1.default.resolve(__dirname, '../uploads', carpeta, usuario);
        const pathParteTemp = pathParteT + '/temp';
        const exsiste = fs_1.default.existsSync(pathParte);
        if (!exsiste) {
            fs_1.default.mkdirSync(pathParte);
            fs_1.default.mkdirSync(pathParteT);
            fs_1.default.mkdirSync(pathParteTemp);
        }
        return pathParteTemp;
    }
}
exports.default = FileSystem;
