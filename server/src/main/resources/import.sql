/*
-- Inserindo categorias baseadas nos tipos de produtos do JSON
insert into tb_category (name) values ('Drone');
insert into tb_category (name) values ('Smartwatch');
insert into tb_category (name) values ('Fone de Ouvido');
insert into tb_category (name) values ('Smartphone');

-- Inserindo produtos - DRONES (category_id = 1)
insert into tb_product (name, description, price, category_id) values ('Drone DJI Mavic 3 Pro', 'Câmera Hasselblad 4K, 20MP, 46 minutos de voo - Marca: DJI, Modelo: Mavic 3 Pro', 12999.00, 1);
insert into tb_product (name, description, price, category_id) values ('Drone Autel Robotics EVO II', 'Câmera 8K, 40 minutos de voo, Obstacle Avoidance - Marca: Autel Robotics, Modelo: EVO II', 9500.00, 1);
insert into tb_product (name, description, price, category_id) values ('Drone Parrot Anafi', 'Compacto, Câmera 4K HDR, 25 minutos de voo - Marca: Parrot, Modelo: Anafi', 3200.00, 1);
insert into tb_product (name, description, price, category_id) values ('Drone Holy Stone HS720', 'Câmera 4K, GPS, 26 minutos de voo - Marca: Holy Stone, Modelo: HS720', 1800.00, 1);
insert into tb_product (name, description, price, category_id) values ('Drone Xiaomi FIMI X8SE', 'Câmera 4K, 33 minutos de voo, GPS Inteligente - Marca: Xiaomi, Modelo: FIMI X8SE', 2500.00, 1);

-- Inserindo produtos - SMARTWATCHES (category_id = 2)
insert into tb_product (name, description, price, category_id) values ('Smartwatch Apple Watch Series 8', 'Tela Retina, Monitor de Saúde, GPS - Marca: Apple, Modelo: Watch Series 8', 4999.00, 2);
insert into tb_product (name, description, price, category_id) values ('Smartwatch Samsung Galaxy Watch 5', 'Monitor de Sono, Resistente à Água, Bluetooth - Marca: Samsung, Modelo: Galaxy Watch 5', 2300.00, 2);
insert into tb_product (name, description, price, category_id) values ('Smartwatch Garmin Fenix 6', 'GPS, Monitor de Batimento Cardíaco, Resistente a Impactos - Marca: Garmin, Modelo: Fenix 6', 5500.00, 2);
insert into tb_product (name, description, price, category_id) values ('Smartwatch Xiaomi Mi Band 7', 'Tela AMOLED, Monitor de Atividades, 14 Dias de Bateria - Marca: Xiaomi, Modelo: Mi Band 7', 499.00, 2);
insert into tb_product (name, description, price, category_id) values ('Smartwatch Huawei Watch GT 3', 'Tela AMOLED, Monitor de Saúde, 14 Dias de Bateria - Marca: Huawei, Modelo: Watch GT 3', 1200.00, 2);

-- Inserindo produtos - FONES DE OUVIDO (category_id = 3)
insert into tb_product (name, description, price, category_id) values ('Fone de Ouvido Sony WH-1000XM5', 'Cancelamento de Ruído, Bluetooth, 30h de Bateria - Marca: Sony, Modelo: WH-1000XM5', 2800.00, 3);
insert into tb_product (name, description, price, category_id) values ('Fone de Ouvido Bose QuietComfort 45', 'Cancelamento de Ruído, Conforto Premium, 24h de Bateria - Marca: Bose, Modelo: QuietComfort 45', 2500.00, 3);
insert into tb_product (name, description, price, category_id) values ('Fone de Ouvido JBL Tune 510BT', 'Bluetooth, 40h de Bateria, Design Dobrável - Marca: JBL, Modelo: Tune 510BT', 299.00, 3);
insert into tb_product (name, description, price, category_id) values ('Fone de Ouvido Apple AirPods Pro (2ª Geração)', 'Cancelamento de Ruído, Estojo de Recarga - Marca: Apple, Modelo: AirPods Pro (2ª Geração)', 2200.00, 3);
insert into tb_product (name, description, price, category_id) values ('Fone de Ouvido Xiaomi Redmi Buds 3 Pro', 'Cancelamento de Ruído, 28h de Bateria, Bluetooth 5.2 - Marca: Xiaomi, Modelo: Redmi Buds 3 Pro', 399.00, 3);

-- Inserindo produtos - SMARTPHONES (category_id = 4)
insert into tb_product (name, description, price, category_id) values ('Smartphone Samsung Galaxy S23 Ultra', 'Câmera 200MP, 12GB RAM, 256GB, 5G - Marca: Samsung, Modelo: Galaxy S23 Ultra', 8999.00, 4);
insert into tb_product (name, description, price, category_id) values ('Smartphone iPhone 15 Pro Max', 'Câmera 48MP, A17 Pro, 256GB, 5G - Marca: Apple, Modelo: iPhone 15 Pro Max', 10499.00, 4);
insert into tb_product (name, description, price, category_id) values ('Smartphone Xiaomi 13 Pro', 'Câmera Leica, 12GB RAM, 256GB, 5G - Marca: Xiaomi, Modelo: 13 Pro', 6500.00, 4);
insert into tb_product (name, description, price, category_id) values ('Smartphone Motorola Edge 40', 'Câmera 50MP, 8GB RAM, 256GB, 5G - Marca: Motorola, Modelo: Edge 40', 3999.00, 4);
insert into tb_product (name, description, price, category_id) values ('Smartphone Google Pixel 7 Pro', 'Câmera 50MP, 12GB RAM, 256GB, 5G - Marca: Google, Modelo: Pixel 7 Pro', 5800.00, 4);



INSERT INTO tb_user(display_name, username, password) VALUES ('Administrador', 'admin','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
INSERT INTO tb_user(display_name, username, password) VALUES ('Teste', 'test','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
INSERT INTO tb_user(display_name, username, password) VALUES ('Teste1', 'test1','123');


INSERT into tb_forma_pgto(type, description) VALUES ('PIX', 'pagamento pix');

 */

-- Inserindo categorias
INSERT INTO tb_category (name) VALUES ('Drone');
INSERT INTO tb_category (name) VALUES ('Smartwatch');
INSERT INTO tb_category (name) VALUES ('Fone de Ouvido');
INSERT INTO tb_category (name) VALUES ('Smartphone');

-- Inserindo produtos - DRONES (category_id = 1)
INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Drone DJI Mavic 3 Pro', 'Câmera Hasselblad 4K, 20MP, 46 minutos de voo - Marca: DJI, Modelo: Mavic 3 Pro', 12999.00, 'drone1.png', 1);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Drone Autel Robotics EVO II', 'Câmera 8K, 40 minutos de voo, Obstacle Avoidance - Marca: Autel Robotics, Modelo: EVO II', 9500.00, 'drone2.png', 1);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Drone Parrot Anafi', 'Compacto, Câmera 4K HDR, 25 minutos de voo - Marca: Parrot, Modelo: Anafi', 3200.00, 'drone3.png', 1);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Drone Holy Stone HS720', 'Câmera 4K, GPS, 26 minutos de voo - Marca: Holy Stone, Modelo: HS720', 1800.00, 'drone4.png', 1);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Drone Xiaomi FIMI X8SE', 'Câmera 4K, 33 minutos de voo, GPS Inteligente - Marca: Xiaomi, Modelo: FIMI X8SE', 2500.00, 'drone2.png', 1);

-- Inserindo produtos - SMARTWATCHES (category_id = 2)
INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartwatch Apple Watch Series 8', 'Tela Retina, Monitor de Saúde, GPS - Marca: Apple, Modelo: Watch Series 8', 4999.00, 'Smartwatch1.png', 2);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartwatch Samsung Galaxy Watch 5', 'Monitor de Sono, Resistente à Água, Bluetooth - Marca: Samsung, Modelo: Galaxy Watch 5', 2300.00, 'Smartwatch2.png', 2);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartwatch Garmin Fenix 6', 'GPS, Monitor de Batimento Cardíaco, Resistente a Impactos - Marca: Garmin, Modelo: Fenix 6', 5500.00, 'Smartwatch4.png', 2);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartwatch Xiaomi Mi Band 7', 'Tela AMOLED, Monitor de Atividades, 14 Dias de Bateria - Marca: Xiaomi, Modelo: Mi Band 7', 499.00, 'Smartwatch4.png', 2);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartwatch Huawei Watch GT 3', 'Tela AMOLED, Monitor de Saúde, 14 Dias de Bateria - Marca: Huawei, Modelo: Watch GT 3', 1200.00, 'Smartwatch5.png', 2);

-- Inserindo produtos - FONES DE OUVIDO (category_id = 3)
INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Fone de Ouvido Sony WH-1000XM5', 'Cancelamento de Ruído, Bluetooth, 30h de Bateria - Marca: Sony, Modelo: WH-1000XM5', 2800.00, 'Fones1.png', 3);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Fone de Ouvido Bose QuietComfort 45', 'Cancelamento de Ruído, Conforto Premium, 24h de Bateria - Marca: Bose, Modelo: QuietComfort 45', 2500.00, 'Fones2.png', 3);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Fone de Ouvido JBL Tune 510BT', 'Bluetooth, 40h de Bateria, Design Dobrável - Marca: JBL, Modelo: Tune 510BT', 299.00, 'Fones3.png', 3);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Fone de Ouvido Apple AirPods Pro (2ª Geração)', 'Cancelamento de Ruído, Estojo de Recarga - Marca: Apple, Modelo: AirPods Pro (2ª Geração)', 2200.00, 'Fones4.png', 3);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Fone de Ouvido Xiaomi Redmi Buds 3 Pro', 'Cancelamento de Ruído, 28h de Bateria, Bluetooth 5.2 - Marca: Xiaomi, Modelo: Redmi Buds 3 Pro', 399.00, 'Fones5.png', 3);

-- Inserindo produtos - SMARTPHONES (category_id = 4)
INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartphone Samsung Galaxy S23 Ultra', 'Câmera 200MP, 12GB RAM, 256GB, 5G - Marca: Samsung, Modelo: Galaxy S23 Ultra', 8999.00, 'Smart1.jpg', 4);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartphone iPhone 15 Pro Max', 'Câmera 48MP, A17 Pro, 256GB, 5G - Marca: Apple, Modelo: iPhone 15 Pro Max', 10499.00, 'Smart2.jpg', 4);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartphone Xiaomi 13 Pro', 'Câmera Leica, 12GB RAM, 256GB, 5G - Marca: Xiaomi, Modelo: 13 Pro', 6500.00, 'Smart3.jpg', 4);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartphone Motorola Edge 40', 'Câmera 50MP, 8GB RAM, 256GB, 5G - Marca: Motorola, Modelo: Edge 40', 3999.00, 'Smart4.jpg', 4);

INSERT INTO tb_product (name, description, price, image_path, category_id)
VALUES ('Smartphone Google Pixel 7 Pro', 'Câmera 50MP, 12GB RAM, 256GB, 5G - Marca: Google, Modelo: Pixel 7 Pro', 5800.00, 'Smart5.jpg', 4);

-- Dados de usuário
INSERT INTO tb_user(display_name, username, password) VALUES ('Administrador', 'admin','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
INSERT INTO tb_user(display_name, username, password) VALUES ('Teste', 'test','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
INSERT INTO tb_user(display_name, username, password) VALUES ('Teste1', 'test1','123');

-- Forma de pagamento
INSERT INTO tb_forma_pgto(type, description) VALUES ('PIX', 'pagamento pix');