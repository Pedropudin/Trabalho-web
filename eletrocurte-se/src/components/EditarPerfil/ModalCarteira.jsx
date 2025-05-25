import React, { useState, useEffect } from 'react';
import '../../styles/EditarPerfil.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function ModalCarteira({ saldo, cartoes, setCartoes, setSaldo, onClose }) {
  const [valorAdicionar, setValorAdicionar] = useState('');
  const [cartaoSelecionado, setCartaoSelecionado] = useState(cartoes[0]?.final || '');
  const [novoCartao, setNovoCartao] = useState({ bandeira: '', numero: '' });
  const [mensagem, setMensagem] = useState('');
  const [step, setStep] = useState('adicionar');

  useEffect(() => {
    document.body.classList.add('modal-carteira-open');
    return () => {
      document.body.classList.remove('modal-carteira-open');
    };
  }, []);

  function validarCartao(cartao) {
    return /^\d{16}$/.test(cartao.numero.replace(/\D/g, '')) && cartao.bandeira.length > 2;
  }

  function handleAdicionarSaldo(e) {
    e.preventDefault();
    const valor = parseFloat(valorAdicionar.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setMensagem('Digite um valor válido!');
      return;
    }
    if (!cartaoSelecionado) {
      setMensagem('Selecione um cartão!');
      return;
    }
    setSaldo(s => s + valor);
    setMensagem('Saldo adicionado com sucesso!');
    setTimeout(() => {
      setMensagem('');
      onClose();
    }, 1200);
  }

  function handleSalvarCartao(e) {
    e.preventDefault();
    if (!validarCartao(novoCartao)) {
      setMensagem('Cartão inválido! Use 16 dígitos e preencha a bandeira.');
      return;
    }
    const final = novoCartao.numero.replace(/\D/g, '').slice(-4);
    setCartoes(cs => [...cs, {
      bandeira: novoCartao.bandeira,
      final,
      numero: '**** **** **** ' + final
    }]);
    setCartaoSelecionado(final);
    setNovoCartao({ bandeira: '', numero: '' });
    setMensagem('Cartão cadastrado!');
    setStep('adicionar');
    setTimeout(() => setMensagem(''), 1200);
  }

  return (
    <Modal open onClose={onClose} aria-labelledby="modal-carteira-title" sx={{zIndex: 1300}}>
      <Box sx={style}>
        <Button onClick={onClose} sx={{ alignSelf: 'flex-end', minWidth: 0, p: 0, mb: 1 }}><CloseIcon /></Button>
        <Typography id="modal-carteira-title" variant="h5" component="h2" align="center" fontWeight={600} mb={2}>
          Carteira
        </Typography>
        <Typography align="center" fontSize={18} mb={2}>
          Saldo disponível: <b>{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
        </Typography>
        {step === 'adicionar' && (
          <Box component="form" onSubmit={handleAdicionarSaldo} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Adicionar dinheiro"
              type="number"
              inputProps={{ min: 1, step: 0.01 }}
              value={valorAdicionar}
              onChange={e => setValorAdicionar(e.target.value)}
              placeholder="Valor em R$"
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel id="cartao-label">Cartão para cobrança</InputLabel>
              <Select
                labelId="cartao-label"
                value={cartaoSelecionado}
                label="Cartão para cobrança"
                onChange={e => {
                  if (e.target.value === 'novo') setStep('novoCartao');
                  else setCartaoSelecionado(e.target.value);
                }}
              >
                {cartoes.map(c => (
                  <MenuItem key={c.final} value={c.final}>{c.bandeira} **** {c.final}</MenuItem>
                ))}
                <MenuItem value="novo">Cadastrar novo cartão...</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
              Adicionar saldo
            </Button>
          </Box>
        )}
        {step === 'novoCartao' && (
          <Box component="form" onSubmit={handleSalvarCartao} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Bandeira"
              value={novoCartao.bandeira}
              onChange={e => setNovoCartao({ ...novoCartao, bandeira: e.target.value })}
              placeholder="Ex: Visa, Mastercard"
              required
              fullWidth
            />
            <TextField
              label="Número do cartão (16 dígitos)"
              value={novoCartao.numero}
              onChange={e => setNovoCartao({ ...novoCartao, numero: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              placeholder="Número do cartão"
              inputProps={{ maxLength: 16 }}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
              Salvar Cartão
            </Button>
            <Button type="button" variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={() => setStep('adicionar')}>
              Cancelar
            </Button>
          </Box>
        )}
        {mensagem && <Typography color="success.main" align="center" mt={2}>{mensagem}</Typography>}
      </Box>
    </Modal>
  );
}
