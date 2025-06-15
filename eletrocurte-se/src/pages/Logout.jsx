import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';
import HeaderLogs from '../components/HeaderLogs';
import ROUTES from '../routes';
import '../styles/Logout.css';
import Footer from '../components/Footer';

/*
  Logout page of the system.
  - Displays success message, countdown and button to return to Home.
  - Removes authentication flags from localStorage and redirects automatically.
  - Centered and responsive layout using Material-UI.
*/

export default function Logout() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const [countdown, setCountdown] = useState(10);

  // Protect logout screen: if not logging out, redirect to home
  useEffect(() => {
    // If not just logged out, block access to this page
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate(ROUTES.HOME_PAGE, { replace: true });
    }
    // Replace history to prevent going back to logout page
    window.history.replaceState({}, document.title, window.location.pathname);

    // Remove login flags on logout and start countdown
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    setCountdown(10);
    if (timerRef.current) timerRef.current.textContent = 10;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        if (timerRef.current) timerRef.current.textContent = prev - 1;
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [navigate]);

  // useEffect to redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      navigate(ROUTES.HOME_PAGE, { replace: true });
    }
  }, [countdown, navigate]);

  // Handler for immediate return button
  function handleHomeClick() {
    clearInterval(intervalRef.current);
    navigate(ROUTES.HOME_PAGE, { replace: true });
  }

  return (
    <>
      {/* Header with centered logo */}
      <HeaderLogs />

      {/* Main centered container with message and button */}
      <Box sx={{ minHeight: '100vh', background: '#f5fafd', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <Paper elevation={6} sx={{ maxWidth: 420, width: '100%', p: { xs: 3, md: 5 }, borderRadius: 4, mt: 6, textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#004d66', mb: 2 }}>
            Logout
          </Typography>
          <Typography variant="h6" sx={{ color: '#007b99', mb: 2 }}>
            Logout operation completed successfully
          </Typography>
          <Typography sx={{ color: '#333', mb: 2 }}>
            Thank you for visiting us, come back soon ;)
          </Typography>
          <Typography sx={{ color: '#555', mb: 2 }}>
            You will be redirected in <span ref={timerRef}>{countdown}</span> seconds...
          </Typography>
          <Button variant="contained" color="primary" onClick={handleHomeClick} sx={{ mt: 2, fontWeight: 600, borderRadius: 2, background: '#007b99', '&:hover': { background: '#004d66' } }}>
            Return to Home
          </Button>
        </Paper>
      </Box>

      {/* Institutional footer */}
      <Footer />
    </>
  );
}