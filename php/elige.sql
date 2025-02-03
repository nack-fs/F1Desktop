CREATE DATABASE IF NOT EXISTS album;
USE album;

CREATE TABLE IF NOT EXISTS Teams (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Countries (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Drivers (
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    team_id INT NOT NULL,
    country_id INT NOT NULL,
    birth_year INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Teams(id),
    FOREIGN KEY (country_id) REFERENCES Countries(id)
);

CREATE TABLE IF NOT EXISTS Earnings (
    driver_id INT PRIMARY KEY,
    earnings_millions DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES Drivers(id)
);

CREATE TABLE IF NOT EXISTS Championships (
    year INT PRIMARY KEY,
    champion_driver INT NOT NULL,
    champion_team INT NOT NULL,
    FOREIGN KEY (champion_driver) REFERENCES Drivers(id),
    FOREIGN KEY (champion_team) REFERENCES Teams(id)
);

CREATE TABLE IF NOT EXISTS InitialTeams (
    team_id INT NOT NULL,
    driver_id INT NOT NULL,
    season INT NOT NULL,
    ranking INT NOT NULL,
    PRIMARY KEY (team_id, driver_id, season),
    FOREIGN KEY (team_id) REFERENCES Teams(id),
    FOREIGN KEY (driver_id) REFERENCES Drivers(id)
);