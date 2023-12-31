// Получение списка рекордов игры с сервера
const link = "https://snake-server-1w3c.onrender.com";
const fetchLeaderboard = async () => {
  const response = await fetch(`${link}/leaderboard`);
  return response.ok && response.json();
};

const recordNewUser = async (userObj) => {
  console.log(userObj);
  const response = await fetch(`${link}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  });

  return response.ok && response.json();
};

export { fetchLeaderboard, recordNewUser };
