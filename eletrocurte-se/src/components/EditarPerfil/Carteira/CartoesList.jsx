import React from 'react';
import { Box, Typography, IconButton, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Lists all registered user cards
// - Shows message if there are no cards
// - Shows brand, last digits, and balance of each card
// - Allows deleting cards via button

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
      {/* mt={2}: top margin to move away from the top */}
      <Typography fontWeight={500} align="center" mb={1}>
        {/* fontWeight: bold, align: center, mb: bottom margin */}
        Cartões registrados:
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {/* flexDirection: 'column': column layout, gap: spacing between cards */}
        {cartoes.map((c) => (
          <Card key={c.final} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
            {/* justifyContent: space-between: separates content and button */}
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
              {/* flexGrow: takes available space */}
              <Typography variant="body1" fontWeight={500}>{c.bandeira} **** {c.final}</Typography>
              <Typography variant="body2" color="text.secondary">
                {/* 
                  Shows the card balance formatted as Brazilian currency (R$).
                  Uses 0 as default if balance is null/undefined.
                  Example: 1500 becomes "R$ 1.500,00"
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
