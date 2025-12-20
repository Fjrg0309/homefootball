-- Datos de ejemplo para la base de datos H2

-- Ligas
INSERT INTO Liga (nombre, pais, temporada_actual) VALUES ('La Liga', 'España', '2024-2025');
INSERT INTO Liga (nombre, pais, temporada_actual) VALUES ('Premier League', 'Inglaterra', '2024-2025');
INSERT INTO Liga (nombre, pais, temporada_actual) VALUES ('Serie A', 'Italia', '2024-2025');
INSERT INTO Liga (nombre, pais, temporada_actual) VALUES ('Bundesliga', 'Alemania', '2024-2025');

-- Entrenadores
INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Carlo Ancelotti', '1959-06-10', 'Italia');
INSERT INTO Entrenador (id, anios_experiencia, titulos_ganados) VALUES (1, 35, 25);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Pep Guardiola', '1971-01-18', 'España');
INSERT INTO Entrenador (id, anios_experiencia, titulos_ganados) VALUES (2, 18, 38);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Xavi Hernández', '1980-01-25', 'España');
INSERT INTO Entrenador (id, anios_experiencia, titulos_ganados) VALUES (3, 5, 4);

-- Equipos
INSERT INTO Equipo (nombre, fecha_fundacion, liga_id, entrenador_id) VALUES ('Real Madrid', '1902-03-06', 1, 1);
INSERT INTO Equipo (nombre, fecha_fundacion, liga_id, entrenador_id) VALUES ('FC Barcelona', '1899-11-29', 1, 3);
INSERT INTO Equipo (nombre, fecha_fundacion, liga_id, entrenador_id) VALUES ('Manchester City', '1880-04-16', 2, 2);

-- Jugadores Real Madrid
INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Vinicius Jr', '2000-07-12', 'Brasil');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (4, 'Delantero', 7, 18, 1);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Jude Bellingham', '2003-06-29', 'Inglaterra');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (5, 'Centrocampista', 5, 15, 1);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Thibaut Courtois', '1992-05-11', 'Bélgica');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (6, 'Portero', 1, 0, 1);

-- Jugadores FC Barcelona
INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Robert Lewandowski', '1988-08-21', 'Polonia');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (7, 'Delantero', 9, 22, 2);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Pedri', '2002-11-25', 'España');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (8, 'Centrocampista', 8, 5, 2);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Marc-André ter Stegen', '1992-04-30', 'Alemania');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (9, 'Portero', 1, 0, 2);

-- Jugadores Manchester City
INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Erling Haaland', '2000-07-21', 'Noruega');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (10, 'Delantero', 9, 28, 3);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Kevin De Bruyne', '1991-06-28', 'Bélgica');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (11, 'Centrocampista', 17, 8, 3);

INSERT INTO Miembro (nombre, fecha_nacimiento, nacionalidad) VALUES ('Ederson', '1993-08-17', 'Brasil');
INSERT INTO Jugador (id, posicion, numero_camiseta, goles_marcados, equipo_id) VALUES (12, 'Portero', 31, 0, 3);

-- Usuario administrador de ejemplo (contraseña: admin123 - BCrypt)
INSERT INTO usuarios (username, password, email, enabled) VALUES ('admin', '$2a$10$5fzKvNXY8YuYVvOxT5XbvOvGqX9Y6qN8qKgFsWZGZL0gQf5vYh2J6', 'admin@homefootball.com', true);
INSERT INTO usuario_roles (usuario_id, role) VALUES (1, 'ROLE_ADMIN');
INSERT INTO usuario_roles (usuario_id, role) VALUES (1, 'ROLE_USER');
