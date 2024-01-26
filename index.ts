import Server from "./classes/server";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userR";
import vehicleRoutes from "./routes/vehicleR";


const server = new Server();

//body parser
server.app.use( bodyParser.urlencoded({ extended: true}) );
server.app.use( bodyParser.json() );
//cors
server.app.use( cors ( { origin: '*',
                           credentials: true,
                           allowedHeaders:'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-token, *',
                           methods: 'GET, POST, OPTIONS, PUT, DELETE',
                        } ) );

if (process.env.CONFIG_dbNube) {
    mongoose.connect(process.env.CONFIG_dbNube)
        .then(() => console.log('base de datos online'))

        .catch((err) => console.log(err));
}else{
    console.log('no se conecto a la bd')
};
//Rutas
 server.app.use('/user', userRoutes);
 server.app.use('/vehicle', vehicleRoutes);

//levantar server
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});
