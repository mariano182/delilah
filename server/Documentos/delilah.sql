CREATE DATABASE delilah;
USE delilah;
CREATE TABLE users(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
userName VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL,
lastName VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
phone VARCHAR(15) NOT NULL,
address VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
token VARCHAR(255) NOT NULL,
is_admin BOOLEAN NOT NULL
);
​
CREATE TABLE productos (
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
nombre VARCHAR(255) NOT NULL,
descripcion VARCHAR(255) NOT NULL,
ingredientes VARCHAR(255) NOT NULL,
costo FLOAT NOT NULL,
img VARCHAR(255) NOT NULL
);
​
CREATE TABLE pedidos (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
user_id INT NOT NULL,
estado VARCHAR (60) NOT NULL,
medio_de_pago boolean NOT NULL,
total FLOAT NOT NULL,
fecha_y_hora datetime NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE detallesPedidos(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
pedido_id INT NOT NULL,
producto_id INT NOT NULL,
cantidad INT NOT NULL,
FOREIGN KEY (order_id) REFERENCES pedidos(id),
FOREIGN KEY (product_id) REFERENCES productos(id)
);

INSERT INTO productos (nombre, descripcion, ingredientes, costo, img) VALUES ("Pizza de Pollo", "PizPol", "Masa, muzzarella y pollo", 375, "https://i.blogs.es/40c9b7/pizza-casera-champinon/840_560.jpg"), 
("Pizza Especial", "PizEsp", "Masa, muzzarella, jamón, morrones, aceitunas y huevo", 400, "https://www.johaprato.com/files/styles/flexslider_full/public/pizza_con_huevo.jpg?itok=v-ppJd7X"), 
("Pizza de Rúcula", "PizRuc", "Masa, muzzarella, rúcula, parmesano", 450, "https://www.doravidela.com.ar/imagenes/47_606x356.jpg"), 
("Pizza la Potente", "PizPot", "Masa, muzzarella, panceta y huevo frito", 470, "https://img-global.cpcdn.com/recipes/b0a1b7c4e7b9399b/1200x630cq70/photo.jpg"), 
("Pizza de Fugazzeta", "PizFug", "Masa, muzzarella y mucha cebolla", 440, "https://i2.wp.com/locosxlapizza.com/wp-content/uploads/2015/02/receta-pizza-fugazzeta-rellena-casera-recetas-locosxlapizza.jpg"), 
("Pizza napolitana", "PizNap", "Masa, muzzarella, tomate, albaaca, ajo y aceite de oliva ", 340, "https://t1.rg.ltmcdn.com/es/images/8/5/2/img_pizza_napolitana_con_anchoas_13258_orig.jpg") 
;

INSERT INTO users (userName, name, lastName, email, phone, address, password, token, is_admin) VALUES ("admin", "Roberto", "Aguirre", "pachu@argentina.com", 87463508, "Av. Los Locales 167", "hola1810", " ", true); 
