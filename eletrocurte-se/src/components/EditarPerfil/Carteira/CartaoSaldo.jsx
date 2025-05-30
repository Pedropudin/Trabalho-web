import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Exibe informações de um cartão específico e seu saldo
// - Mostra bandeira, final do cartão e saldo formatado
// - Botão para adicionar saldo ao cartão

export default function CartaoSaldo({ cartao, saldo, onAdicionarSaldo }) {
  return (
    <Box
      sx={{
        // display: 'flex' — Usa o layout flexível do CSS para alinhar os elementos filhos.
        // flexDirection: 'column' — Organiza os elementos (título, saldo, botão) em coluna, um embaixo do outro.
        // border: '1px solid #ccc' — Adiciona uma borda cinza clara ao redor do cartão para destacá-lo visualmente.
        // borderRadius: 2 — Bordas arredondadas (valor 2 = 16px no tema Material UI), deixando o visual mais amigável.
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
          variant="h6" — Define o texto como um subtítulo grande (tamanho e peso do tema).
          gutterBottom — Adiciona uma margem inferior automática para separar do próximo elemento.
        */}
        {cartao.bandeira} **** {cartao.final}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {/*variant="body1" — Tamanho de texto padrão para corpo de conteúdo.*/}
        Saldo: {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Typography>
      <Button
        variant="contained" // Botão com fundo preenchido (cor principal do tema)
        color="primary"     // Usa a cor principal do tema
        onClick={() => onAdicionarSaldo(cartao.final)}
      >
        Adicionar Saldo
      </Button>
    </Box>
  );
}
