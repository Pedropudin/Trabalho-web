import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Modal,
  TextField, Select, MenuItem, InputLabel,
  FormControl, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
//import CadastrarCartao from './CadastrarCartao';

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

export default function ModalCarteira({ cartoes, setCartoes, cartoesValidados, onClose }) {
  const [valorAdicionar, setValorAdicionar] = useState('');
  const [cartaoSelecionado, setCartaoSelecionado] = useState(cartoes[0]?.final || '');
  const [mensagem, setMensagem] = useState('');
  const [step, setStep] = useState('adicionar');
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    document.body.classList.add('modal-carteira-open');
    return () => {
      document.body.classList.remove('modal-carteira-open');
    };
  }, []);

  function handleAdicionarSaldo(e) {
    e.preventDefault();
    setErroForm('');

    if (!valorAdicionar) {
      setErroForm('Por favor, informe o valor a ser adicionado.');
      return;
    }

    const valor = parseFloat(valorAdicionar.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setErroForm('Digite um valor válido maior que zero.');
      return;
    }

    if (!cartaoSelecionado) {
      setErroForm('Selecione um cartão para cobrança antes de adicionar saldo.');
      return;
    }

    setCartoes(prev =>
      prev.map(c =>
        c.final === cartaoSelecionado
          ? { ...c, saldo: (c.saldo ?? 0) + valor }
          : c
      )
    );

    setMensagem('Saldo adicionado com sucesso!');
    setValorAdicionar('');
    setTimeout(() => {
      setMensagem('');
      onClose();
    }, 1200);
  }

  function handleExcluirCartao(final) {
    const confirm = window.confirm('Tem certeza que deseja excluir este cartão?');
    if (confirm) {
      setCartoes(prev => prev.filter(c => c.final !== final));
      if (cartaoSelecionado === final) {
        const restante = cartoes.filter(c => c.final !== final);
        setCartaoSelecionado(restante[0]?.final || '');
      }
    }
  }

  const saldoSelecionado = cartoesValidados.find(c => c.final === cartaoSelecionado)?.saldo ?? 0;

  return (
    <Modal open onClose={onClose} aria-labelledby="modal-carteira-title" sx={{ zIndex: 1300 }}>
      <Box sx={style}>
        <Button onClick={onClose} sx={{ alignSelf: 'flex-end', minWidth: 0, p: 0, mb: 1 }}>
          <CloseIcon />
        </Button>

        <Typography
          id="modal-carteira-title"
          variant="h5"
          component="h2"
          align="center"
          fontWeight={600}
          mb={2}
        >
          Carteira
        </Typography>

        <Typography align="center" fontSize={18} mb={2}>
          Saldo disponível: <b>{saldoSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
        </Typography>

        {step === 'adicionar' && (
          <>
            <Box component="form" onSubmit={handleAdicionarSaldo} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Adicionar dinheiro"
                type="number"
                value={valorAdicionar}
                onChange={e => {
                  // Impede valores negativos
                  const v = e.target.value;
                  if (v === '' || /^\d*\.?\d*$/.test(v)) {
                    setValorAdicionar(v);
                  }
                }}
                placeholder="Valor em R$"
                fullWidth
                error={!!erroForm && (!valorAdicionar || parseFloat(valorAdicionar) <= 0)}
              />
              <FormControl fullWidth required error={!!erroForm && !cartaoSelecionado}>
                <InputLabel id="cartao-label">Cartão para cobrança</InputLabel>
                <Select
                  labelId="cartao-label"
                  value={cartaoSelecionado}
                  label="Cartão para cobrança"
                  onChange={e => setCartaoSelecionado(e.target.value)}
                >
                  {cartoesValidados.map(c => (
                    <MenuItem key={c.final} value={c.final}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>{c.bandeira} **** {c.final}</Box>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExcluirCartao(c.final);
                          }}
                          size="small"
                          edge="end"
                          aria-label="Excluir cartão"
                        >
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {erroForm && (
                <Typography color="error" align="center" fontSize={14} mt={1}>
                  {erroForm}
                </Typography>
              )}

              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                Adicionar saldo
              </Button>
            </Box>

            <Button
              variant="text"
              color="primary"
              sx={{ mt: 1, fontSize: 14, alignSelf: 'center' }}
              onClick={() => setStep('novoCartao')}
            >
              + Cadastrar novo cartão
            </Button>
          </>
        )}

        {step === 'novoCartao' && (
          {/* <CadastrarCartao
            onSalvar={(cartaoSalvo) => {
              const final = cartaoSalvo.numero.slice(-4);
              setCartoes(cs => [...cs, { ...cartaoSalvo, final, saldo: 0 }]);
              setCartaoSelecionado(final);
              setMensagem('Cartão cadastrado!');
              setStep('adicionar');
              setTimeout(() => setMensagem(''), 1200);
            }}
            onCancelar={() => setStep('adicionar')}
          /> */}
        )}

        {mensagem && (
          <Typography color="success.main" align="center" mt={2}>
            {mensagem}
          </Typography>
        )}
      </Box>
    </Modal>
  );
}