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

// Formulário para cadastro de novo cartão
// - Valida número do cartão (inclui validação Luhn e detecção de bandeira)
// - Passos: número e confirmação
// - Exibe erros de validação e mensagens de feedback

const steps = ['Número', 'Confirmação'];

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

export default function CadastrarCartao({ onSalvar, onCancelar }) {
  const [activeStep, setActiveStep] = useState(0);
  const [novoCartao, setNovoCartao] = useState({ numero: '', bandeira: '' });
  const [erroNumero, setErroNumero] = useState('');
  const [erroForm, setErroForm] = useState('');

  const handleNext = () => {
    if (activeStep === 0) {
      const numeroLimpo = novoCartao.numero.replace(/\D/g, '');
      const numberValidation = valid.number(numeroLimpo);
      const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
      if (!expectedLengths.includes(numeroLimpo.length)) {
        setErroNumero(`Número inválido. Digite ${expectedLengths.join(' ou ')} dígitos para ${numberValidation.card ? numberValidation.card.niceType : 'o cartão selecionado'}.`);
        setErroForm('');
        return;
      } else if (!numberValidation.isValid) {
        setErroNumero('Número inválido (falha na verificação de Luhn ou formato).');
        setErroForm('');
        return;
      } else if (!numberValidation.card) {
        setErroNumero('Bandeira não reconhecida.');
        setErroForm('');
        return;
      }
      setErroNumero('');
      setErroForm('');
      setNovoCartao((prev) => ({ ...prev, bandeira: numberValidation.card.niceType || '' }));
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErroForm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      // Validação extra: impedir salvar se número não está preenchido
      if (!novoCartao.numero) {
        setErroForm('Preencha o número do cartão antes de salvar.');
        return;
      }
      onSalvar(novoCartao);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        {erroForm && (
          <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ mb: 2 }}>
            {erroForm}
          </Alert>
        )}
        {activeStep === 0 && (
          <TextField
            label={(() => {
              const numeroLimpo = novoCartao.numero.replace(/\D/g, '');
              const numberValidation = valid.number(numeroLimpo);
              const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
              return `Número do cartão (${expectedLengths.join(' ou ')} dígitos${numberValidation.card ? ' - ' + numberValidation.card.niceType : ''})`;
            })()}
            value={novoCartao.numero}
            onChange={(e) => {
              const numero = e.target.value.replace(/\D/g, '');
              const numberValidation = valid.number(numero);
              const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
              setNovoCartao({ ...novoCartao, numero: numero.slice(0, Math.max(...expectedLengths)) });
            }}
            placeholder="Número do cartão"
            fullWidth
            error={!!erroNumero}
            helperText={erroNumero}
            sx={{ mb: 2 }}
          />
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" mb={2}>
              Confirme os dados do cartão:
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography>Bandeira detectada: <b>{novoCartao.bandeira}</b></Typography>
              {(() => {
                const numeroLimpo = novoCartao.numero.replace(/\D/g, '');
                const numberValidation = valid.number(numeroLimpo);
                const cardType = numberValidation.card && numberValidation.card.type;
                const logoSrc = cardType && cardLogos[cardType];
                if (logoSrc) {
                  return (
                    <img
                      src={logoSrc}
                      alt={novoCartao.bandeira}
                      style={{ height: 28, marginLeft: 10, verticalAlign: 'middle' }}
                    />
                  );
                }
                return null;
              })()}
            </Box>
            <Typography>Número: <b>**** **** **** {novoCartao.numero.slice(-4)}</b></Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button onClick={onCancelar} color="secondary" variant="outlined">
            Cancelar
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} color="inherit" variant="outlined">
              Voltar
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} color="primary" variant="contained">
              Avançar
            </Button>
          ) : (
            <Button type="submit" color="primary" variant="contained">
              Salvar Cartão
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}