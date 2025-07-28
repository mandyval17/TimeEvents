// src/pages/EventDetailsPage.tsx
import { Box, Typography } from "@mui/material";
import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const EventDetailsPage: React.FC = () => {
  const htmlString = useLocation().state as string;
  const navigate = useNavigate();

  useEffect(() => {
    const cameFromClock = sessionStorage.getItem("fromClock");
    if (!htmlString || !cameFromClock) {
      navigate("/", { replace: true });
    } else {
      sessionStorage.removeItem("fromClock");
    }
  }, [htmlString, navigate]);

  if (!htmlString) return <Typography>No event data found</Typography>;

  return (
    <Box
      p={4}
      // ensure any inline styles in the HTML reset appropriately
      sx={{ "& img": { maxWidth: "100%" }, "& a": { wordBreak: "break-all" } }}
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default EventDetailsPage;
