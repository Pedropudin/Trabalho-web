import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import ModalCarteira from './ModalCarteira';
import '../../../styles/EditarPerfil.css';

export default function Carteira({ onVoltar }) {
  const [saldo, setSaldo] = useState(150.00);
  const [cartoes, setCartoes] = useState([
    { bandeira: 'Visa', final: '1234', numero: '**** **** **** 1234' }
  ]);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={2}>
        Carteira
      </Typography>
      <Typography align="center" fontSize={18} mb={2}>
        Saldo disponível: <b style={{ color: '#1976d2' }}>{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2, fontWeight: 600, fontSize: 16 }}
        onClick={() => setModalAberto(true)}
      >
        Adicionar saldo
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        sx={{ mb: 2, fontWeight: 500, fontSize: 15 }}
        onClick={onVoltar}
      >
        Voltar ao Perfil
      </Button>
      <Box mt={3}>
        <Typography fontWeight={500} mb={1} align="center">Cartões cadastrados:</Typography>
        <Paper elevation={0} sx={{ background: '#f8f9fb', p: 2, borderRadius: 2 }}>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {cartoes.length === 0 ? (
              <li style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', listStyle: 'none', padding: 0 }}>
                <span style={{ fontSize: 18, color: '#1976d2', fontWeight: 600 }}>💳</span><br/>
                Nenhum cartão cadastrado ainda.<br/>
                <span style={{ fontSize: 13, color: '#aaa' }}>Adicione um cartão para facilitar suas compras!</span>
              </li>
            ) : (
              cartoes.map((c, i) => (
                <li key={i} style={{ fontSize: 15 }}>{c.bandeira} <span style={{ color: '#888' }}>{c.numero}</span></li>
              ))
            )}
          </ul>
        </Paper>
      </Box>
      {modalAberto && (
        <ModalCarteira
          saldo={saldo}
          cartoes={cartoes}
          setCartoes={setCartoes}
          setSaldo={setSaldo}
          onClose={() => setModalAberto(false)}
        />
      )}
    </Paper>
  );
}