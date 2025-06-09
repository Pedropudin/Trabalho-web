// -----------------------------------------------------------------------------
// ModalEndereco.jsx
// Modal component for registering a new delivery address.
// Uses Material-UI Stepper for step-by-step navigation (CEP, Address, Confirmation).
// Fetches address data via ViaCEP API and validates fields.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import { TextField, Button, Box, Stepper, Step, StepLabel, Typography } from '@mui/material';

const steps = ['CEP', 'Address', 'Confirm'];

export default function ModalEndereco({ onSalvar }) {
  // Current step in the Stepper (0: CEP, 1: Address, 2: Confirmation)
  const [activeStep, setActiveStep] = useState(0);
  // Value of the CEP field
  const [cep, setCep] = useState('');
  // Indicates if the CEP data is being fetched
  const [carregando, setCarregando] = useState(false);
  // Address data returned from the API
  const [endereco, setEndereco] = useState(null);
  // Address number provided by the user
  const [numero, setNumero] = useState('');
  // Address complement
  const [complemento, setComplemento] = useState('');
  // Error message for user feedback
  const [erro, setErro] = useState('');

  // Fetch address data from the CEP using the ViaCEP API
  const buscarCep = async () => {
    setCarregando(true);
    setErro('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setErro('CEP not found.');
        setEndereco(null);
      } else {
        setEndereco(data);
      }
    } catch {
      setErro('Error fetching CEP.');
      setEndereco(null);
    }
    setCarregando(false);
  };

  // Move to the next step, validating fields as needed
  const handleNext = () => {
    if (activeStep === 0) {
      // CEP validation (8 digits)
      if (!/^\d{8}$/.test(cep)) {
        setErro('Enter a valid CEP (8 digits).');
        return;
      }
      buscarCep();
      setActiveStep(1);
      return;
    }
    if (activeStep === 1) {
      // Address number validation
      if (!numero) {
        setErro('Please provide the address number.');
        return;
      }
      setErro('');
      setActiveStep(2);
      return;
    }
  };

  // Go back to the previous step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Submit the new address data to the parent component
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
      {/* Material-UI Stepper for step navigation */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* Wraps all fields and buttons in a single form/container */}
      <form onSubmit={handleSubmit}>
        {/* Step 0: CEP input */}
        {activeStep === 0 && (
          <TextField
            label="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Enter CEP"
            fullWidth
            sx={{ mb: 2 }}
            disabled={carregando}
          />
        )}
        {/* Step 1: Show address data and input fields for number and complement */}
        {activeStep === 1 && endereco && (
          <>
            <TextField label="Street" value={endereco.logradouro} disabled fullWidth sx={{ mb: 1 }} />
            <TextField label="Number" value={numero} onChange={(e) => setNumero(e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Complement" value={complemento} onChange={(e) => setComplemento(e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="District" value={endereco.bairro} disabled fullWidth sx={{ mb: 1 }} />
            <TextField label="City/State" value={`${endereco.localidade}/${endereco.uf}`} disabled fullWidth sx={{ mb: 1 }} />
          </>
        )}
        {/* Step 2: Confirm address data */}
        {activeStep === 2 && endereco && (
          <Box>
            <Typography variant="subtitle1" mb={2}>Please confirm the address details:</Typography>
            <Typography>Street: <b>{endereco.logradouro}</b></Typography>
            <Typography>Number: <b>{numero}</b></Typography>
            <Typography>Complement: <b>{complemento}</b></Typography>
            <Typography>District: <b>{endereco.bairro}</b></Typography>
            <Typography>City/State: <b>{endereco.localidade}/{endereco.uf}</b></Typography>
          </Box>
        )}
        {/* Display error message, if any */}
        {erro && <Typography color="error" sx={{ mt: 1 }}>{erro}</Typography>}
        {/* Stepper navigation buttons, grouped with refined logic */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            onClick={handleBack}
            color="inherit"
            variant="outlined"
            disabled={activeStep === 0}
            type="button"
          >
            Back
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
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!endereco || !numero}
            >
              Save Address
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}