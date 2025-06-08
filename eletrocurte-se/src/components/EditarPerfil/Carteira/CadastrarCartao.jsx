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

export default function CadastrarCartao({ onSalvar, onCancelar, cartoes = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [novoCartao, setNovoCartao] = useState({
    numero: '',
    bandeira: '',
    nomeImpresso: '',
    validade: '',
    CVV: ''
  });
  const [erroNumero, setErroNumero] = useState('');
  const [erroForm, setErroForm] = useState('');
  const [touched, setTouched] = useState({ numero: false });

  // Consistência: verifica duplicidade tanto ao avançar quanto ao salvar
  function isDuplicado(numero) {
    const final = numero.replace(/\D/g, '').slice(-4);
    return cartoes.some(c => c.final === final);
  }

  const handleNext = () => {
    if (activeStep === 0) {
      const numeroLimpo = novoCartao.numero.replace(/\D/g, '');
      const numberValidation = valid.number(numeroLimpo);
      const expectedLengths = (numberValidation.card && numberValidation.card.lengths) || [16];
      if (isDuplicado(novoCartao.numero)) {
        setErroNumero('Já existe um cartão cadastrado com esses dígitos finais.');
        setErroForm('');
        return;
      }
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
      if (isDuplicado(novoCartao.numero)) {
        setErroForm('Já existe um cartão cadastrado com esses dígitos finais.');
        return;
      }
      // Validação do nome impresso: pelo menos 2 palavras, só letras e espaços, mínimo 5 caracteres
      if (!/^[A-Za-zÀ-ÿ\s]{5,}$/.test(novoCartao.nomeImpresso.trim()) || novoCartao.nomeImpresso.trim().split(' ').length < 2) {
        setErroForm('Nome impresso inválido. Use nome e sobrenome, apenas letras.');
        return;
      }
      // Validação de validade: formato MM/AA, mês entre 01 e 12, ano >= ano atual
      const validadeMatch = novoCartao.validade.match(/^(\d{2})\/(\d{2})$/);
      if (!validadeMatch) {
        setErroForm('Validade inválida. Use o formato MM/AA.');
        return;
      }
      const mes = parseInt(validadeMatch[1], 10);
      const ano = parseInt(validadeMatch[2], 10) + 2000;
      const now = new Date();
      const anoAtual = now.getFullYear();
      const mesAtual = now.getMonth() + 1;
      if (mes < 1 || mes > 12) {
        setErroForm('Mês da validade inválido.');
        return;
      }
      if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        setErroForm('Cartão vencido. Use uma validade futura.');
        return;
      }
      if (!/^\d{3,4}$/.test(novoCartao.CVV)) {
        setErroForm('CVV inválido. Deve conter 3 ou 4 dígitos.');
        return;
      }
      if (!novoCartao.numero) {
        setErroForm('Preencha o número do cartão antes de salvar.');
        return;
      }
      onSalvar(novoCartao);
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
        {erroForm && (
          <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ mb: 2 }}>
            {erroForm}
          </Alert>
        )}
        {activeStep === 0 && (
          <Box>
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
                setTouched(t => ({ ...t, numero: true }));
                setErroNumero('');
              }}
              placeholder="Número do cartão"
              fullWidth
              error={!!erroNumero || (touched.numero && isDuplicado(novoCartao.numero))}
              helperText={erroNumero || (touched.numero && isDuplicado(novoCartao.numero) ? 'Já existe um cartão cadastrado com esses dígitos finais.' : '')}
              sx={{ mb: 2 }}
              onBlur={() => setTouched(t => ({ ...t, numero: true }))}
            />
            {/* Consistência extra: helperText do Material-UI para duplicidade */}
            {touched.numero && isDuplicado(novoCartao.numero) && !erroNumero && (
              <FormHelperText error>
                Já existe um cartão cadastrado com esses dígitos finais.
              </FormHelperText>
            )}
          </Box>
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
            <TextField
              label="Nome impresso no cartão"
              value={novoCartao.nomeImpresso}
              onChange={e => setNovoCartao({ ...novoCartao, nomeImpresso: e.target.value })}
              placeholder="Nome impresso"
              fullWidth
              required
              sx={{ mt: 2 }}
              inputProps={{ maxLength: 40 }}
              helperText="Use nome e sobrenome, apenas letras."
            />
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Validade (MM/AA)"
                value={novoCartao.validade}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (v.length > 2) v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
                  setNovoCartao({ ...novoCartao, validade: v });
                }}
                placeholder="MM/AA"
                fullWidth
                required
                inputProps={{ maxLength: 5 }}
                helperText="Mês e ano, ex: 08/27"
              />
              <TextField
                label="CVV"
                value={novoCartao.CVV}
                onChange={e => setNovoCartao({ ...novoCartao, CVV: e.target.value.replace(/\D/g, '').slice(0, 4) })}
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
            Cancelar
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} color="inherit" variant="outlined">
              Voltar
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              color="primary"
              variant="contained"
              disabled={isDuplicado(novoCartao.numero)}
            >
              Avançar
            </Button>
          ) : (
            <Button type="submit" color="primary" variant="contained">
              Salvar Cartão
            </Button>
          )}
        </Box>
        {/* Garante espaço extra para o scroll mostrar todo o conteúdo */}
        <Box sx={{ minHeight: 16 }} />
      </form>
    </Box>
  );
}