CREATE TABLE IF NOT EXISTS brands (
    id int PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cities (
    id int PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS diets (
    id int PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dish_types (
    id int PRIMARY KEY,
    name text NOT NULL UNIQUE
);
