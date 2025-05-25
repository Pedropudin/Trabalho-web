import React, { useState } from 'react';
import { Switch, FormControlLabel, Typography, Button } from '@mui/material';

export default function Privacidade({ onVoltar }) {
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [compartilharDados, setCompartilharDados] = useState(false);

  return (
    <div className="editarperfil-card-form">
      <Typography variant="h5" gutterBottom>Configurações de Privacidade</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={notificacoesEmail}
            onChange={() => setNotificacoesEmail(!notificacoesEmail)}
          />
        }
        label="Permitir notificações por e-mail"
      />

      <FormControlLabel
        control={
          <Switch
            checked={compartilharDados}
            onChange={() => setCompartilharDados(!compartilharDados)}
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
