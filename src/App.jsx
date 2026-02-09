import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";

const perfectSong = "/song.mp3";

function Balloons() {
  const balloons = Array.from({ length: 30 });

  return (
    <div style={styles.balloonContainer}>
      {balloons.map((_, i) => (
        <span
          key={i}
          style={{
            ...styles.emojiBalloon,
            left: Math.random() * 100 + "%",
            animationDuration: 6 + Math.random() * 6 + "s",
            fontSize: 30 + Math.random() * 30 + "px",
          }}
        >
          🎈
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const softConfettiRef = useRef(null);
  const gifs = [
    "https://media.tenor.com/4bV9ylEOWpgAAAAi/bubu-dudu-sseeyall.gif",
    "https://media.tenor.com/2bw-Zzp-mTMAAAAi/bear-hug.gif",
    "https://media.tenor.com/skrULsl5twcAAAAi/bubududukiwi-twitter.gif",
    "https://media.tenor.com/OrxXcqX25KcAAAAi/dudu-bubu-love-gif.gif",
    "https://media.tenor.com/CDg7uH_hD84AAAAi/tkthao219-bubududu.gif",
    "https://media.tenor.com/F9Q3thp6tzUAAAAi/bubu-bubu-dudu.gif"
  ];
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  useEffect(() => {
    const audio = new Audio(perfectSong);
    audio.loop = true;
    audio.play().catch(() => {});
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (!completed) return;

    const interval = setInterval(() => {
      setCurrentGifIndex((prev) =>
        prev === gifs.length - 1 ? 0 : prev + 1
      );
    }, 2500); // change every 2.5 seconds

    return () => clearInterval(interval);
  }, [completed]);

  // -----------------------------
  // HOLD LOGIC (Safe Version)
  // -----------------------------
  useEffect(() => {
    return () => {
      if (softConfettiRef.current) {
        cancelAnimationFrame(softConfettiRef.current);
      }
    };
  }, []);

  const startHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setCompleted(true);
          triggerConfetti();
          startSoftConfetti();
          if (audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.log("Autoplay blocked:", err);
            });
          }
          return 100;
        }
        return prev + 1;
      });
    }, 20);
  };


  const startSoftConfetti = () => {
    const duration = 1000 * 60; // run for 1 minute
    const animationEnd = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5, // small amount
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < animationEnd) {
        softConfettiRef.current = requestAnimationFrame(frame);
      }
    })();
  };


  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!completed && progress < 20) {
      setProgress(0);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 600,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const moveNoButton = (e) => {
    const button = e.target;

    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    button.style.position = "fixed";
    button.style.left = randomX + "px";
    button.style.top = randomY + "px";
    button.style.transform = `rotate(${Math.random() * 360}deg)`;
  };

  const getBatteryColor = () => {
    if (progress < 30) return "#ff4d4d";
    if (progress < 70) return "#ff9a3c";
    return "#4caf50";
  };

  // -----------------------------
  // TYPEWRITER TEXT
  // -----------------------------
  const questionText1 = useInfiniteTypewriter(
    "Will you be my Valentine? ❤️",
    70,
  
  );

  const questionText2 = useInfiniteTypewriter(
    "You’ve had my heart forever ❤️",
    70,
    
  );

  const questionText3 = useInfiniteTypewriter(
    "Happy Valentine’s Day, My Love #SPForever 💖",
    70,
    2000
  );

  return (
    <div style={styles.wrapper}>
      {/* WAITING GIF */}
      <audio ref={audioRef} src={perfectSong} preload="auto" />
      {accepted && !completed && (
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>💕</div>
      )}

      {/* FINAL GIF */}
      {completed && (
        <img
          src={gifs[currentGifIndex]}
          alt="cute love gif"
          style={styles.gif}
        />
      )}

      {/* STEP 1 – QUESTION */}
      {!accepted && (
        <div style={styles.questionBox}>
          <h1 style={styles.title}>
            {questionText1}
            <span style={styles.cursor}>|</span>
          </h1>

          <div style={styles.buttonContainer}>
            <button
              style={styles.yesBtn}
              onClick={() => setAccepted(true)}
            >
              Yes 💖
            </button>

            <button
              style={styles.noBtn}
              onMouseMove={moveNoButton}
              onTouchStart={moveNoButton}
            >
              No 🙈
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 – HOLD HEART */}
      {accepted && !completed && (
        <>
          <h2 style={{ marginBottom: "20px" }}>
            Then hold my heart ❤️
          </h2>

          <div
            style={styles.heart}
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}

          >
            ❤️
          </div>

          <div style={styles.battery}>
            <div
              style={{
                ...styles.batteryFill,
                height: `${progress}%`,
                background: getBatteryColor(),
                boxShadow:
                  progress > 70
                    ? "0 0 20px rgba(255,0,0,0.6)"
                    : "none",
              }}
            />
          </div>
        </>
      )}

      {/* STEP 3 – FINAL MESSAGE */}
      {completed && (
        <>
          <Balloons />
          <div style={styles.message}>
            <h1 style={styles.title}>
              {questionText2}
              <span style={styles.cursor}>|</span>
            </h1>
            <p style={styles.title}>
              {questionText3}
              <span style={styles.cursor}>|</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ----------------------------------
// STYLES
// ----------------------------------

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    fontFamily: "Playfair Display, serif",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },

  questionBox: {
    position: "relative",
  },

  title: {
    fontSize: "32px",
  },

  buttonContainer: {
    marginTop: "30px",
    position: "relative",
    height: "150px",
  },

  yesBtn: {
    padding: "12px 30px",
    fontSize: "18px",
    borderRadius: "30px",
    border: "none",
    background: "#ff4d6d",
    color: "white",
    cursor: "pointer",
    marginRight: "20px",
  },

  noBtn: {
    padding: "12px 30px",
    fontSize: "18px",
    borderRadius: "30px",
    border: "none",
    background: "#eee",
    cursor: "pointer",
  },

  heart: {
    fontSize: "130px",
    cursor: "pointer",
    marginBottom: "30px",
    transition: "0.2s ease",
  },

  battery: {
    width: "80px",
    height: "180px",
    border: "4px solid #333",
    borderRadius: "12px",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
    background: "white",
  },

  batteryFill: {
    width: "100%",
    transition: "height 0.2s ease, background 0.3s ease",
  },

  message: {
    animation: "fadeIn 1s ease forwards",
  },

  cursor: {
    marginLeft: "5px",
    animation: "blink 1s infinite",
  },

  gif: {
    marginTop: "25px",
    width: "180px",
    animation: "fadeIn 1.5s ease forwards",
  },

  waitingGif: {
    marginTop: "20px",
    width: "150px",
    animation: "fadeIn 0.5s ease forwards",
  },


  balloon: {
    position: "absolute",
    bottom: "-150px",
    width: "40px",
    height: "60px",
    borderRadius: "50%",
    animationName: "floatUp",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  balloonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 0,
  },

  emojiBalloon: {
    position: "absolute",
    bottom: "-50px",
    animationName: "floatUp",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },


};

// ----------------------------------
// INFINITE TYPEWRITER HOOK
// ----------------------------------

function useInfiniteTypewriter(text, speed = 80, pause = 1500) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      if (!isDeleting) {
        setDisplayedText(text.slice(0, index + 1));
        index++;

        if (index === text.length) {
          timeout = setTimeout(() => {
            isDeleting = true;
          }, pause);
        }
      } else {
        setDisplayedText(text.slice(0, index - 1));
        index--;

        if (index === 0) {
          isDeleting = false;
        }
      }

      timeout = setTimeout(type, speed);
    };

    type();

    return () => clearTimeout(timeout);
  }, [text, speed, pause]);

  return displayedText;
}