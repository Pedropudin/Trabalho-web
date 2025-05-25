import React from 'react';
import { Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

export default function Historico({ onVoltar }) {
  const navigate = useNavigate();

  return (
    <div className="editarperfil-card-form">
      <Typography variant="h5" gutterBottom>
        Histórico
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(ROUTES.HIST_COMPRAS)}
        >
          Ver Histórico de Compras
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(ROUTES.HIST_PRODUTOS)}
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
    </div>
  );
}
