import { BACKEND_URL } from '@/const';
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const NUMBER_POSITIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  rotation: (i + 1) * 30,
  offset: 130,
}));

const POLLING_INTERVAL = 3000; // Check every 3 seconds
const MAX_POLLING_ATTEMPTS = 10; // Max 30 seconds waiting

const AnalogClock: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentTime, setCurrentTime] = useState({ hours: 0, minutes: 0 });
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCount = useRef(0);

  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
      stopPolling();
    };
  }, []);


  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    attemptCount.current = 0;
  };

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const formattedTime = date.toLocaleTimeString();



  const checkEventStatus = useCallback(async (hours: number, minutes: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/event/${hours}/${minutes}`);

      if (res.status === 200) {
        // Event is ready
        stopPolling();
        sessionStorage.setItem("fromClock", "true");
        navigate("/event-details", { state: res.data });
      }
    } catch (error: any) {
      attemptCount.current += 1;

      if (attemptCount.current >= MAX_POLLING_ATTEMPTS) {
        stopPolling();
        setLoading(false);
        toast.error("Event generation timed out. Please try again.");
        return;
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 202) {
          // Still generating
          setStatusMessage(`Generating event... (${attemptCount.current}/${MAX_POLLING_ATTEMPTS})`);
        } else {
          setStatusMessage(error.response?.data?.message || "Please wait...");
        }
      }
    }
  }, [navigate]);

  const startPolling = useCallback((hours: number, minutes: number) => {
    setCurrentTime({ hours, minutes });
    attemptCount.current = 0;

    // Initial check immediately
    checkEventStatus(hours, minutes);

    // Then check periodically
    pollingRef.current = setInterval(() => {
      checkEventStatus(hours, minutes);
    }, POLLING_INTERVAL);
  }, [checkEventStatus]);

  const handleClockClick = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setStatusMessage("Starting generation...");

    try {
      const res = await axios.post(`${BACKEND_URL}/event/${hours}/${minutes}`);

      switch (res.status) {
        case 200:
          // Already exists
          sessionStorage.setItem("fromClock", "true");
          navigate("/event-details", { state: res.data });
          break;

        case 202:
          // Being generated
          setStatusMessage(res.data.message);
          startPolling(hours, minutes);
          break;

        case 503:
          // System busy
          setLoading(false);
          toast.error(res.data.message);
          break;

        default:
          setLoading(false);
          toast.error("Unexpected response");
      }
    } catch (error: any) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Request failed");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  }, [hours, minutes, navigate, loading, startPolling]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: "#fff" }} />
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {statusMessage || `Generating event for ${hours}:${minutes.toString().padStart(2, '0')}`}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#aaa",
              mt: 2,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" }
            }}
            onClick={() => {
              stopPolling();
              setLoading(false);
            }}
          >
            Cancel
          </Typography>
        </Box>
      )}

      <Box
        onClick={handleClockClick}
        sx={{
          position: "relative",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, #1e1e1e, #0a0a0a)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05)",
          cursor: "pointer",
        }}
      >
        {/* Digital time display */}
        <Typography
          variant="h6"
          sx={{
            mt: 5,
            width: "100%",
            textAlign: "center",
            color: "#fafafa",
            fontFamily: "Roboto Mono, monospace",
            letterSpacing: 2,
          }}
        >
          {formattedTime}
        </Typography>

        {/* Center dot */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 14,
            height: 14,
            background: "#fafafa",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            boxShadow: "0 0 10px rgba(255,255,255,0.6)",
          }}
        />

        {/* Hour, Minute, Second Hands */}
        {[
          { deg: hourDeg, length: 90, width: 8, color: "#fafafa", transition: "0.5s ease-in-out" },
          { deg: minuteDeg, length: 120, width: 6, color: "#bbbbbb", transition: "0.3s ease-in-out" },
          { deg: secondDeg, length: 140, width: 2, color: "#e33", transition: "0.1s linear" },
        ].map((hand, idx) => (
          <Box
            key={idx}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: hand.width,
              height: hand.length,
              background: hand.color,
              borderRadius: hand.width,
              transformOrigin: "bottom center",
              transform: `translate(-50%, -100%) rotate(${hand.deg}deg)`,
              transition: `transform ${hand.transition}`,
              filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
            }}
          />
        ))}

        {/* Clock markers */}
        {[...Array(60)].map((_, i) => {
          const isHour = i % 5 === 0;
          return (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: isHour ? 6 : 2,
                height: isHour ? 16 : 8,
                background: "#ddd",
                transform: `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-150px)`,
                transformOrigin: "bottom center",
                opacity: isHour ? 1 : 0.6,
              }}
            />
          );
        })}

        {/* Numbers 1 to 12 */}
        {NUMBER_POSITIONS.map((num) => (
          <Typography
            key={num.value}
            variant="body1"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${num.rotation}deg) translateY(-140px) rotate(-${num.rotation}deg)`,
              color: "#fafafa",
              fontWeight: 500,
            }}
          >
            {num.value}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default AnalogClock;