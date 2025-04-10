-- Create the gambling_app database
CREATE DATABASE IF NOT EXISTS gambling_app;
USE gambling_app;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  UNIQUE KEY username (username),
  UNIQUE KEY email (email)
);

-- Create the matches table
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team1 VARCHAR(50) NOT NULL,
  team2 VARCHAR(50) NOT NULL,
  map VARCHAR(50) NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  winner VARCHAR(50)
);

-- Create the bets table
CREATE TABLE IF NOT EXISTS bets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  predicted_winner VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (match_id) REFERENCES matches(id)
);

-- Insert sample data into the users table
INSERT INTO users (username, email, password_hash, balance)
VALUES ('testuser', 'test@example.com', 'hashed_password', 100.00);

-- Insert sample data into the matches table
INSERT INTO matches (team1, team2, map)
VALUES ('Team A', 'Team B', 'Map 1'),
       ('Team C', 'Team D', 'Map 2');

-- Insert sample data into the bets table
INSERT INTO bets (user_id, match_id, amount, predicted_winner)
VALUES (1, 1, 10.00, 'Team A'),
       (1, 2, 20.00, 'Team D');