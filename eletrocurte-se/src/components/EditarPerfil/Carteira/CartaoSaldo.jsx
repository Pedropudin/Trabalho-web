import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Displays information for a specific card and its balance
// - Shows brand, last digits of the card, and formatted balance
// - Button to add balance to the card

export default function CartaoSaldo({ cartao, saldo, onAdicionarSaldo }) {
  return (
    <Box
      sx={{
        // display: 'flex' — Uses CSS flex layout to align child elements.
        // flexDirection: 'column' — Arranges elements (title, balance, button) in a column, one below the other.
        // border: '1px solid #ccc' — Adds a light gray border around the card for visual highlight.
        // borderRadius: 2 — Rounded corners (value 2 = 16px in Material UI theme), for a friendlier look.
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        marginBottom: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {/*
          variant="h6" — Sets the text as a large subtitle (theme size and weight).
          gutterBottom — Adds automatic bottom margin to separate from the next element.
        */}
        {cartao.bandeira} **** {cartao.final}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {/*variant="body1" — Standard text size for body content.*/}
        Balance: {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Typography>
      <Button
        variant="contained" // Button with filled background (theme primary color)
        color="primary"     // Uses the theme's primary color
        onClick={() => onAdicionarSaldo(cartao.final)}
      >
        Adicionar Saldo
      </Button>
    </Box>
  );
}
