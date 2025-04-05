# Gambling App with SquadJS Integration

This is a web-based gambling app that integrates with the game *Squad* using the SquadJS framework. The app allows users to bet on game events, view leaderboards, and manage their profiles.

---

## Features

1. **User Authentication**:
   - Users can register, log in, and log out.
   - Login state is persisted across page refreshes using local storage.

2. **Real-Time Game Events**:
   - The app integrates with SquadJS to receive real-time game events such as player joins, player leaves, player kills, and round endings.
   - Events are stored in the database and displayed in the frontend.

3. **Betting**:
   - Users can place bets on game events (to be implemented).

4. **Leaderboard**:
   - Displays the top users based on their betting performance (to be implemented).

5. **Profile Management**:
   - Users can view and manage their profiles (to be implemented).

---

## Technologies Used

- **Frontend**:
  - React
  - React Router
  - Socket.IO Client

- **Backend**:
  - Node.js
  - Express
  - MySQL
  - Socket.IO

- **Game Integration**:
  - SquadJS

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/gambling-app.git
   cd gambling-app
   ```

2. **Install Dependencies**:
   - Backend:
     ```bash
     npm install
     ```
   - Frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Set Up the Database**:
   - Create a MySQL database and update the connection settings in `server.js`.
   - Run the following SQL script to create the `game_events` table:
     ```sql
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
     ```

4. **Start the Backend Server**:
   ```bash
   node server.js
   ```

5. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```

6. **Start SquadJS**:
   - Ensure SquadJS is configured and running locally.
   - Start SquadJS:
     ```bash
     node index.js
     ```

---

## API Endpoints

### Backend
- **POST /api/login**: Authenticate a user.
- **POST /api/register**: Register a new user.
- **GET /api/game-events**: Fetch all game events.
- **GET /api/games/:id**: Fetch details of a specific game event.
- **POST /api/bets**: Place a bet (to be implemented).

---

## Future Work
1. Implement the betting feature.
2. Add a leaderboard to display top users.
3. Enhance profile management.
4. Add more detailed game event data.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
