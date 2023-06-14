import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Game from "./components/Game/Game";
import Leaderboard from "./components/LeaderBoard/LeaderBoard";

const App = () => {
  return (
    <Router>
      <nav>
        {/* Навигационные ссылки */}
        <ul>
          <li>
            <Link to="/">Game</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
        </ul>
      </nav>
      {/* Маршруты */}
      <Routes>
        <Route path="/" exact component={<Game />} element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
