import jwt from 'jsonwebtoken'

export default class Token {
   
    private static seed: string = 'wfdvsdvsdvsdf945688456848vfdvfdgdfg455ergdfdfv//%%__---sdvdvdfv3t3';
    private static caducidad: string = '5d'
 
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

