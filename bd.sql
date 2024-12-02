    -- Nome BD: garagem --

    -- Tabela Usuarios
    create table IF NOT EXISTS Usuarios (
        usuarioid bigserial constraint pk_usuarios PRIMARY KEY,
        username varchar(10) UNIQUE,
        password text,
        deleted boolean DEFAULT false,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE EXTENSION if NOT EXISTS pgcrypto;

    insert into Usuarios values 
        (default, 'admin', crypt('admin', gen_salt('bf')))
    ON CONFLICT DO NOTHING;

    -- Tabela Clientes
    CREATE TABLE Clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        removido BOOLEAN DEFAULT FALSE
    );

    -- Tabela Carros (Relacionamento 1:N com Clientes)
    CREATE TABLE Carros (
        id SERIAL PRIMARY KEY,
        cliente_id INT NOT NULL,
        modelo VARCHAR(255) NOT NULL,
        placa VARCHAR(20) UNIQUE NOT NULL,
        removido BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
    );

    -- Tabela Vagas
    CREATE TABLE Vagas (
        id SERIAL PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        status BOOLEAN DEFAULT FALSE,
        removido BOOLEAN DEFAULT FALSE
    );

    -- Tabela VagaCarro (Relacionamento M:N entre Carros e Vagas)
    CREATE TABLE VagaCarro (
        id SERIAL PRIMARY KEY,
        carro_id INT NOT NULL,
        vaga_id INT NOT NULL,
        data_entrada TIMESTAMP NOT NULL,
        data_saida TIMESTAMP,
        removido BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_carro FOREIGN KEY (carro_id) REFERENCES Carros(id),
        CONSTRAINT fk_vaga FOREIGN KEY (vaga_id) REFERENCES Vagas(id)
    );

    -- Inserções na tabela Clientes
    INSERT INTO Clientes (nome, email, telefone, removido) 
    VALUES 
    ('João Silva', 'joao.silva@email.com', '123456789', FALSE),
    ('Maria Oliveira', 'maria.oliveira@email.com', '987654321', FALSE),
    ('Carlos Souza', 'carlos.souza@email.com', '555666777', FALSE),
    ('Ana Santos', 'ana.santos@email.com', '888999000', FALSE);

    -- Inserções na tabela Vagas
    INSERT INTO Vagas (descricao) 
    VALUES 
    ('Vaga 1'),
    ('Vaga 2'),
    ('Vaga 3'),
    ('Vaga 4');

    -- Inserções na tabela Carros
    INSERT INTO Carros (cliente_id, modelo, placa, removido) 
    VALUES 
    (1, 'Fusca', 'ABC1234', FALSE),
    (2, 'Gol', 'XYZ5678', FALSE),
    (3, 'Civic', 'LMN9876', FALSE),
    (4, 'Fiesta', 'OPQ6543', FALSE);

    -- Inserções na tabela VagaCarro
    INSERT INTO VagaCarro (carro_id, vaga_id, data_entrada, data_saida, removido) 
    VALUES 
    (1, 1, '2024-11-27 08:00:00', NULL, FALSE),
    (2, 2, '2024-11-26 10:00:00', '2024-11-27 12:00:00', FALSE),
    (3, 3, '2024-11-27 09:00:00', NULL, FALSE),
    (4, 4, '2024-11-27 07:00:00', NULL, FALSE);

    select * from Usuarios
    drop table Usuarios
