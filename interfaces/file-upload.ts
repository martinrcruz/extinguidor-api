export interface FileUpload {
    name: string;
    encoding: string;
    mimetype: string;
    data: Buffer;
    size: number;
    tempFilePath: string;
    truncated: boolean;
    md5: string;
    mv: (path: string, callback: (error: any) => void) => void;
}