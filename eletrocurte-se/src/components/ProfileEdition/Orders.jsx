// -----------------------------------------------------------------------------
// Orders.jsx
// User orders/history component for profile edition.
// - Fetches and displays the user's orders from the backend.
// - Shows order status (pending, in transit, delivered), creation date, and details.
// - If no orders, displays a friendly message.
// - Uses Material-UI Table, Accordion, Chip, Skeleton, Snackbar for UI/UX.
// - Props:
//    - onVoltar: function called when clicking "Back to Profile".
// - State:
//    - orders: array of user orders
//    - loading: loading state for skeleton
//    - snackbar: feedback for details
// - Consistency: All data is fetched from backend, no sidebar or mock data.
// ----------------------------------------------------------------------------/

import React, { useState, useEffect } from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Button, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Snackbar, 
  Alert, 
  Skeleton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Maps order status to Chip color
const statusColor = {
  'delivered': 'success',
  'in transit': 'warning',
  'pending': 'info',
};

export default function Orders({ onVoltar }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/orders`)
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Displays order details in the snackbar
  const handleShowDetails = (pedido) => {
    setSnackbar({ open: true, message: `Order details #${pedido._id || pedido.id}: ${pedido.detalhes || JSON.stringify(pedido.itens)}`, severity: 'info' });
  };

  // Displays friendly message if no orders exist
  if (!loading && (!orders || orders.length === 0)) {
    return (
      <Paper elevation={3} sx={{ maxWidth: 600, margin: '40px auto', p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>My Orders</Typography>
        <Typography variant="body1" sx={{ color: '#007b99', fontWeight: 600 }}>
          You haven't purchased any products yet.<br />
          Complete a purchase and your orders will appear here!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 4, width: '100%' }} onClick={onVoltar}>
          Back to Profile
        </Button>
      </Paper>
    );
  }

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
            <TableCell>
              {/* This column shows the order creation date, not delivery date */}
              Order Date
            </TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((pedido) => (
            <TableRow key={pedido._id || pedido.id}>
              <TableCell>{pedido._id || pedido.id}</TableCell>
              <TableCell>
                <Chip label={pedido.status} color={statusColor[pedido.status] || 'default'} />
                {/* Chip: displays order status with corresponding color */}
              </TableCell>
              <TableCell>
                {pedido.createdAt ? new Date(pedido.createdAt).toLocaleString() : '-'}
              </TableCell>
              <TableCell>
                <Accordion sx={{ boxShadow: 'none' }}>
                  {/* Accordion: expands to show order details */}
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">View details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      {pedido.itens && Array.isArray(pedido.itens)
                        ? pedido.itens.map((item, idx) => (
                            <div key={idx}>
                              {item.name} x{item.quantity} - ${item.price}
                            </div>
                          ))
                        : JSON.stringify(pedido.itens)}
                    </Typography>
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