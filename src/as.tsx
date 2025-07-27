import { Box } from '@mui/material';

export default function ArizonSystems() {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#fff'
    }}>
      <img
        src="/src/assets/arizon.png"
        alt="Arizon Systems"
        style={{
          width: '240px',
          // height: '240px',
          animation: 'scaleAnimation 2s infinite alternate ease-in-out'
        }}
      />

      {/* CSS Keyframes Animation */}
      <style>
        {`
          @keyframes scaleAnimation {
            from {
              width: 240px;
            }
            to {
              width: 320px;
            }
          }
        `}
      </style>
    </Box>
  );
}