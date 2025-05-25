import React, { useState, useMemo } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import ModalCarteira from './ModalCarteira';
import CartoesList from './CartoesList';
import '../../../styles/EditarPerfil.css';

export default function Carteira({ onVoltar }) {
  const [saldo, setSaldo] = useState(150.00);
  const [cartoes, setCartoes] = useState([
    { bandeira: 'Visa', final: '1234', numero: '**** **** **** 1234' }
  ]);
  const [modalAberto, setModalAberto] = useState(false);

  const cartoesValidados = useMemo(() => {
    return cartoes.map(c => ({
      ...c,
      saldo: c.saldo ?? 0,
    }));
  }, [cartoes]);

  function handleExcluirCartao(final) {
    const confirm = window.confirm('Tem certeza que deseja excluir este cartão?');
    if (confirm) {
      setCartoes(prev => prev.filter(c => c.final !== final));
    }
  }

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={2}>
        Carteira
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

      {/* Novo componente de cartões */}
      <CartoesList cartoes={cartoesValidados} onExcluir={handleExcluirCartao} />

      {modalAberto && (
        <ModalCarteira
          saldo={saldo}
          setSaldo={setSaldo}
          cartoes={cartoes}
          setCartoes={setCartoes}
          cartoesValidados={cartoesValidados}
          onClose={() => setModalAberto(false)}
        />
      )}
    </Paper>
  );
}