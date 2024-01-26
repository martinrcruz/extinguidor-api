import jwt from 'jsonwebtoken'

export default class Token {
   
    private static seed: string = process.env.CONFIG_SECRET_TOKEN ||'';
    private static caducidad: string = '30d'
 
    constructor() {}

    static getJwtToken( payload: any ): string {
       return jwt.sign({
           user: payload
       }, this.seed, { expiresIn: this.caducidad });
    }

    static comprobarToken( Token: string ) {
        return new Promise( (resolve, reject) => {
            jwt.verify( Token, this.seed, (err, decoded ) => {
                if( err ) {
                    reject();
                }else {
                    resolve( decoded );
                }
            } )
        });
    }
}

