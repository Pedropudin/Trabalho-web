import React, { useState } from 'react';
import { TextField, Button, Box, Stepper, Step, StepLabel, Typography } from '@mui/material';

const steps = ['CEP', 'Endereço', 'Confirmar'];

export default function ModalEndereco({ onSalvar }) {
  const [activeStep, setActiveStep] = useState(0);
  const [cep, setCep] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [endereco, setEndereco] = useState(null);
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [erro, setErro] = useState('');

  const buscarCep = async () => {
    setCarregando(true);
    setErro('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setErro('CEP não encontrado.');
        setEndereco(null);
      } else {
        setEndereco(data);
      }
    } catch {
      setErro('Erro ao buscar CEP.');
      setEndereco(null);
    }
    setCarregando(false);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!/^\d{8}$/.test(cep)) {
        setErro('Digite um CEP válido (8 dígitos).');
        return;
      }
      buscarCep();
      setActiveStep(1);
      return;
    }
    if (activeStep === 1) {
      if (!numero) {
        setErro('Informe o número do endereço.');
        return;
      }
      setErro('');
      setActiveStep(2);
      return;
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === 2 && endereco) {
      onSalvar({
        ...endereco,
        numero,
        complemento
      });
    }
  };

  return (
    <Box className="modal-endereco">
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <TextField
            label="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Digite o CEP"
            fullWidth
            sx={{ mb: 2 }}
            disabled={carregando}
          />
        )}
        {activeStep === 1 && endereco && (
          <>
            <TextField label="Rua" value={endereco.logradouro} disabled fullWidth sx={{ mb: 1 }} />
            <TextField label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Bairro" value={endereco.bairro} disabled fullWidth sx={{ mb: 1 }} />
            <TextField label="Cidade/UF" value={`${endereco.localidade}/${endereco.uf}`} disabled fullWidth sx={{ mb: 1 }} />
          </>
        )}
        {activeStep === 2 && endereco && (
          <Box>
            <Typography variant="subtitle1" mb={2}>Confirme os dados do endereço:</Typography>
            <Typography>Rua: <b>{endereco.logradouro}</b></Typography>
            <Typography>Número: <b>{numero}</b></Typography>
            <Typography>Complemento: <b>{complemento}</b></Typography>
            <Typography>Bairro: <b>{endereco.bairro}</b></Typography>
            <Typography>Cidade/UF: <b>{endereco.localidade}/{endereco.uf}</b></Typography>
          </Box>
        )}
        {erro && <Typography color="error" sx={{ mt: 1 }}>{erro}</Typography>}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button onClick={handleBack} color="inherit" variant="outlined" disabled={activeStep === 0}>Voltar</Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} color="primary" variant="contained" disabled={carregando}>Avançar</Button>
          ) : (
            <Button type="submit" color="primary" variant="contained">Salvar Endereço</Button>
          )}
        </Box>
      </form>
    </Box>
  );
}