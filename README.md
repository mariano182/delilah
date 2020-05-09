# delilah resto
Proyecto Delilah Resto backend

Api REST para generar y administrar pedidos realizados en un local de comidas, generada en Node Framework y utilizando MySQL para almacenar datos.

>##Configurar base de datos
_Estas indicaciones te van a permitir crear la base de datos correctamentedesde la cual se realizarán las consultas._

###Requisitos previos:
_Constar con la instalación previa de:
*_MySql Server_
*_MySQL Worjbench_ (con usuario y contraseña en el puerto 3306)

###Configuración:
_Se deben ejecutar las queries incluidas en el archivo 'delilah.sql' que se encuentra en la carpeta 'Documentos' de este repositorio._
Las queries crean la base de datos llamada 'delilah', así como las tablas necesarias: usuarios(users), productos (productos), pedidos (pedidos) y la del detalle de los pedidos (detallesPedidos).
A continuación se ejecutan dos queries que cargan datos iniciales: una para guardar productos existentes en la base de datos, y la otra para agregar un nuevo usuario con rol de administrador.
_Los usuarios con rol de administrador sólo podrán darse de alta desde la base de datos._

> ##iniciar el servidor
_Estas instrucciones te permiten obtener una copia del proyecto, de manera local, para poder hacer pruebas con proposito de desarrollo. ._

### Requisitos previos:
_Elemenos necesarios para poder levantar el proyecto de forma local y realizar las pruebas correspondientes. En el package.json._
*_npm install node
*_npm install express
*_npm install jsonwebtoken
*_npm install body-parser
*_npm install sequelize
*_npm install mysql

###Configuración
_Se debe configurar la conexión a la base de datos._
Se debe reemplazar el usuario, contraseña, url y puerto de Sequelize con los creados en el paso anterior, en el archivo 'configuracion.js' (server/configuracion.js).

var const sql = new Sequelize('mysql://USUARIO:CONTRASEÑA@localhost:3306/delilah');

###incio del servidor:
_iniciar el servidor mediante una terminal._
node server.js


>##Pruebas a realizar mediantes endpoints
_Estas instrucciones te permitirán probar la funcionalidad de la aplicaciones de pedidos._

###Requisitos previos:
_Se debe instalar el siguiente programa._
Postman

##Configuración:
_Se deben cargar los archivos 'DelilahPostman.json' y 'spec.yaml' incluidos en la carpeta Documentos._
El archivo de POSTMAN ('DelilahPostman.json') contiene todos los endpoints referidos en la aplicación. Cada ruta posee en la solapa 'edit' el contenido que debe pasarse para poder utilizar correctamente, como son los headers, si posee algún tipo de autorización (token) y su correspondiente body en caso de que tenga.

El archivo YAML contiene la información que va a mostrar la respueta del servidor en cada endpoint configurados.

###Chequeo de endpoints
_Instrucciones para un correcto uso de las rutas._
Las rutas creadas permiten la creación de usuarios, la administración de productos y la manipulación de los pedidos.
Las rutas '/register' y '/login' permiten crear un ususario e iniciar sesión correspondientemente: ambas devuelven un token de autorización necesario para realizar el resto de los requests.
La base de datos ya tiene cargado un usuario con el rol de adeministrador, el cual tiene permisos exlusivos que le dan acceso a los endpoints de crear producto, actualizar estado de perdido, entre otros. 

**Mariano Fernández**
**Proyecto: Delilah resto**

