import Server from "./classes/server";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/userR";
import vehicleRoutes from "./routes/vehicleR";
import rutaRoutes from "./routes/rutaR";
import customerRoutes from "./routes/customersR";
import zoneRoutes from "./routes/zoneR";
import parteRoutes from "./routes/parteR";
import rutaNRoutes from "./routes/rutaNR";
import materialRouter from "./routes/materialR";
import materialParteRouter from "./routes/materialparteR";
import facturacionRoutes from "./routes/facturacionR";


const server = new Server();

//body parser
server.app.use( bodyParser.urlencoded({ extended: true}) );
server.app.use( bodyParser.json() );

//fileupload
server.app.use(fileUpload({useTempFiles: true})); 
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
 server.app.use('/facturacion', facturacionRoutes);
 server.app.use('/vehicle', vehicleRoutes);
 server.app.use('/rutas', rutaRoutes);
 server.app.use('/rutasn', rutaNRoutes)
 server.app.use('/customers', customerRoutes);
 server.app.use('/zone', zoneRoutes);
 server.app.use('/partes', parteRoutes);
 server.app.use('/material', materialRouter);
 server.app.use('/materialparte', materialParteRouter);

//levantar server
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});
