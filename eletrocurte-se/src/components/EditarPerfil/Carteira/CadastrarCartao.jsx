import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function CadastrarCartao({ onSalvar, onCancelar }) {
  const [novoCartao, setNovoCartao] = useState({ bandeira: '', numero: '' });
  const [erroForm, setErroForm] = useState('');

  function validarCartao(cartao) {
    const numeroValido = /^\d{16}$/.test(cartao.numero.replace(/\D/g, ''));
    const bandeirasValidas = ['Visa', 'Mastercard', 'Amex', 'Elo', 'Discover'];
    const bandeiraValida = bandeirasValidas.includes(cartao.bandeira.trim());

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

    const luhnValido = validarLuhn(cartao.numero.replace(/\D/g, ''));
    return numeroValido && bandeiraValida && luhnValido;
  }

  function handleSalvarCartao(e) {
    e.preventDefault();
    setErroForm('');
    if (!validarCartao(novoCartao)) {
      setErroForm('Cartão inválido! Use 16 dígitos e preencha a bandeira.');
      return;
    }
    const final = novoCartao.numero.replace(/\D/g, '').slice(-4);
    onSalvar({
      bandeira: novoCartao.bandeira,
      final,
      numero: '**** **** **** ' + final,
    });
    setNovoCartao({ bandeira: '', numero: '' });
  }

  return (
    <Box component="form" onSubmit={handleSalvarCartao} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Bandeira"
        value={novoCartao.bandeira}
        onChange={(e) => setNovoCartao({ ...novoCartao, bandeira: e.target.value })}
        placeholder="Ex: Visa, Mastercard"
        fullWidth
        error={!!erroForm && (!novoCartao.bandeira || !validarCartao(novoCartao))}
      />
      <TextField
        label="Número do cartão (16 dígitos)"
        value={novoCartao.numero}
        onChange={(e) => setNovoCartao({ ...novoCartao, numero: e.target.value.replace(/\D/g, '').slice(0, 16) })}
        placeholder="Número do cartão"
        inputProps={{ maxLength: 16 }}
        fullWidth
        error={!!erroForm && (!novoCartao.numero || !validarCartao(novoCartao))}
      />
      {erroForm && (
        <Typography color="error" align="center" fontSize={14} mt={1}>
          {erroForm}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
        Salvar Cartão
      </Button>
      <Button type="button" variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={onCancelar}>
        Cancelar
      </Button>
    </Box>
  );
}