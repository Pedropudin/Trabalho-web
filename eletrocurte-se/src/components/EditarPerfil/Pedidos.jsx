import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Snackbar, Alert, Skeleton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Pedidos Component
// Displays a list of the user's orders with status, date, and details
// Props:
// - onVoltar: function called when clicking to return to the profile
//
// Data:
// - pedidos: static array simulating user orders
// - statusColor: maps order status to Chip color
//
// States:
// - snackbar: controls visual feedback
// - loading: simulates initial loading
//
// Functions:
// - handleShowDetails: displays order details in the snackbar
//
// Logic:
// - Shows Skeleton while loading
// - Table displays ID, status (with colored Chip), date, and details (Accordion)
// - Button to go back to the profile
// - Visual feedback with Snackbar/Alert
// - Inline CSS (sx) for spacing, width, and centering

const pedidos = [
  // Static array simulating user orders
  { id: 12345, status: 'Delivered', data: '20/05/2025', detalhes: 'Order delivered successfully. Product: Fone HyperX.' },
  { id: 12344, status: 'In transit', data: null, detalhes: 'Your order is on the way. Product: Mouse Logitech.' },
  { id: 12343, status: 'Awaiting payment', data: null, detalhes: 'Awaiting payment confirmation. Product: Teclado Redragon.' },
];

// Maps order status to Chip color
const statusColor = {
  'Delivered': 'success',
  'In transit': 'warning',
  'Awaiting payment': 'info',
};

export default function Pedidos({ onVoltar }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' }); // State for visual feedback
  const [loading, setLoading] = useState(true); // Simulates initial loading

  useEffect(() => {
    // Simulates initial loading (e.g., API request)
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Displays order details in the snackbar
  const handleShowDetails = (pedido) => {
    setSnackbar({ open: true, message: `Order details #${pedido.id}: ${pedido.detalhes}`, severity: 'info' });
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: 'auto', mt: 4, mb: 4 }}>
      {/* TableContainer: container for the table, uses Paper for visual emphasis
          sx: max width, centering, top/bottom margins */}
      <Typography variant="h5" align="center" sx={{ mt: 2, mb: 2 }}>My Orders</Typography>
      {loading ? (
        <>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        </>
      ) : (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell>{pedido.id}</TableCell>
              <TableCell>
                <Chip label={pedido.status} color={statusColor[pedido.status]} />
                {/* Chip: displays order status with corresponding color */}
              </TableCell>
              <TableCell>
                {pedido.data ? pedido.data : '-'}
              </TableCell>
              <TableCell>
                <Accordion sx={{ boxShadow: 'none' }}>
                  {/* Accordion: expands to show order details */}
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">View details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{pedido.detalhes}</Typography>
                    <Button size="small" onClick={() => handleShowDetails(pedido)} sx={{ mt: 1 }}>
                      Notify
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <Button variant="contained" color="primary" onClick={onVoltar} sx={{ m: 2 }}>
        {/* Button: main action button
            variant="contained": filled background
            color="primary": main theme color
            sx: m=2 (margin) */}
        Back to Profile
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
}