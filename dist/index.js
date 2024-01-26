"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const userR_1 = __importDefault(require("./routes/userR"));
const vehicleR_1 = __importDefault(require("./routes/vehicleR"));
const server = new server_1.default();
//body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//cors
server.app.use((0, cors_1.default)({ origin: '*',
    credentials: true,
    allowedHeaders: 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-token, *',
    methods: 'GET, POST, OPTIONS, PUT, DELETE',
}));
if (process.env.CONFIG_dbNube) {
    mongoose_1.default.connect(process.env.CONFIG_dbNube)
        .then(() => console.log('base de datos online'))
        .catch((err) => console.log(err));
}
else {
    console.log('no se conecto a la bd');
}
;
//Rutas
server.app.use('/user', userR_1.default);
server.app.use('/vehicle', vehicleR_1.default);
//levantar server
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
