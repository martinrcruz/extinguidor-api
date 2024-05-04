export interface FileUpload {
    name: string;
    data?:any;
    encoding?: string;
    tempFIlePath?: string;
    truncated?: boolean;
    mimetype?:string;
    md5? : string;
    size?: string;

    mv:Function;
          
}