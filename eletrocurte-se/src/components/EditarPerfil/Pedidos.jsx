import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Snackbar, Alert, Skeleton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const pedidos = [
  { id: 12345, status: 'Entregue', data: '20/05/2025', detalhes: 'Pedido entregue com sucesso. Produto: Fone HyperX.' },
  { id: 12344, status: 'Em transporte', data: null, detalhes: 'Seu pedido está a caminho. Produto: Mouse Logitech.' },
  { id: 12343, status: 'Aguardando pagamento', data: null, detalhes: 'Aguardando confirmação do pagamento. Produto: Teclado Redragon.' },
];

const statusColor = {
  'Entregue': 'success',
  'Em transporte': 'warning',
  'Aguardando pagamento': 'info',
};

export default function Pedidos({ onVoltar }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const handleShowDetails = (pedido) => {
    setSnackbar({ open: true, message: `Detalhes do pedido #${pedido.id}: ${pedido.detalhes}`, severity: 'info' });
  };
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: 'auto', mt: 4, mb: 4 }}>
      <Typography variant="h5" align="center" sx={{ mt: 2 }}>Meus Pedidos</Typography>
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
            <TableCell>ID do Pedido</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data de Entrega</TableCell>
            <TableCell>Detalhes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell>{pedido.id}</TableCell>
              <TableCell>
                <Chip label={pedido.status} color={statusColor[pedido.status]} />
              </TableCell>
              <TableCell>
                {pedido.data ? pedido.data : '-'}
              </TableCell>
              <TableCell>
                <Accordion sx={{ boxShadow: 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">Ver detalhes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{pedido.detalhes}</Typography>
                    <Button size="small" onClick={() => handleShowDetails(pedido)} sx={{ mt: 1 }}>
                      Notificar
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
        Voltar ao Perfil
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