// -----------------------------------------------------------------------------
// ModalEndereco.jsx
// Componente modal para cadastro de novo endereço de entrega.
// Utiliza Stepper do Material-UI para navegação por etapas (CEP, Endereço, Confirmação).
// Realiza busca de dados via API do ViaCEP e validação dos campos.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import { TextField, Button, Box, Stepper, Step, StepLabel, Typography } from '@mui/material';

const steps = ['CEP', 'Endereço', 'Confirmar'];

export default function ModalEndereco({ onSalvar }) {
  // Etapa atual do Stepper (0: CEP, 1: Endereço, 2: Confirmação)
  const [activeStep, setActiveStep] = useState(0);
  // Valor do campo CEP
  const [cep, setCep] = useState('');
  // Indica se está buscando dados do CEP
  const [carregando, setCarregando] = useState(false);
  // Objeto com dados do endereço retornado pela API
  const [endereco, setEndereco] = useState(null);
  // Número do endereço informado pelo usuário
  const [numero, setNumero] = useState('');
  // Complemento do endereço
  const [complemento, setComplemento] = useState('');
  // Mensagem de erro para feedback ao usuário
  const [erro, setErro] = useState('');

  // Busca dados do endereço a partir do CEP usando a API ViaCEP
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

  // Avança para a próxima etapa do Stepper, validando campos conforme necessário
  const handleNext = () => {
    if (activeStep === 0) {
      // Validação do CEP (8 dígitos)
      if (!/^\d{8}$/.test(cep)) {
        setErro('Digite um CEP válido (8 dígitos).');
        return;
      }
      buscarCep();
      setActiveStep(1);
      return;
    }
    if (activeStep === 1) {
      // Validação do número do endereço
      if (!numero) {
        setErro('Informe o número do endereço.');
        return;
      }
      setErro('');
      setActiveStep(2);
      return;
    }
  };

  // Volta para a etapa anterior do Stepper
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Envia os dados do novo endereço para o componente pai
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
      {/* Stepper do Material-UI para navegação entre etapas */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* Unifica todos os campos e botões em um só form/container */}
      <form onSubmit={handleSubmit}>
        {/* Etapa 0: Entrada do CEP */}
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
        {/* Etapa 1: Exibe dados do endereço e campos para número e complemento */}
        {activeStep === 1 && endereco && (
          <>
            <TextField label="Rua" value={endereco.logradouro} disabled fullWidth sx={{ mb: 1 }} />
            <TextField label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Bairro" value={endereco.bairro} disabled fullWidth sx={{ mb: 1 }} />
            <TextField label="Cidade/UF" value={`${endereco.localidade}/${endereco.uf}`} disabled fullWidth sx={{ mb: 1 }} />
          </>
        )}
        {/* Etapa 2: Confirmação dos dados do endereço */}
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
        {/* Exibe mensagem de erro, se houver */}
        {erro && <Typography color="error" sx={{ mt: 1 }}>{erro}</Typography>}
        {/* Botões de navegação do Stepper, todos juntos e lógica refinada */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            onClick={handleBack}
            color="inherit"
            variant="outlined"
            disabled={activeStep === 0}
            type="button"
          >
            Voltar
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              color="primary"
              variant="contained"
              disabled={
                (activeStep === 0 && (carregando || !cep || !/^\d{8}$/.test(cep))) ||
                (activeStep === 1 && (!numero || !endereco))
              }
              type="button"
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!endereco || !numero}
            >
              Salvar Endereço
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}