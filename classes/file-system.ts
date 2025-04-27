import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem{
    constructor(){};

    guardarFileTemp(file: FileUpload, carpeta: string, usuario:string): Promise<string>{
        return new Promise( (resolve,reject)=>{
            const path =  this.crearCarpetaParte(carpeta, usuario)
            const nombreArchivo = this.generarNombre(file.name)
            const rutaCompleta = `${path}/${nombreArchivo.url}`

            file.mv(rutaCompleta, (err:any) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(nombreArchivo.url);
                }
            })
        })
    }

    eliminarFileTemp(nombreArchivo: string, carpeta: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const path = this.obtenerPathArchivo(nombreArchivo, carpeta);
            fs.unlink(path, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private generarNombre(nombreO:string){
        const nombreArr= nombreO.split('.')
        const extencion= nombreArr[nombreArr.length-1];
        const idUnico= uniqid();
        const nombres={
            name : nombreO ,
            url : `${idUnico}.${extencion}`,
            
        }

        return nombres
        
    }

   

    private crearCarpetaParte(carpeta:string, usuario: string){
        const pathParte= path.resolve(__dirname, '../uploads',carpeta)
        const pathParteT= path.resolve(__dirname, '../uploads',carpeta, usuario,)
        const pathParteTemp= pathParteT+ '/temp'

        const exsiste= fs.existsSync(pathParte)
        const exsistet= fs.existsSync(pathParteT)
        const exsistetemp= fs.existsSync(pathParteTemp)

        if(!exsiste){
            fs.mkdirSync(pathParte);
        }
        if(!exsistet){
            fs.mkdirSync(pathParteT);
        }
        if(!exsistetemp){  
            fs.mkdirSync(pathParteTemp);
        }

        return pathParteTemp;
    }

    pasarDeTempAParte( carpeta:string, usuario: string){

        const pathParte= path.resolve(__dirname, '../uploads',carpeta)
        const pathParteTemp= path.resolve(__dirname, '../uploads',carpeta,usuario,'temp')
      if(!fs.existsSync( pathParteTemp)){
        return[];
      }
      if(!fs.existsSync( pathParte)){
        fs.mkdirSync(pathParte);
      }

      const docTemp =  this.obtenerDocENTemp(carpeta , usuario)

      docTemp.forEach( doc =>{
        fs.renameSync(`${pathParteTemp}/${doc}`, `${pathParte}/${doc}`)      
    })
    return docTemp

    }

    private obtenerDocENTemp(carpeta:string,usuario: string){
        const pathParteTemp= path.resolve(__dirname, '../uploads',carpeta,usuario,'temp')
        return fs.readdirSync( pathParteTemp)|| [];
    }

    private obtenerPathArchivo(nombreArchivo: string, carpeta: string): string {
        return path.resolve(__dirname, `../uploads/${carpeta}/${nombreArchivo}`);
    }
}