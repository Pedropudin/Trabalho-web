import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Avatar,
  Skeleton
} from '@mui/material';

const agruparMensagensPorData = (mensagens) => {
  const hoje = new Date().toDateString();
  const ontem = new Date(Date.now() - 86400000).toDateString();

  return mensagens.reduce((acc, msg) => {
    const dataStr = new Date(msg.data).toDateString();
    let grupo = 'Anteriores';

    if (dataStr === hoje) grupo = 'Hoje';
    else if (dataStr === ontem) grupo = 'Ontem';

    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(msg);
    return acc;
  }, {});
};

export default function Mensagens({ onVoltar }) {
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      texto: 'Promoção: Frete grátis para compras acima de R$ 200!',
      data: new Date(),
      importante: false,
      lida: false,
    },
    {
      id: 2,
      texto: 'Seu pedido #12344 foi enviado.',
      data: new Date(),
      importante: true,
      lida: false,
    },
    {
      id: 3,
      texto: 'Atualização de política de privacidade.',
      data: new Date(Date.now() - 86400000),
      importante: false,
      lida: true,
    },
  ]);

  const [novaMensagem, setNovaMensagem] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [mensagemEmDestaque, setMensagemEmDestaque] = useState(null);
  const [snackbar, setSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nova = {
        id: Date.now(),
        texto: 'Nova mensagem automática do administrador!',
        data: new Date(),
        importante: Math.random() > 0.5,
        lida: false,
      };
      setMensagens((prev) => [nova, ...prev]);
      setMensagemEmDestaque(nova.id);

      const audio = new Audio('/notification.ogg');
      audio.play();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const adicionarMensagem = () => {
    if (!novaMensagem.trim()) return;
    const nova = {
      id: Date.now(),
      texto: novaMensagem,
      data: new Date(),
      importante: false,
      lida: false,
    };
    setMensagens((prev) => [nova, ...prev]);
    setNovaMensagem('');
    setSnackbar(true);
  };

  const marcarComoLida = (id) => {
    setMensagens((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, lida: true } : msg))
    );
  };

  const mensagensFiltradas = mensagens.filter((msg) => {
    if (filtro === 'todas') return true;
    if (filtro === 'importantes') return msg.importante;
    if (filtro === 'naoLidas') return !msg.lida;
  });

  const agrupadas = agruparMensagensPorData(mensagensFiltradas);

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Mensagens do Administrador
          </Typography>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            </>
          ) : (
            <>
              <ToggleButtonGroup
                value={filtro}
                exclusive
                onChange={(e, value) => value && setFiltro(value)}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="todas">Todas</ToggleButton>
                <ToggleButton value="importantes">Importantes</ToggleButton>
                <ToggleButton value="naoLidas">Não Lidas</ToggleButton>
              </ToggleButtonGroup>
              {Object.entries(agrupadas).map(([grupo, msgs]) => (
                <Box key={grupo} mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {grupo}
                  </Typography>
                  <Divider />
                  {msgs.map((msg) => (
                    <Paper
                      key={msg.id}
                      elevation={msg.id === mensagemEmDestaque ? 6 : 1}
                      sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: msg.id === mensagemEmDestaque ? 'primary.light' : msg.lida ? 'grey.100' : 'info.light',
                        borderLeft: msg.importante ? '5px solid red' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}
                      onClick={() => marcarComoLida(msg.id)}
                    >
                      <Avatar sx={{ bgcolor: msg.importante ? 'error.main' : 'primary.main', width: 32, height: 32, fontSize: 18 }}>
                        A
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2">{msg.texto}</Typography>
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography variant="caption">
                            {new Date(msg.data).toLocaleString()}
                          </Typography>
                          {msg.importante && <Chip label="Importante" size="small" color="error" />}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ))}
              <Box display="flex" gap={2} mt={4}>
                <TextField
                  label="Nova mensagem"
                  fullWidth
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  variant="outlined"
                />
                <Button variant="contained" onClick={adicionarMensagem}>
                  Enviar
                </Button>
              </Box>
              <Box mt={4} textAlign="right">
                <Button onClick={onVoltar} variant="outlined">
                  Voltar ao Perfil
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Mensagem enviada!
        </Alert>
      </Snackbar>
    </Box>
  );
}