-- Nome BD: garagem --

-- Tabela Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    usuarioid bigserial constraint pk_usuarios PRIMARY KEY,
    username varchar(10) UNIQUE,
    password text,
    deleted boolean DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO Usuarios VALUES 
    (default, 'admin', crypt('admin', gen_salt('bf')))
ON CONFLICT DO NOTHING;

-- Tabela Clientes com mensalidade como DECIMAL padrão NULL
CREATE TABLE Clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    removido BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mensalidade DECIMAL(10,2) DEFAULT NULL
);

-- Tabela Carros com valor como DECIMAL padrão NULL
CREATE TABLE Carros (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    removido BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor DECIMAL(12,2) DEFAULT NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

-- Tabela Vagas com tamanho como DECIMAL padrão NULL
CREATE TABLE Vagas (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    removido BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tamanho DECIMAL(5,2) DEFAULT NULL
);

-- Tabela VagaCarro
CREATE TABLE VagaCarro (
    id SERIAL PRIMARY KEY,
    carro_id INT NOT NULL,
    vaga_id INT NOT NULL,
    data_entrada TIMESTAMP NOT NULL,
    data_saida TIMESTAMP,
    removido BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carro FOREIGN KEY (carro_id) REFERENCES Carros(id),
    CONSTRAINT fk_vaga FOREIGN KEY (vaga_id) REFERENCES Vagas(id)
);

-- Inserções na tabela Clientes com mensalidade
INSERT INTO Clientes (nome, email, telefone, removido, mensalidade) 
VALUES 
    ('João Silva', 'joao.silva@email.com', '123456789', FALSE, 150.50),
    ('Maria Oliveira', 'maria.oliveira@email.com', '987654321', FALSE, 200.75),
    ('Carlos Souza', 'carlos.souza@email.com', '555666777', FALSE, 180.00),
    ('Ana Santos', 'ana.santos@email.com', '888999000', FALSE, 220.25);

-- Inserções na tabela Vagas com tamanho
INSERT INTO Vagas (descricao, tamanho) 
VALUES 
    ('Vaga 1', 2.50),
    ('Vaga 2', 2.75),
    ('Vaga 3', 3.00),
    ('Vaga 4', 2.80);

-- Inserções na tabela Carros com valor
INSERT INTO Carros (cliente_id, modelo, placa, removido, valor) 
VALUES 
    (1, 'Fusca', 'ABC1234', FALSE, 30000.00),
    (2, 'Gol', 'XYZ5678', FALSE, 40000.50),
    (3, 'Civic', 'LMN9876', FALSE, 85000.75),
    (4, 'Fiesta', 'OPQ6543', FALSE, 50000.25);

-- Inserções na tabela VagaCarro
INSERT INTO VagaCarro (carro_id, vaga_id, data_entrada, data_saida, removido) 
VALUES 
    (1, 1, '2024-11-27 08:00:00', NULL, FALSE),
    (2, 2, '2024-11-26 10:00:00', '2024-11-27 12:00:00', FALSE),
    (3, 3, '2024-11-27 09:00:00', NULL, FALSE),
    (4, 4, '2024-11-27 07:00:00', NULL, FALSE);

-- Criação de função para atualizar removido na tabela Carros quando um cliente é removido
CREATE OR REPLACE FUNCTION update_carros_when_cliente_removed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.removido = TRUE THEN
        UPDATE Carros
        SET removido = TRUE
        WHERE cliente_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criação de trigger que chama a função acima após atualização na tabela Clientes
CREATE TRIGGER trigger_update_carros_when_cliente_removed
AFTER UPDATE OF removido
ON Clientes
FOR EACH ROW
WHEN (NEW.removido = TRUE)
EXECUTE FUNCTION update_carros_when_cliente_removed();


select * from clientes