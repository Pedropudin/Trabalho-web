import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function CadastrarCartao({ onSalvar, onCancelar }) {
  const [novoCartao, setNovoCartao] = useState({ bandeira: '', numero: '' });
  const [erroNumero, setErroNumero] = useState('');
  const [erroBandeira, setErroBandeira] = useState('');

  const bandeirasValidas = ['Visa', 'Mastercard', 'Amex', 'Elo', 'Discover'];

  function validarLuhn(numero) {
    let soma = 0;
    let alternar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
      let digito = parseInt(numero[i], 10);
      if (alternar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      soma += digito;
      alternar = !alternar;
    }
    return soma % 10 === 0;
  }

  function handleSalvarCartao(e) {
    e.preventDefault();
    const numeroLimpo = novoCartao.numero.replace(/\D/g, '');
    const bandeira = novoCartao.bandeira.trim();

    let erroNum = '';
    let erroBand = '';

    if (!/^\d{16}$/.test(numeroLimpo)) {
      erroNum = 'O número deve ter exatamente 16 dígitos.';
    } else if (!validarLuhn(numeroLimpo)) {
      erroNum = 'Número inválido (falha na verificação de Luhn).';
    }

    if (!bandeirasValidas.includes(bandeira)) {
      erroBand = 'Bandeira inválida. Ex: Visa, Mastercard, Amex, Elo, Discover.';
    }

    setErroNumero(erroNum);
    setErroBandeira(erroBand);

    if (erroNum || erroBand) return;

    const final = numeroLimpo.slice(-4);
    onSalvar({
      bandeira,
      final,
      numero: '**** **** **** ' + final,
    });

    setNovoCartao({ bandeira: '', numero: '' });
  }

  return (
    <Box
      component="form"
      onSubmit={handleSalvarCartao}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Bandeira"
        value={novoCartao.bandeira}
        onChange={(e) => setNovoCartao({ ...novoCartao, bandeira: e.target.value })}
        placeholder="Ex: Visa, Mastercard"
        fullWidth
        error={!!erroBandeira}
        helperText={erroBandeira}
      />
      <TextField
        label="Número do cartão (16 dígitos)"
        value={novoCartao.numero}
        onChange={(e) =>
          setNovoCartao({
            ...novoCartao,
            numero: e.target.value.replace(/\D/g, '').slice(0, 16),
          })
        }
        placeholder="Número do cartão"
        fullWidth
        error={!!erroNumero}
        helperText={erroNumero}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
        Salvar Cartão
      </Button>
      <Button type="button" variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={onCancelar}>
        Cancelar
      </Button>
    </Box>
  );
}