"use client";
import { useState, useEffect, useRef } from "react";

export default function FlappyBird() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [pipeHeight, setPipeHeight] = useState(200);
  const [pipeLeft, setPipeLeft] = useState(500);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameHeight = 900;
  const gameWidth = 500;
  const gravity = 5;
  const jumpHeight = 60;
  const pipeWidth = 50;
  const pipeGap = 190;
  const pipeSpeed = 4;

  const gameAreaRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const scoreAudioRef = useRef(null);
  const jumpAudioRef = useRef(null);

  useEffect(() => {
    // Initialize audio objects
    gameOverAudioRef.current = new Audio("/assets/sounds/gameover.mp3");
    scoreAudioRef.current = new Audio("/assets/sounds/score.mp3");
    jumpAudioRef.current = new Audio("/assets/sounds/jump.mp3");
  }, []);

  useEffect(() => {
    if (birdPosition < gameHeight - 20) {
      const interval = setInterval(() => {
        setBirdPosition(birdPosition + gravity);
      }, 24);
      return () => clearInterval(interval);
    } else {
      setIsGameOver(true);
    }
  }, [birdPosition]);

  useEffect(() => {
    if (pipeLeft >= -pipeWidth) {
      const interval = setInterval(() => {
        setPipeLeft(pipeLeft - pipeSpeed);
      }, 24);
      return () => clearInterval(interval);
    } else {
      setPipeLeft(gameWidth);
      setPipeHeight(Math.floor(Math.random() * (gameHeight - pipeGap)));
      setScore(score + 1);
      if (!isGameOver) {
        scoreAudioRef.current.play(); // Play score sound when pipe resets
      }
    }
  }, [pipeLeft]);

  useEffect(() => {
    const hasCollidedWithPipe =
      birdPosition < pipeHeight ||
      birdPosition > pipeHeight + pipeGap;
    const hasCollidedWithGround = birdPosition >= gameHeight - 20;

    if (pipeLeft <= 50 && pipeLeft >= 0 && (hasCollidedWithPipe || hasCollidedWithGround)) {
      setIsGameOver(true);
    }
  }, [birdPosition, pipeHeight, pipeLeft]);

  const handleJump = () => {
    if (!isGameOver && birdPosition > jumpHeight) {
      setBirdPosition(birdPosition - jumpHeight);

      if (jumpAudioRef.current) {
        jumpAudioRef.current.play(); // Play jump sound
      }
    }
  };

  useEffect(() => {
    if (isGameOver) {
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.play(); // Play game over sound once
      }
    }
  }, [isGameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameOver, birdPosition]);

  const resetGame = () => {
    setBirdPosition(250);
    setPipeHeight(200);
    setPipeLeft(500);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div
      ref={gameAreaRef}
      onClick={handleJump}
      className="relative mx-auto mt-10 border-2 border-black overflow-hidden"
      style={{
        height: "900px", // Fixed height
        width: "500px",  // Fixed width
        backgroundImage: `url('/assets/images/background.png')`,
        backgroundSize: "cover", // Ensure the background covers the entire area
        touchAction: "none", // Prevents zoom on touch devices
      }}
    >
      <div
        className="absolute"
        style={{
          top: `${birdPosition}px`,
          left: "50px",
          width: "100px",  // Increased size for bird image
          height: "100px", // Increased size for bird image
        }}
      >
        <img
          src="/assets/images/bird.png"
          className="w-full h-full object-cover"
          alt="Bird"
        />
      </div>
      <div
        className="absolute"
        style={{
          left: `${pipeLeft}px`,
          height: `${pipeHeight}px`,
          width: `${pipeWidth}px`,
        }}
      >
        <img
          src="/assets/images/pipe-top.png"
          className="w-full h-full object-cover"
          alt="Pipe Top"
        />
      </div>
      <div
        className="absolute"
        style={{
          left: `${pipeLeft}px`,
          top: `${pipeHeight + pipeGap}px`,
          height: `${gameHeight - pipeHeight - pipeGap}px`,
          width: `${pipeWidth}px`,
        }}
      >
        <img
          src="/assets/images/pipe-bottom.png"
          className="w-full h-full object-cover"
          alt="Pipe Bottom"
        />
      </div>
      <div
        className="absolute"
        style={{
          top: "10px",
          left: "10px",
          fontSize: "18px",  // Fixed font size for score
          color: "white",
        }}
      >
        Score: {score}
      </div>
      {isGameOver && (
        <div
        className="absolute flex text-xs"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "96px", // Fixed height for game over screen
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          textAlign: "center",
          lineHeight: "96px", // Center text vertically
          cursor: "pointer",
        }}
        onClick={resetGame}
        >
        <img src="/assets/images/modi.png" alt="Modi" />
          <span className='font-extrabold'>হাসিনার খেলা শেষ! আবার চেষ্টা করুন<span className='bg-cyan-500 text-red-600'>{" CLICK HERE"}</span></span>
        </div>
      )}
    </div>
  );
}