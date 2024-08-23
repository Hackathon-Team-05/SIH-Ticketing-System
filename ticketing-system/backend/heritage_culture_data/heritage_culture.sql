CREATE TABLE states
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT,
    state_code   TEXT NOT NULL UNIQUE,
    country_code TEXT
);

CREATE TABLE cities
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT,
    state_code   TEXT,
    country_code TEXT,
    latitude     REAL,
    longitude    REAL,
    FOREIGN KEY (state_code) REFERENCES states (state_code)
);

CREATE TABLE museums
(
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    city_id         INTEGER,
    city_name       TEXT NOT NULL,
    state_code      TEXT,
    country_code    TEXT,
    opening_time    TEXT,
    closing_time    TEXT,
    adult_price     REAL,
    child_price     REAL,
    foreigner_price REAL,
    latitude        REAL,
    longitude       REAL,
    FOREIGN KEY (city_id) REFERENCES cities (id)
);

INSERT INTO states (name, state_code, country_code)
VALUES ('Odisha', 'OD', 'IN'),

       ('West Bengal', 'WB', 'IN');

INSERT INTO cities (name, state_code, country_code, latitude, longitude)
VALUES ('Konark', 'OD', 'IN', 19.8872, 86.0920),
       ('Bhubaneswar', 'OD', 'IN', 20.2568, 85.8412),
       ('Koraput', 'OD', 'IN', 18.7883, 82.7176),
       ('Ratnagiri', 'OD', 'IN', 20.6704, 86.2374),
       ('Lalitgiri', 'OD', 'IN', 20.6468, 86.1434),
       ('Cuttack', 'OD', 'IN', 20.2773, 85.8310),
       ('Kolkata', 'WB', 'IN', 22.5626, 88.3639);


INSERT INTO museums (name, city_id, city_name, state_code, country_code, opening_time, closing_time, adult_price,
                     child_price, foreigner_price, latitude, longitude)
VALUES ('Odisha State Museum (OSM)', 1, 'Bhubaneswar', 'OD', 'IN', '10:00:00', '17:30:00', 20.00, 10.00, null,
        20.256837,
        85.841158),
       ('Regional Museum of Natural History (RMNH)', 1, 'Bhubaneswar', 'OD', 'IN', '10:00:00', '17:00:00', null, null,
        null, 20.299611,
        85.832063), 
       ('ASI Temple Museum', 1, 'Konark,Puri', 'OD', 'IN', '10:00:00', '17:00:00', 10.00, 10.00, 250.00, 19.8872,
        86.0920),
       ('Museum of Tribal Arts and Artifacts', 1, 'Bhubaneswar', 'OD', 'IN', '10:00:00', '17:00:00', null, null, null,
        20.2970,
        85.8210),
       ('Tribal Museum', 1, 'Koraput', 'OD', 'IN', '10:00:00', '17:00:00', 05.00, 05.00, 50.00, 18.7883,
        82.7176),
       ('Archeological Museum', 1, 'Ratnagiri,Jajpur', 'OD', 'IN', '10:00:00', '17:00:00', 10.00, 10.00, 100.00,
        20.6704,
        86.2374),
       ('ASI Lalitgiri Site Museum', 2, 'Lalitgiri,Jajpur', 'DL', 'IN', '10:00:00', '17:00:00', 10.00, 05.00, 250.00,
        20.6468,
        86.1434),

       ('Odisha State Maritime Museum', 2, 'Cuttack', 'DL', 'IN', '10:00:00', '17:00:00', 20.00, 10.00, 200.00,
        20.2817,
        85.8310),
       ('Odisha Printing Museum', 2, 'Cuttack', 'DL', 'IN', '10:00:00', '17:00:00', 10.00, 05.00, 50.00, 20.2773,
        85.8310),
       ('Indian Museum', 1, 'Kolkata', 'WB', 'IN', '10:00:00', '17:00:00', 20.00, 10.00, 200.00, 22.5645, 88.3639),
       ('Victoria Memorial', 1, 'Kolkata', 'WB', 'IN', '10:00:00', '17:00:00', 30.00, 10.00, 150.00, 22.5458, 88.3465),
       ('Science City', 1, 'Kolkata', 'WB', 'IN', '09:00:00', '21:00:00', 50.00, 25.00, 200.00, 22.5377, 88.3330),
       ('Kalighat Temple Museum', 1, 'Kolkata', 'WB', 'IN', '06:00:00', '22:00:00', null, null, null, 22.5183, 88.3272),
       ('Rabindra Bharati Museum', 1, 'Kolkata', 'WB', 'IN', '10:00:00', '17:00:00', 15.00, 10.00, 100.00, 22.5684,
        88.3610),
       ('Marble Palace', 1, 'Kolkata', 'WB', 'IN', '10:00:00', '16:00:00', null, null, null, 22.5587, 88.3573),
       ('Subarnarekha Museum', 2, 'Kolkata', 'WB', 'IN', '10:00:00', '17:00:00', 10.00, 5.00, 50.00, 22.5625, 88.3630);;
