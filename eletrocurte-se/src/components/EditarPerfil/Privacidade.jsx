import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Button, Paper, Snackbar, Alert } from '@mui/material';

// Componente Privacidade
// Permite ao usuário configurar preferências de privacidade (notificações e compartilhamento de dados)
// Props:
// - onVoltar: função chamada ao clicar em voltar ao perfil
//
// Estados:
// - notificacoesEmail: controla permissão de notificações por e-mail
// - compartilharDados: controla permissão de compartilhamento de dados
// - snackbar: controla feedback visual
//
// Lógica:
// - Preferências são salvas e lidas do localStorage
// - handleSalvar: exibe feedback ao salvar preferências
// - Layout com Paper, Typography, Switch, FormControlLabel, Button, Snackbar/Alert
// - CSS inline (sx) para espaçamento, largura, centralização

export default function Privacidade({ onVoltar }) {
  // Estado inicial lendo preferências do localStorage
  const [notificacoesEmail, setNotificacoesEmail] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('preferenciasPrivacidade'));
    return prefs?.notificacoesEmail ?? true;
  });

  const [compartilharDados, setCompartilharDados] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('preferenciasPrivacidade'));
    return prefs?.compartilharDados ?? false;
  });

  const [snackbar, setSnackbar] = useState(false); // Estado para feedback visual

  // Atualiza o localStorage sempre que as preferências mudam
  useEffect(() => {
    localStorage.setItem(
      'preferenciasPrivacidade',
      JSON.stringify({
        notificacoesEmail,
        compartilharDados
      })
    );
  }, [notificacoesEmail, compartilharDados]);

  // Exibe feedback ao salvar preferências
  const handleSalvar = async () => {
    // Salva no backend também
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${process.env.REACT_APP_API_URL}/usuarios/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacidade: {
            notificacao: notificacoesEmail,
            dadosCompartilhados: compartilharDados
          }
        })
      });
    } catch {}
    setSnackbar(true);
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
        Configurações de Privacidade
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={notificacoesEmail}
            onChange={() => setNotificacoesEmail((prev) => !prev)}
            sx={{mt:2}}
          />
        }
        label="Permitir notificações por e-mail"
      />
      <FormControlLabel
        control={
          <Switch
            checked={compartilharDados}
            onChange={() => setCompartilharDados((prev) => !prev)}
            sx={{mt:2}}
          />
        }
        label="Compartilhamento de dados com parceiros"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSalvar}
        sx={{ mt: 2 }}
        fullWidth
      >
        {/* Button: botão de ação principal
            variant="contained": fundo preenchido
            color="primary": cor principal do tema
            sx: mt=2 (margem superior)
            fullWidth: ocupa toda a largura */}
        Salvar Preferências
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onVoltar}
        sx={{ mt: 2 }}
        fullWidth
      >
        {/* Button: botão secundário
            variant="outlined": borda visível, fundo transparente
            color="inherit": cor neutra
            sx: mt=2 (margem superior)
            fullWidth: ocupa toda a largura */}
        Confirmar e voltar ao Perfil
      </Button>
      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Preferências salvas com sucesso!
        </Alert>
      </Snackbar>
    </Paper>
  );
}