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
  Skeleton
} from '@mui/material';

// Maps order status to Chip color
const statusColor = {
  'pending': 'info',
  'in transit': 'warning',
  'delivered': 'success',
};

export default function Orders({ onVoltar }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll orders from backend every 5 seconds for status updates
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    let interval;
    async function fetchOrders() {
      if (userId) {
        // Remove referência ao token, chamada pública
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/user/${userId}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    fetchOrders();
    interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

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
            <TableCell>Products</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((pedido) => (
            <TableRow key={pedido._id || pedido.id}>
              <TableCell>{pedido._id || pedido.id}</TableCell>
              <TableCell>
                <Chip label={pedido.status || "pending"} color={statusColor[(pedido.status || "pending").toLowerCase()] || 'info'} />
              </TableCell>
              <TableCell>
                {Array.isArray(pedido.itens) && pedido.itens.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {pedido.itens.map((item, idx) => (
                      <li key={item.id + '-' + idx}>
                        {item.name || 'Product'} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No products</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <Button variant="contained" color="primary" onClick={onVoltar} sx={{ m: 2 }}>
        Back to Profile
      </Button>
    </TableContainer>
  );
}