import { useState, useEffect, useRef } from "react";
import { recordNewUser } from "../apiServices/apiServices";

const Game = () => {
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 5, y: 5 });
  const directionRef = useRef("RIGHT");
  const intervalRef = useRef(null);

  const gridSize = 20;
  const canvasSize = 20;

  useEffect(() => {
    if (!name) {
      return;
    }
    const context = canvasRef && canvasRef.current.getContext("2d");
    const snake = snakeRef.current;

    const drawSnake = () => {
      context.fillStyle = "green";
      for (let i = 0; i < snake.length; i++) {
        context.fillRect(
          snake[i].x * gridSize,
          snake[i].y * gridSize,
          gridSize,
          gridSize
        );
      }
    };

    const drawFood = () => {
      context.fillStyle = "red";
      context.fillRect(
        foodRef.current.x * gridSize,
        foodRef.current.y * gridSize,
        gridSize,
        gridSize
      );
    };

    const moveSnake = () => {
      const head = { x: snake[0].x, y: snake[0].y };

      if (directionRef.current === "RIGHT") head.x++;
      if (directionRef.current === "LEFT") head.x--;
      if (directionRef.current === "UP") head.y--;
      if (directionRef.current === "DOWN") head.y++;

      snake.unshift(head);

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((prevScore) => prevScore + getFoodPoints());
        generateFood();
      } else {
        snake.pop();
      }
    };

    const checkCollision = () => {
      const head = snake[0];

      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize
      ) {
        endGame();
      }

      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          endGame();
          break;
        }
      }
    };

    const endGame = () => {
      clearInterval(intervalRef.current);
      setGameOver(true);
    };

    const generateFood = () => {
      foodRef.current = {
        x: Math.floor(Math.random() * canvasSize),
        y: Math.floor(Math.random() * canvasSize),
      };
    };

    const getFoodPoints = () => {
      const random = Math.random();

      if (random < 0.6) return 1;
      if (random < 0.9) return 5;
      return 10;
    };

    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp" && directionRef.current !== "DOWN")
        directionRef.current = "UP";
      if (event.key === "ArrowDown" && directionRef.current !== "UP")
        directionRef.current = "DOWN";
      if (event.key === "ArrowLeft" && directionRef.current !== "RIGHT")
        directionRef.current = "LEFT";
      if (event.key === "ArrowRight" && directionRef.current !== "LEFT")
        directionRef.current = "RIGHT";
    };

    document.addEventListener("keydown", handleKeyPress);

    drawSnake();
    drawFood();

    intervalRef.current = setInterval(() => {
      context.clearRect(0, 0, canvasSize * gridSize, canvasSize * gridSize);
      moveSnake();
      drawSnake();
      drawFood();
      checkCollision();
    }, 1000 / speed);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [name]);

  const handleGameOver = () => {
    setGameOver(false);
    setScore(0);
    setSpeed(1);
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = "RIGHT";
  };

  useEffect(() => {
    if (score % 50 === 0 && score !== 0) {
      setSpeed((prevSpeed) => prevSpeed + 1);
    }
  }, [score]);

  useEffect(() => {
    if (gameOver) {
      (async () => {
        await recordNewUser({ name, score });
      })();
    }
  }, [gameOver]);

  const handlePlayerName = () => {
    const name = window.prompt("Введите ваше имя");
    if (name) {
      setName(name);
    }
  };

  return (
    <div>
      {!name ? (
        <h1>For start press the button</h1>
      ) : (
        <h1>Snake Game for {name}</h1>
      )}
      {!name && <button onClick={handlePlayerName}>START</button>}

      {!gameOver ? (
        <div>
          <canvas
            style={{ border: "1px solid red" }}
            ref={canvasRef}
            width={canvasSize * gridSize}
            height={canvasSize * gridSize}
          ></canvas>
          <p>Score: {score}</p>
          <p>Speed: {speed}</p>
        </div>
      ) : (
        <>
          <h2>Game Over!</h2>
          <button onClick={handleGameOver}>Play Again</button>
        </>
      )}
    </div>
  );
};

export default Game;
