import React from 'react';
import { Box, Typography, IconButton, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Lists all registered user cards
// - Shows message if no cards are registered
// - Displays brand, last digits, and balance of each card
// - Allows deleting cards via a button

export default function CardsList({ cards, onDelete }) {
  if (!cards || cards.length === 0) {
    return (
      <Box mt={2}>
        <Typography fontWeight={500} align="center" mb={1}>Registered cards:</Typography>
        <Box sx={{ background: '#f8f9fb', p: 2, borderRadius: 2 }}>
          <Typography align="center" color="text.secondary" fontStyle="italic">
            <span style={{ fontSize: 22 }}>💳</span><br />
            No cards registered yet.<br />
            <span style={{ fontSize: 13, color: '#aaa' }}>
              Add a card to make your purchases easier!
            </span>
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Typography fontWeight={500} align="center" mb={1}>
        Registered cards:
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {cards.map((card) => (
          <Card
            key={card.last4}
            variant="outlined"
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}
          >
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
              <Typography variant="body1" fontWeight={500}>
                {card.brand} **** {card.last4}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Balance: {(card.balance ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
            </CardContent>
            <IconButton onClick={() => onDelete(card.last4)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Card>
        ))}
      </Box>
    </Box>
  );
}