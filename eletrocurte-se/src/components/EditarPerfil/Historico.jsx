import React, { useState } from 'react';
import { Button, Typography, Stack, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

export default function Historico({ onVoltar }) {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleClick = (rota, msg) => {
    navigate(rota);
    setSnackbar({ open: true, message: msg });
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Histórico
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.HIST_COMPRAS, 'Acessando histórico de compras...')}
        >
          Ver Histórico de Compras
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.HIST_PRODUTOS, 'Acessando histórico de produtos visualizados...')}
        >
          Ver Histórico de Produtos Visualizados
        </Button>
        <Button
          variant="contained"
          onClick={onVoltar}
        >
          Voltar ao Perfil
        </Button>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}