CREATE DATABASE Brewery;
USE Brewery;

CREATE TABLE processo
(
	idProcesso INT AUTO_INCREMENT PRIMARY KEY,
    nomeProcesso VARCHAR(50)
);

CREATE TABLE captura
(
	idCaptura INT AUTO_INCREMENT PRIMARY KEY,
    dtH DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperatura decimal(10,2),
    fkProcesso INT,
    CONSTRAINT fkProcesso FOREIGN KEY(fkProcesso) REFERENCES processo(idProcesso)
);

INSERT INTO processo VALUES
(null, 'Maceração'),
(null, 'Malteação 1'),
(null, 'Malteação 2'),
(null, 'Malteação 3'),
(null, 'Moagem'),
(null, 'Brassagem 1'),
(null, 'Brassagem 2'),
(null, 'Brassagem 3'),
(null, 'Fervura'),
(null, 'Resfriamento 1'),
(null, 'Resfriamento 2'),
(null, 'Resfriamento 3'),
(null, 'Filtragem'),
(null, 'Pasteurização'),
(null, 'Túnel de Pasteurização');

select * from processo;

select * from captura;


