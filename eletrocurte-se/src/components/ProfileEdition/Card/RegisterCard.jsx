import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import valid from 'card-validator';
import FormHelperText from '@mui/material/FormHelperText';

// Form for registering a new card
// - Validates card number (includes Luhn validation and brand detection)
// - Steps: number and confirmation
// - Displays validation errors and feedback messages

const steps = ['Number', 'Confirmation'];

const cardLogos = {
  visa: '/card-logos/visa.png',
  mastercard: '/card-logos/mastercard.png',
  amex: '/card-logos/amex.png',
  diners: '/card-logos/diners.png',
  discover: '/card-logos/discover.png',
  jcb: '/card-logos/jcb.png',
  elo: '/card-logos/elo.png',
  hiper: '/card-logos/hiper.png',
  hipercard: '/card-logos/hipercard.png',
  unionpay: '/card-logos/unionpay.png',
  maestro: '/card-logos/maestro.png',
  mir: '/card-logos/mir.png',
  aura: '/card-logos/aura.png',
  cabal: '/card-logos/cabal.png',
  sodexo: '/card-logos/sodexo.png',
  alelo: '/card-logos/alelo.png',
  banescard: '/card-logos/banescard.png',
  vr: '/card-logos/vr.png',
  valecard: '/card-logos/valecard.png',
  sorocred: '/card-logos/sorocred.png',
  goodcard: '/card-logos/goodcard.png',
  cooper: '/card-logos/cooper.png',
  fortbrasil: '/card-logos/fortbrasil.png',
  original: '/card-logos/original.png',
  bancoob: '/card-logos/bancoob.png',
  credz: '/card-logos/credz.png',
};

export default function RegisterCard({ onSalvar, onCancelar, cartoes = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [newCard, setNewCard] = useState({
    numero: '',
    bandeira: '',
    nomeImpresso: '',
    validade: '',
    CVV: ''
  });
  const [numberError, setNumberError] = useState('');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({ numero: false });

  // Consistency: checks for duplicates both when advancing and when saving
  function isDuplicate(numero) {
    const final = numero.replace(/\D/g, '').slice(-4);
    return cartoes.some(c => c.final === final);
  }

  const handleNext = () => {
    if (activeStep === 0) {
      const cleanNumber = newCard.numero.replace(/\D/g, '');
      const numberValidation = valid.number(cleanNumber);
      const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
      if (isDuplicate(newCard.numero)) {
        setNumberError('A card with these final digits is already registered.');
        setFormError('');
        return;
      }
      if (!expectedLengths.includes(cleanNumber.length)) {
        setNumberError(`Invalid number. Please enter ${expectedLengths.join(' or ')} digits for ${numberValidation.card ? numberValidation.card.niceType : 'the selected card'}.`);
        setFormError('');
        return;
      } else if (!numberValidation.isValid) {
        setNumberError('Invalid number (failed Luhn check or format).');
        setFormError('');
        return;
      } else if (!numberValidation.card) {
        setNumberError('Card brand not recognized.');
        setFormError('');
        return;
      }
      setNumberError('');
      setFormError('');
      setNewCard((prev) => ({ ...prev, bandeira: numberValidation.card.niceType || '' }));
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      if (isDuplicate(newCard.numero)) {
        setFormError('A card with these final digits is already registered.');
        return;
      }
      // Printed name validation: at least 2 words, only letters and spaces, minimum 5 characters
      if (!/^[A-Za-zÀ-ÿ\s]{5,}$/.test(newCard.nomeImpresso.trim()) || newCard.nomeImpresso.trim().split(' ').length < 2) {
        setFormError('Invalid printed name. Use first and last name, letters only.');
        return;
      }
      // Expiry validation: format MM/YY, month between 01 and 12, year >= current year
      const expiryMatch = newCard.validade.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        setFormError('Invalid expiry date. Use MM/YY format.');
        return;
      }
      const month = parseInt(expiryMatch[1], 10);
      const year = parseInt(expiryMatch[2], 10) + 2000;
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (month < 1 || month > 12) {
        setFormError('Invalid expiry month.');
        return;
      }
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setFormError('Card expired. Use a future expiry date.');
        return;
      }
      if (!/^\d{3,4}$/.test(newCard.CVV)) {
        setFormError('Invalid CVV. Must be 3 or 4 digits.');
        return;
      }
      if (!newCard.numero) {
        setFormError('Please enter the card number before saving.');
        return;
      }
      onSalvar(newCard);
    }
  };

  return (
    <Box
      sx={{
        maxHeight: '80vh',
        overflowY: 'auto',
        paddingRight: 1,
        minWidth: { xs: '90vw', sm: 380 },
        background: 'inherit',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {formError && (
          <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        {activeStep === 0 && (
          <Box>
            <TextField
              label={(() => {
                const cleanNumber = newCard.numero.replace(/\D/g, '');
                const numberValidation = valid.number(cleanNumber);
                const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
                return `Card number (${expectedLengths.join(' or ')} digits${numberValidation.card ? ' - ' + numberValidation.card.niceType : ''})`;
              })()}
              value={newCard.numero}
              onChange={(e) => {
                const number = e.target.value.replace(/\D/g, '');
                const numberValidation = valid.number(number);
                const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
                setNewCard({ ...newCard, numero: number.slice(0, Math.max(...expectedLengths)) });
                setTouched(t => ({ ...t, numero: true }));
                setNumberError('');
              }}
              placeholder="Card number"
              fullWidth
              error={!!numberError || (touched.numero && isDuplicate(newCard.numero))}
              helperText={numberError || (touched.numero && isDuplicate(newCard.numero) ? 'A card with these final digits is already registered.' : '')}
              sx={{ mb: 2 }}
              onBlur={() => setTouched(t => ({ ...t, numero: true }))}
            />
            {/* Extra consistency: Material-UI helperText for duplicate */}
            {touched.numero && isDuplicate(newCard.numero) && !numberError && (
              <FormHelperText error>
                A card with these final digits is already registered.
              </FormHelperText>
            )}
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" mb={2}>
              Confirm card details:
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography>Detected brand: <b>{newCard.bandeira}</b></Typography>
              {(() => {
                const cleanNumber = newCard.numero.replace(/\D/g, '');
                const numberValidation = valid.number(cleanNumber);
                const cardType = numberValidation.card && numberValidation.card.type;
                const logoSrc = cardType && cardLogos[cardType];
                if (logoSrc) {
                  return (
                    <img
                      src={logoSrc}
                      alt={newCard.bandeira}
                      style={{ height: 28, marginLeft: 10, verticalAlign: 'middle' }}
                    />
                  );
                }
                return null;
              })()}
            </Box>
            <Typography>Number: <b>**** **** **** {newCard.numero.slice(-4)}</b></Typography>
            <TextField
              label="Name printed on card"
              value={newCard.nomeImpresso}
              onChange={e => setNewCard({ ...newCard, nomeImpresso: e.target.value })}
              placeholder="Printed name"
              fullWidth
              required
              sx={{ mt: 2 }}
              inputProps={{ maxLength: 40 }}
              helperText="Use first and last name, letters only."
            />
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Expiry (MM/YY)"
                value={newCard.validade}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (v.length > 2) v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
                  setNewCard({ ...newCard, validade: v });
                }}
                placeholder="MM/YY"
                fullWidth
                required
                inputProps={{ maxLength: 5 }}
                helperText="Month and year, e.g. 08/27"
              />
              <TextField
                label="CVV"
                value={newCard.CVV}
                onChange={e => setNewCard({ ...newCard, CVV: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="CVV"
                fullWidth
                required
                inputProps={{ maxLength: 4 }}
              />
            </Box>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" mt={3} gap={3} sx={{ mt: 3, mb: 1 }}>
          <Button onClick={onCancelar} color="secondary" variant="outlined">
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} color="inherit" variant="outlined">
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              color="primary"
              variant="contained"
              disabled={isDuplicate(newCard.numero)}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" color="primary" variant="contained">
              Save Card
            </Button>
          )}
        </Box>
        {/* Ensures extra space for scroll to show all content */}
        <Box sx={{ minHeight: 16 }} />
      </form>
    </Box>
  );
}