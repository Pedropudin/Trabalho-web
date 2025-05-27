import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Button, Paper, Snackbar, Alert } from '@mui/material';

export default function Privacidade({ onVoltar }) {
  // Estado inicial lendo do localStorage
  const [notificacoesEmail, setNotificacoesEmail] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('preferenciasPrivacidade'));
    return prefs?.notificacoesEmail ?? true;
  });

  const [compartilharDados, setCompartilharDados] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('preferenciasPrivacidade'));
    return prefs?.compartilharDados ?? false;
  });

  const [snackbar, setSnackbar] = useState(false);

  // Atualiza o localStorage sempre que os valores mudarem
  useEffect(() => {
    localStorage.setItem(
      'preferenciasPrivacidade',
      JSON.stringify({
        notificacoesEmail,
        compartilharDados
      })
    );
  }, [notificacoesEmail, compartilharDados]);

  const handleSalvar = () => {
    setSnackbar(true);
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Configurações de Privacidade
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={notificacoesEmail}
            onChange={() => setNotificacoesEmail((prev) => !prev)}
          />
        }
        label="Permitir notificações por e-mail"
      />

      <FormControlLabel
        control={
          <Switch
            checked={compartilharDados}
            onChange={() => setCompartilharDados((prev) => !prev)}
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
        Salvar Preferências
      </Button>

      <Button
        variant="outlined"
        color="inherit"
        onClick={onVoltar}
        sx={{ mt: 2 }}
        fullWidth
      >
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