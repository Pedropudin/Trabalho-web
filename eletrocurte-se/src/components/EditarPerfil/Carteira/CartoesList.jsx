import React from 'react';
import { Box, Typography, IconButton, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Lista todos os cartões cadastrados do usuário
// - Exibe mensagem se não houver cartões
// - Mostra bandeira, final e saldo de cada cartão
// - Permite excluir cartões via botão

export default function CartoesList({ cartoes, onExcluir }) {
  if (!cartoes || cartoes.length === 0) {
    return (
      <Box mt={2}>
        <Typography fontWeight={500} align="center" mb={1}>Cartões cadastrados:</Typography>
        <Box sx={{ background: '#f8f9fb', p: 2, borderRadius: 2 }}>
          <Typography align="center" color="text.secondary" fontStyle="italic">
            <span style={{ fontSize: 22 }}>💳</span><br />
            Nenhum cartão cadastrado ainda.<br />
            <span style={{ fontSize: 13, color: '#aaa' }}>
              Adicione um cartão para facilitar suas compras!
            </span>
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      {/* mt={2}: margem superior para afastar do topo */}
      <Typography fontWeight={500} align="center" mb={1}>
        {/* fontWeight: negrito, align: centraliza, mb: margem inferior */}
        Cartões cadastrados:
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {/* flexDirection: 'column': layout em coluna, gap: espaçamento entre cartões */}
        {cartoes.map((c) => (
          <Card key={c.final} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
            {/* justifyContent: space-between: separa conteúdo e botão */}
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
              {/* flexGrow: ocupa espaço disponível */}
              <Typography variant="body1" fontWeight={500}>{c.bandeira} **** {c.final}</Typography>
              <Typography variant="body2" color="text.secondary">
                {/*
                  Exibe o saldo do cartão formatado como moeda brasileira (R$).
                  Usa 0 como valor padrão se saldo for null/undefined.
                  Exemplo: 1500 vira "R$ 1.500,00"
                */}
                Saldo: {(c.saldo ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
            </CardContent>
            <IconButton onClick={() => onExcluir(c.final)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
