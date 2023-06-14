import { useState, useEffect } from "react";
import { fetchLeaderboard } from "../apiServices/apiServices";
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    (async () => {
      const leaders = await fetchLeaderboard();
      setLeaderboard(leaders);
    })();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      {leaderboard.length === 0 ? (
        <p>There are not results</p>
      ) : (
        <ul>
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .map((player) => (
              <li key={player._id}>
                {player.name} - {player.score}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
