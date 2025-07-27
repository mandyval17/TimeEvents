import { Box, Typography } from "@mui/material";
import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const EventDetailsPage: React.FC = () => {
  const location = useLocation();
  const data = location.state;

  const navigate = useNavigate();
  useEffect(() => {
    const cameFromClock = sessionStorage.getItem("fromClock");
    if (!data || !cameFromClock) {
      navigate("/clock", { replace: true });
    } else {
      sessionStorage.removeItem("fromClock");
    }
  }, [data, navigate]);

  if (!data) return <Typography>No event data found</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {data.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {data.exactDate} | {data.exactTime}
      </Typography>
      <Box my={2}>
        <img src={data.imageUrl} alt={data.title} style={{ width: "100%", maxWidth: 600 }} />
      </Box>
      <Typography variant="body1" paragraph>
        {data.description}
      </Typography>
      <Typography variant="body2">
        <a href={data.wikiLink} target="_blank" rel="noopener noreferrer">
          Read more on Wikipedia
        </a>
      </Typography>
    </Box>
  );
};

export default EventDetailsPage;
