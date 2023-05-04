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
    temperatura VARCHAR(10),
    fkProcesso INT,
    CONSTRAINT fkProcesso FOREIGN KEY(fkProcesso) REFERENCES processo(idProcesso)
);

INSERT INTO processo VALUES
(null, 'Maceração'),
(null, 'Malteação'),
(null, 'Moagem'),
(null, 'Brassagem'),
(null, 'Fervura'),
(null, 'Resfriamento'),
(null, 'Maturação'),
(null, 'Filtragem'),
(null, 'Pasteurização Rápida'),
(null, 'Túnel de Pasteurização');

select * from processo;

