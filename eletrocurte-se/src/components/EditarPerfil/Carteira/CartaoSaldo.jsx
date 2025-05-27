import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function CartaoSaldo({ cartao, saldo, onAdicionarSaldo }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        marginBottom: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {cartao.bandeira} **** {cartao.final}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Saldo: {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onAdicionarSaldo(cartao.final)}
      >
        Adicionar Saldo
      </Button>
    </Box>
  );
}
