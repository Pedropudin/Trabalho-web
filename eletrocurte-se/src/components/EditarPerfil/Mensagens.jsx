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

// Componente Mensagens
// Exibe mensagens do sistema/administrador para o usuário, com agrupamento por data e filtros
// Props:
// - onVoltar: função chamada ao clicar em voltar ao perfil
//
// Estados:
// - mensagens: lista de mensagens do usuário
// - novaMensagem: texto do input para nova mensagem
// - filtro: filtro de exibição (todas, importantes, não lidas)
// - mensagemEmDestaque: destaca mensagem recém-chegada
// - snackbar: controla feedback visual
// - loading: simula carregamento inicial
//
// Funções:
// - agruparMensagensPorData: agrupa mensagens por "Hoje", "Ontem" e "Anteriores"
// - adicionarMensagem: adiciona nova mensagem à lista
// - marcarComoLida: marca mensagem como lida ao clicar
//
// Lógica:
// - Mensagens podem ser filtradas e agrupadas
// - Mensagem automática do admin é simulada após 10s
// - Feedback visual com Snackbar/Alert
// - Layout com Box, Card, Paper, Typography, ToggleButtonGroup, Chip, Skeleton, etc.
// - CSS inline (sx) para espaçamento, cor, destaque, responsividade

const agruparMensagensPorData = (mensagens) => {
  // Agrupa mensagens em "Hoje", "Ontem" e "Anteriores" para facilitar visualização
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
  // Estado com lista de mensagens do usuário
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

  const [novaMensagem, setNovaMensagem] = useState(''); // Estado do input de nova mensagem
  const [filtro, setFiltro] = useState('todas'); // Estado do filtro de exibição
  const [mensagemEmDestaque, setMensagemEmDestaque] = useState(null); // Destaca mensagem recém-chegada
  const [snackbar, setSnackbar] = useState(false); // Controla feedback visual
  const [loading, setLoading] = useState(true); // Simula carregamento inicial

  useEffect(() => {
    // Simula carregamento inicial (ex: busca em API)
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simula chegada automática de mensagem do admin após 10s
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

      // Toca som de notificação
      const audio = new Audio('/notification.ogg');
      audio.play().catch((error) => {
        console.error('Erro ao reproduzir o áudio:', error);
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Adiciona nova mensagem manualmente
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

  // Marca mensagem como lida ao clicar
  const marcarComoLida = (id) => {
    setMensagens((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, lida: true } : msg))
    );
  };

  // Filtra mensagens conforme o filtro selecionado
  const mensagensFiltradas = mensagens.filter((msg) => {
    if (filtro === 'todas') return true;
    if (filtro === 'importantes') return msg.importante;
    if (filtro === 'naoLidas') return !msg.lida;
  });

  // Agrupa mensagens filtradas por data
  const agrupadas = agruparMensagensPorData(mensagensFiltradas);

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      {/* Box: container flexível
          maxWidth="md": largura máxima média
          mx="auto": centraliza horizontalmente
          mt={4}: margem superior */}
      <Card>
        {/* Card: destaca o conteúdo das mensagens */}
        <CardContent>
          {/* CardContent: área interna do Card */}
          <Typography variant="h5" gutterBottom sx={{mb: 3}}>
            {/* Typography: título grande */}
            Mensagens do Administrador
          </Typography>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              {/* Skeleton: placeholder de carregamento */}
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
                {/* ToggleButtonGroup: grupo de botões de filtro */}
                <ToggleButton value="todas">Todas</ToggleButton>
                <ToggleButton value="importantes">Importantes</ToggleButton>
                <ToggleButton value="naoLidas">Não Lidas</ToggleButton>
              </ToggleButtonGroup>
              {Object.entries(agrupadas).map(([grupo, msgs]) => (
                <Box key={grupo} mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {/* Typography: subtítulo para grupo de mensagens */}
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
                      {/* Paper: destaca cada mensagem */}
                      <Avatar sx={{ bgcolor: msg.importante ? 'error.main' : 'primary.main', width: 32, height: 32, fontSize: 18 }}>
                        {/* Avatar: ícone do remetente */}
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
              <Box display="flex" gap={2} mt={4} flexDirection={{ xs: 'column', sm: 'row' }}>
                <TextField
                  label="Nova mensagem"
                  fullWidth
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  variant="outlined"
                  multiline
                  minRows={3}
                  maxRows={6}
                  sx={{ flex: 1 }}
                  InputProps={{
                    style: { resize: 'vertical' }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={adicionarMensagem}
                  sx={{
                    minWidth: 120,
                    height: { xs: 48, sm: 'auto' },
                    alignSelf: { xs: 'flex-end', sm: 'unset' }
                  }}
                >
                  Enviar
                </Button>
              </Box>
              <Box mt={4} display="flex" justifyContent="center">
                <Button
                  onClick={onVoltar}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: '#fff',
                    borderColor: '#007b99',
                    color: '#007b99',
                    '&:hover': {
                      background: '#e3f2fd',
                      borderColor: '#004d66',
                      color: '#004d66'
                    }
                  }}
                >
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