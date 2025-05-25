import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Button } from '@mui/material';

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

  return (
    <div className="editarperfil-card-form">
      <Typography variant="h5" gutterBottom>
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

      <div style={{ marginTop: '1rem' }}>
        <Button variant="contained" color="primary" onClick={onVoltar}>
          Voltar ao Perfil
        </Button>
      </div>
    </div>
  );
}