import React, { useState } from 'react';
import { Button, Typography, Stack, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

// Componente Historico
// Exibe opções para o usuário acessar o histórico de compras e de produtos visualizados
// Props:
// - onVoltar: função chamada ao clicar em voltar ao perfil
//
// Usa useNavigate do react-router-dom para navegação entre rotas do app
// Usa estado snackbar para feedback visual ao usuário ao navegar
// Usa Paper, Typography, Stack, Button, Snackbar, Alert do Material UI para layout e feedback
// Usa sx para espaçamento, centralização e bordas arredondadas
//
// Lógica:
// - handleClick: navega para a rota desejada e exibe mensagem no snackbar
// - O Paper centraliza e destaca o conteúdo
// - Stack organiza os botões verticalmente com espaçamento
// - Snackbar/Alert mostra mensagem temporária ao usuário

export default function Historico({ onVoltar }) {
  const navigate = useNavigate(); // Hook para navegação entre rotas
  const [snackbar, setSnackbar] = useState({ open: false, message: '' }); // Estado para controlar o feedback visual

  // Função para navegar para uma rota e exibir mensagem no snackbar
  const handleClick = (rota, msg) => {
    navigate(rota);
    setSnackbar({ open: true, message: msg });
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      {/* Paper: container visual com sombra e bordas arredondadas
          elevation={4}: nível de sombra
          sx: padding, largura máxima, centralização, borda arredondada */}
      <Typography variant="h5" gutterBottom align="center">
        {/* Typography: título grande centralizado
            variant="h5": tamanho grande
            gutterBottom: margem inferior
            align="center": centraliza texto */}
        Histórico
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {/* Stack: organiza botões em coluna com espaçamento
            spacing={2}: espaço entre itens
            sx: mt=2 (margem superior) */}
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.HIST_COMPRAS, 'Acessando histórico de compras...')}
        >
          {/* Button: botão de ação
              variant="outlined": borda visível, fundo transparente */}
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
          {/* variant="contained": botão com fundo preenchido (destaque) */}
          Voltar ao Perfil
        </Button>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {/* Snackbar: feedback visual temporário
            Alert: mensagem informativa */}
        <Alert severity="info" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}