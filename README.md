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
   - Run the SQL script to create the `game_events` table:

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
