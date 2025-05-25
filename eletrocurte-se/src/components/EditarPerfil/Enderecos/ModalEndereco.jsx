import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Box } from '@mui/material';

export default function ModalEndereco({ onSalvar }) {
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [endereco, setEndereco] = useState(null);

  const buscarEndereco = async () => {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();
      if (dados.erro) throw new Error('CEP não encontrado.');
      setEndereco(dados);
    } catch (err) {
      setErro(err.message);
      setEndereco(null);
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = () => {
    if (!endereco || !numero) {
      setErro('Preencha todas as informações corretamente.');
      return;
    }

    const enderecoCompleto = `${endereco.logradouro}, ${numero}${complemento ? `, ${complemento}` : ''} - ${endereco.bairro}, ${endereco.localidade}/${endereco.uf}`;
    onSalvar(enderecoCompleto);
    setCep('');
    setNumero('');
    setComplemento('');
    setEndereco(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="CEP"
        value={cep}
        onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
        placeholder="00000000"
        fullWidth
      />
      <Button variant="contained" onClick={buscarEndereco} disabled={carregando}>
        {carregando ? <CircularProgress size={20} /> : 'Buscar CEP'}
      </Button>

      {endereco && (
        <>
          <TextField
            label="Rua"
            value={endereco.logradouro}
            disabled
            fullWidth
          />
          <TextField
            label="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            fullWidth
          />
          <TextField
            label="Complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            fullWidth
          />
          <TextField
            label="Bairro"
            value={endereco.bairro}
            disabled
            fullWidth
          />
          <TextField
            label="Cidade/UF"
            value={`${endereco.localidade}/${endereco.uf}`}
            disabled
            fullWidth
          />
        </>
      )}

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <Button variant="contained" color="primary" onClick={handleSalvar}>
        Salvar Endereço
      </Button>
    </Box>
  );
}