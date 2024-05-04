import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem{
    constructor(){};

    guardarFileTemp(file: FileUpload, carpeta: string, usuario:string){

        return new Promise( (resolve,reject)=>{
            const path =  this.crearCarpetaParte(carpeta, usuario)
            const nombres = this.generarNombre(file.name)

            console.log(path)
            console.log (nombres)

            

        const nombreArchivo= file.mv(`${path}/${nombres.nuevo}`, (err:any) =>{
            if(err){
                reject(err);
            }else{
                resolve(nombreArchivo);
            }
        })

        })
        
    }

    private generarNombre(nombreO:string){
        const nombreArr= nombreO.split('.')
        const extencion= nombreArr[nombreArr.length-1];
        const idUnico= uniqid();
        const nombres={
            original : nombreO ,
            nuevo : `${idUnico}.${extencion}`
        }

        return nombres
        
    }

   

    private crearCarpetaParte(carpeta:string, usuario: string){
        const pathParte= path.resolve(__dirname, '../uploads',carpeta)
        const pathParteT= path.resolve(__dirname, '../uploads',carpeta,usuario)
        const pathParteTemp= pathParteT+ '/temp'

        const exsiste= fs.existsSync(pathParte)

        if(!exsiste){
            fs.mkdirSync(pathParte);
            fs.mkdirSync(pathParteT);
            fs.mkdirSync(pathParteTemp);
        }
        return pathParteTemp;
    }
}