import React, { useState, useMemo, useEffect } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import ModalCarteira from './ModalCarteira';
import CartoesList from './CartoesList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import '../../../styles/EditarPerfil.css';

// Componente principal da Carteira do usuário
// - Gerencia saldo e cartões usando localStorage
// - Permite adicionar saldo e excluir cartões
// - Usa ModalCarteira para adicionar saldo e CartoesList para listar cartões
// - Exibe botões para adicionar saldo e voltar ao perfil
// - Utiliza Material UI para layout e diálogos
// - Atualiza localStorage sempre que saldo ou cartões mudam
// - Confirma exclusão de cartão com diálogo

export default function Carteira({ onVoltar }) {
  // Inicializa saldo com localStorage, ou 0 se vazio
  const [saldo, setSaldo] = useState(() => {
    const saldoArmazenado = localStorage.getItem('carteiraSaldo');
    return saldoArmazenado ? parseFloat(saldoArmazenado) : 0;
  });

  // Inicializa cartões com localStorage, ou com um cartão padrão
  const [cartoes, setCartoes] = useState(() => {
    const cartoesArmazenados = localStorage.getItem('carteiraCartoes');
    return cartoesArmazenados
      ? JSON.parse(cartoesArmazenados)
      : [{ bandeira: 'Visa', final: '1234', numero: '**** **** **** 1234' }];
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartaoParaExcluir, setCartaoParaExcluir] = useState(null);

  const cartoesValidados = useMemo(() => {
    return cartoes.map(c => ({
      ...c,
      saldo: c.saldo ?? 0,
    }));
  }, [cartoes]);

  // Atualiza o localStorage sempre que o saldo mudar
  useEffect(() => {
    localStorage.setItem('carteiraSaldo', saldo.toString());
  }, [saldo]);

  // Atualiza o localStorage sempre que os cartões mudarem
  useEffect(() => {
    localStorage.setItem('carteiraCartoes', JSON.stringify(cartoes));
  }, [cartoes]);

  function handleExcluirCartao(final) {
    setCartaoParaExcluir(final);
    setDialogOpen(true);
  }

  function confirmarExclusao() {
    setCartoes(prev => prev.filter(c => c.final !== cartaoParaExcluir));
    setDialogOpen(false);
    setCartaoParaExcluir(null);
  }

  function cancelarExclusao() {
    setDialogOpen(false);
    setCartaoParaExcluir(null);
  }

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={2}>
        {/* variant="h4": título grande */}
        {/* fontWeight={700}: deixa o texto em negrito */}
        {/* color="primary": usa a cor principal do tema */}
        {/* mb={2}: adiciona margem inferior (margin-bottom) para espaçamento */}
        Carteira
      </Typography>

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

      {/* Espaço extra antes dos botões */}
      <div style={{ height: 24 }} />

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

      <Dialog open={dialogOpen} onClose={cancelarExclusao}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir o cartão selecionado?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao} color="inherit">Cancelar</Button>
          <Button onClick={confirmarExclusao} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}