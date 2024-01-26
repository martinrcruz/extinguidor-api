"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pais_model_1 = require("../models/lugares/pais.model");
const provincia_model_1 = require("../models/lugares/provincia.model");
const ciudad_model_1 = require("../models/lugares/ciudad.model");
const seedersRoutes = (0, express_1.Router)();
const paises = [
    { nombre: 'Afganistán' },
    { nombre: 'Albania' },
    { nombre: 'Alemania' },
    { nombre: 'Andorra' },
    { nombre: 'Angola' },
    { nombre: 'Antigua y Barbuda' },
    { nombre: 'Antillas Holandesas' },
    { nombre: 'Arabia Saudí' },
    { nombre: 'Argelia' },
    { nombre: 'Argentina' },
    { nombre: 'Armenia' },
    { nombre: 'Aruba' },
    { nombre: 'Australia' },
    { nombre: 'Austria' },
    { nombre: 'Azerbaiyán' },
    { nombre: 'Bahamas' },
    { nombre: 'Bahrein' },
    { nombre: 'Bangladés' },
    { nombre: 'Barbados' },
    { nombre: 'Bélgica' },
    { nombre: 'Belice' },
    { nombre: 'Benín' },
    { nombre: 'Bermudas' },
    { nombre: 'Bielorrusia' },
    { nombre: 'Bolivia' },
    { nombre: 'Botsuana' },
    { nombre: 'Bosnia' },
    { nombre: 'Brasil' },
    { nombre: 'Brunei' },
    { nombre: 'Bulgaria' },
    { nombre: 'Burkina Faso' },
    { nombre: 'Burundi' },
    { nombre: 'Bután' },
    { nombre: 'Cabo Verde' },
    { nombre: 'Camboya' },
    { nombre: 'Camerún' },
    { nombre: 'Canadá' },
    { nombre: 'Catar' },
    { nombre: 'Chad' },
    { nombre: 'Chile' },
    { nombre: 'China' },
    { nombre: 'Chipre' },
    { nombre: 'Colombia' },
    { nombre: 'Comoras' },
    { nombre: 'Congo' },
    { nombre: 'Corea del Norte' },
    { nombre: 'Corea del Sur' },
    { nombre: 'Costa de Marfil' },
    { nombre: 'Costa Rica' },
    { nombre: 'Croacia' },
    { nombre: 'Cuba' },
    { nombre: 'Dinamarca' },
    { nombre: 'Dominica' },
    { nombre: 'Ecuador' },
    { nombre: 'Egipto' },
    { nombre: 'El Salvador' },
    { nombre: 'Emiratos Árabes Unidos' },
    { nombre: 'Eritrea' },
    { nombre: 'Eslovaquia' },
    { nombre: 'Eslovenia' },
    { nombre: 'España' },
    { nombre: 'Estados Unidos de América' },
    { nombre: 'Estonia' },
    { nombre: 'Etiopía' },
    { nombre: 'Fiyi' },
    { nombre: 'Filipinas' },
    { nombre: 'Finlandia' },
    { nombre: 'Francia' },
    { nombre: 'Gabón' },
    { nombre: 'Gambia' },
    { nombre: 'Georgia' },
    { nombre: 'Ghana' },
    { nombre: 'Grecia' },
    { nombre: 'Guam' },
    { nombre: 'Guatemala' },
    { nombre: 'Guayana Francesa' },
    { nombre: 'Guinea-Bissau' },
    { nombre: 'Guinea Ecuatorial' },
    { nombre: 'Guinea' },
    { nombre: 'Guyana' },
    { nombre: 'Granada' },
    { nombre: 'Haití' },
    { nombre: 'Honduras' },
    { nombre: 'Hong Kong' },
    { nombre: 'Hungría' },
    { nombre: 'Holanda' },
    { nombre: 'India' },
    { nombre: 'Indonesia' },
    { nombre: 'Irak' },
    { nombre: 'Irán' },
    { nombre: 'Irlanda' },
    { nombre: 'Islandia' },
    { nombre: 'Islas Caimán' },
    { nombre: 'Islas Marshall' },
    { nombre: 'Islas Pitcairn' },
    { nombre: 'Islas Salomón' },
    { nombre: 'Israel' },
    { nombre: 'Italia' },
    { nombre: 'Jamaica' },
    { nombre: 'Japón' },
    { nombre: 'Jordania' },
    { nombre: 'Kazajstán' },
    { nombre: 'Kenia' },
    { nombre: 'Kirguistán' },
    { nombre: 'Kiribati' },
    { nombre: 'Kósovo' },
    { nombre: 'Kuwait' },
    { nombre: 'Laos' },
    { nombre: 'Lesotho' },
    { nombre: 'Letonia' },
    { nombre: 'Líbano' },
    { nombre: 'Liberia' },
    { nombre: 'Libia' },
    { nombre: 'Liechtenstein' },
    { nombre: 'Lituania' },
    { nombre: 'Luxemburgo' },
    { nombre: 'Macedonia' },
    { nombre: 'Madagascar' },
    { nombre: 'Malasia' },
    { nombre: 'Malawi' },
    { nombre: 'Maldivas' },
    { nombre: 'Malí' },
    { nombre: 'Malta' },
    { nombre: 'Marianas del Norte' },
    { nombre: 'Marruecos' },
    { nombre: 'Mauricio' },
    { nombre: 'Mauritania' },
    { nombre: 'México' },
    { nombre: 'Micronesia' },
    { nombre: 'Mónaco' },
    { nombre: 'Moldavia' },
    { nombre: 'Mongolia' },
    { nombre: 'Montenegro' },
    { nombre: 'Mozambique' },
    { nombre: 'Myanmar' },
    { nombre: 'Namibia' },
    { nombre: 'Nauru' },
    { nombre: 'Nepal' },
    { nombre: 'Nicaragua' },
    { nombre: 'Níger' },
    { nombre: 'Nigeria' },
    { nombre: 'Noruega' },
    { nombre: 'Nueva Zelanda' },
    { nombre: 'Omán' },
    { nombre: 'Orden de Malta' },
    { nombre: 'Países Bajos' },
    { nombre: 'Pakistán' },
    { nombre: 'Palestina' },
    { nombre: 'Palau' },
    { nombre: 'Panamá' },
    { nombre: 'Papúa Nueva Guinea' },
    { nombre: 'Paraguay' },
    { nombre: 'Perú' },
    { nombre: 'Polonia' },
    { nombre: 'Portugal' },
    { nombre: 'Puerto Rico' },
    { nombre: 'Reino Unido' },
    { nombre: 'República Centroafricana' },
    { nombre: 'República Checa' },
    { nombre: 'República del Congo' },
    { nombre: 'República Democrática del Congo' },
    { nombre: 'República Dominicana' },
    { nombre: 'Ruanda' },
    { nombre: 'Rumanía' },
    { nombre: 'Rusia' },
    { nombre: 'Sáhara Occidental' },
    { nombre: 'Samoa Americana' },
    { nombre: 'Samoa' },
    { nombre: 'San Cristóbal y Nieves' },
    { nombre: 'San Marino' },
    { nombre: 'Santa Lucía' },
    { nombre: 'Santo Tomé y Príncipe' },
    { nombre: 'San Vicente y las Granadinas' },
    { nombre: 'Senegal' },
    { nombre: 'Serbia' },
    { nombre: 'Seychelles' },
    { nombre: 'Sierra Leona' },
    { nombre: 'Singapur' },
    { nombre: 'Siria' },
    { nombre: 'Somalia' },
    { nombre: 'Sri Lanka' },
    { nombre: 'Sudáfrica' },
    { nombre: 'Sudán' },
    { nombre: 'Sudán del Sur' },
    { nombre: 'Suecia' },
    { nombre: 'Suiza' },
    { nombre: 'Suazilandia' },
    { nombre: 'Tailandia' },
    { nombre: 'Taiwán' },
    { nombre: 'Tanzania' },
    { nombre: 'Tayikistán' },
    { nombre: 'Tíbet' },
    { nombre: 'Timor Oriental' },
    { nombre: 'Togo' },
    { nombre: 'Tonga' },
    { nombre: 'Trinidad y Tobago' },
    { nombre: 'Túnez' },
    { nombre: 'Turkmenistán' },
    { nombre: 'Turquía' },
    { nombre: 'Tuvalu' },
    { nombre: 'Ucrania' },
    { nombre: 'Uganda' },
    { nombre: 'Uruguay' },
    { nombre: 'Uzbequistán' },
    { nombre: 'Vanuatu' },
    { nombre: 'Vaticano' },
    { nombre: 'Venezuela' },
    { nombre: 'Vietnam' },
    { nombre: 'Wallis y Futuna' },
    { nombre: 'Yemen' },
    { nombre: 'Yibuti' },
    { nombre: 'Zambia' },
    { nombre: 'Zaire' },
    { nombre: 'Zimbabue' },
];
const provincias = [
    {
        nombre: 'Buenos Aires',
        pais: 'Argentina'
    },
    {
        nombre: 'Ciudad Autónoma de Buenos Aires',
        pais: 'Argentina'
    },
    {
        nombre: 'Catamarca',
        pais: 'Argentina'
    },
    {
        nombre: 'Chaco',
        pais: 'Argentina'
    },
    {
        nombre: 'Chubut',
        pais: 'Argentina'
    },
    {
        nombre: 'Córdoba',
        pais: 'Argentina'
    },
    {
        nombre: 'Corrientes',
        pais: 'Argentina'
    },
    {
        nombre: 'Entre Ríos',
        pais: 'Argentina'
    },
    {
        nombre: 'Formosa',
        pais: 'Argentina'
    },
    {
        nombre: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'La Pampa',
        pais: 'Argentina'
    },
    {
        nombre: 'La Rioja',
        pais: 'Argentina'
    },
    {
        nombre: 'Mendoza',
        pais: 'Argentina'
    },
    {
        nombre: 'Misiones',
        pais: 'Argentina'
    },
    {
        nombre: 'Neuquén',
        pais: 'Argentina'
    },
    {
        nombre: 'Río Negro',
        pais: 'Argentina'
    },
    {
        nombre: 'Salta',
        pais: 'Argentina'
    },
    {
        nombre: 'San Juan',
        pais: 'Argentina'
    },
    {
        nombre: 'San Luis',
        pais: 'Argentina'
    },
    {
        nombre: 'Santa Cruz',
        pais: 'Argentina'
    },
    {
        nombre: 'Santa Fe',
        pais: 'Argentina'
    },
    {
        nombre: 'Santiago del Estero',
        pais: 'Argentina'
    },
    {
        nombre: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
        pais: 'Argentina'
    },
    {
        nombre: 'Tucumán',
        pais: 'Argentina'
    }
];
const ciudades = [
    {
        nombre: 'San Salvador de Jujuy',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'San Pedro de Jujuy',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Palpalá',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Libertador General San Martín',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'La Quiaca',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Humahuaca',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Perico',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'El Carmen',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Monterrico',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'San Antonio',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Fraile Pintado',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Tilcara',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Abra Pampa',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Reyes',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Yuto',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Puesto Viejo',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'El Aguilar',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Maimará',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Volcán',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'La Mendieta',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Santa Clara',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Susques',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Rinconada',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Tumbaya',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Caimancito',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Santa Catalina',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'Calilegua',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Yala',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Volcán',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Tumbaya',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Pampa Blanca',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Ceibal',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Piquete',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Acheral',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Bananal',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de La Almona',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Angosto',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Fuerte',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Moreno',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de El Piquete',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Fraile Pintado',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Hipólito Yrigoyen',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de La Mendieta',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Las Pampitas',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Liviara',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Los Alisos',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Pampa Blanca',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Pampichuela',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Puesto del Marqués',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Puesto Viejo',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Rodeito',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de San Francisco de Alfarcito',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Santa Ana',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Santa Bárbara',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Santa Clara',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Santa Rosa',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Sausalito',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Uquía',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Yavi',
        provincia: 'Jujuy',
        pais: 'Argentina'
    },
    {
        nombre: 'de Yuto',
        provincia: 'Jujuy',
        pais: 'Argentina'
    }
];
seedersRoutes.get('/paises', (req, res) => {
    for (let i = 0; i < paises.length; i = i + 1) {
        pais_model_1.Pais.create(paises[i]);
    }
    res.json({
        ok: true,
        mensaje: 'todo ok'
    });
});
seedersRoutes.get('/provincias', (req, res) => {
    for (let i = 0; i < provincias.length; i = i + 1) {
        pais_model_1.Pais.findOne({ nombre: provincias[i].pais }).then(paisBD => {
            const prov = {
                nombre: provincias[i].nombre,
                pais: paisBD === null || paisBD === void 0 ? void 0 : paisBD._id
            };
            provincia_model_1.Provincia.create(prov);
        });
    }
    res.json({
        ok: true,
        mensaje: 'todo ok'
    });
});
seedersRoutes.get('/ciudades', (req, res) => {
    for (let i = 0; i < ciudades.length; i = i + 1) {
        provincia_model_1.Provincia.findOne({ nombre: ciudades[i].provincia }).then(provBD => {
            const ciudad = {
                nombre: ciudades[i].nombre,
                provincia: provBD === null || provBD === void 0 ? void 0 : provBD._id,
                pais: provBD === null || provBD === void 0 ? void 0 : provBD.pais
            };
            ciudad_model_1.Ciudad.create(ciudad);
        });
    }
    res.json({
        ok: true,
        mensaje: 'todo ok'
    });
});
exports.default = seedersRoutes;
