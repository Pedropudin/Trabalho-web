import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Modal,
  TextField, Select, MenuItem, InputLabel,
  FormControl, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CadastrarCartao from './CadastrarCartao';

// Objeto de estilo inline para o Box principal do modal
// Define centralização, largura máxima, cor de fundo, borda, sombra, padding e layout flexível
const style = {
  // CSS inline para o Box principal do modal
  // position, top, left, transform: centralizam o modal na tela
  // width, maxWidth: controlam o tamanho
  // bgcolor: cor de fundo do tema
  // borderRadius: bordas arredondadas
  // boxShadow: sombra para destaque
  // p: padding interno
  // outline: remove borda de foco
  // display, flexDirection, gap: layout flexível em coluna com espaçamento
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

// Componente ModalCarteira
// Props:
// - cartoes: array de cartões cadastrados
// - setCartoes: função para atualizar cartões
// - cartoesValidados: cartões com saldo atualizado
// - onClose: função para fechar o modal

export default function ModalCarteira({ cartoes, setCartoes, cartoesValidados, onClose }) {
  const [valorAdicionar, setValorAdicionar] = useState('');

  // Estado para cartão selecionado para cobrança
  const [cartaoSelecionado, setCartaoSelecionado] = useState(cartoes[0]?.final || '');

  // Mensagem de feedback (sucesso ou erro)
  const [mensagem, setMensagem] = useState('');

  // step controla se está adicionando saldo ou cadastrando novo cartão
  const [step, setStep] = useState('adicionar');

  // Estado para mensagem de erro do formulário
  const [erroForm, setErroForm] = useState('');

  // Efeito colateral para travar o scroll do body enquanto o modal está aberto
  useEffect(() => {
    document.body.classList.add('modal-carteira-open');
    return () => {
      document.body.classList.remove('modal-carteira-open');
    };
  }, []);

  // Função para adicionar saldo ao cartão selecionado
  // Valida valor, cartão e atualiza o array de cartões
  function handleAdicionarSaldo(e) {
    e.preventDefault();
    setErroForm('');

    // Validação: valor não pode ser vazio
    if (!valorAdicionar) {
      setErroForm('Por favor, informe o valor a ser adicionado.');
      return;
    }

    // Validação: valor deve ser número positivo
    const valor = parseFloat(valorAdicionar.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setErroForm('Digite um valor válido maior que zero.');
      return;
    }

    // Validação: cartão deve estar selecionado
    if (!cartaoSelecionado) {
      setErroForm('Selecione um cartão para cobrança antes de adicionar saldo.');
      return;
    }

    // Atualiza saldo do cartão selecionado
    setCartoes(prev =>
      prev.map(c =>
        c.final === cartaoSelecionado
          ? { ...c, saldo: (c.saldo ?? 0) + valor }
          : c
      )
    );

    // Mensagem de sucesso e fechamento automático do modal
    setMensagem('Saldo adicionado com sucesso!');
    setValorAdicionar('');
    setTimeout(() => {
      setMensagem('');
      onClose();
    }, 1200);
  }

  // Função para excluir um cartão da lista
  // Pede confirmação ao usuário antes de remover
  function handleExcluirCartao(final) {
    const confirm = window.confirm('Tem certeza que deseja excluir este cartão?');
    if (confirm) {
      setCartoes(prev => prev.filter(c => c.final !== final));
      // Se o cartão excluído era o selecionado, seleciona outro (ou nenhum)
      if (cartaoSelecionado === final) {
        const restante = cartoes.filter(c => c.final !== final);
        setCartaoSelecionado(restante[0]?.final || '');
      }
    }
  }

  // Busca o saldo do cartão atualmente selecionado
  const saldoSelecionado = cartoesValidados.find(c => c.final === cartaoSelecionado)?.saldo ?? 0;

  return (
    // Modal do Material UI, com z-index elevado para sobrepor a interface
    <Modal open onClose={onClose} aria-labelledby="modal-carteira-title" sx={{ zIndex: 1300 }}>
      {/* Box principal com estilo inline definido acima */}
      <Box sx={style}>
        {/* Botão para fechar o modal (canto superior direito) */}
        <Button onClick={onClose} sx={{ alignSelf: 'flex-end', minWidth: 0, p: 0, mb: 1 }}>
          {/* alignSelf: posiciona o botão à direita
              p: padding zero
              mb: margem inferior */}
          <CloseIcon />
        </Button>

        {/* Título do modal */}
        <Typography
          id="modal-carteira-title"
          variant="h5"
          component="h2"
          align="center"
          fontWeight={600}
          mb={2}
        >
          {/* variant="h5": título médio
              align="center": centraliza
              fontWeight={600}: negrito
              mb={2}: margem inferior */}
          Carteira
        </Typography>

        {/* Exibe o saldo do cartão selecionado */}
        <Typography align="center" fontSize={18} mb={2}>
          {/* align="center": centraliza
              fontSize={18}: tamanho da fonte
              mb={2}: margem inferior */}
          Saldo disponível: <b>{saldoSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
        </Typography>

        {/* Passo de adicionar saldo */}
        {step === 'adicionar' && (
          <>
            {/* Formulário para adicionar saldo */}
            <Box component="form" onSubmit={handleAdicionarSaldo} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* display: flex, flexDirection: 'column': layout em coluna
                  gap: espaçamento entre campos */}
              {/* Campo para valor a ser adicionado */}
              <TextField
                label="Adicionar dinheiro"
                type="number"
                value={valorAdicionar}
                onChange={e => {
                  // Impede valores negativos e caracteres inválidos
                  const v = e.target.value;
                  if (v === '' || /^\d*\.?\d*$/.test(v)) {
                    setValorAdicionar(v);
                  }
                }}
                placeholder="Valor em R$"
                fullWidth
                error={!!erroForm && (!valorAdicionar || parseFloat(valorAdicionar) <= 0)}
              />

              {/* Select para escolher o cartão de cobrança */}
              <FormControl fullWidth required error={!!erroForm && !cartaoSelecionado}>
                <InputLabel id="cartao-label">Cartão para cobrança</InputLabel>
                <Select
                  labelId="cartao-label"
                  value={cartaoSelecionado}
                  label="Cartão para cobrança"
                  onChange={e => setCartaoSelecionado(e.target.value)}
                >
                  {/* Lista de cartões disponíveis */}
                  {cartoesValidados.map(c => (
                    <MenuItem key={c.final} value={c.final}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>{c.bandeira} **** {c.final}</Box>
                        {/* Botão para excluir cartão (ícone de lixeira) */}
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

              {/* Exibe mensagem de erro do formulário, se houver */}
              {erroForm && (
                <Typography color="error" align="center" fontSize={14} mt={1}>
                  {erroForm}
                </Typography>
              )}

              {/* Botão para submeter o formulário e adicionar saldo */}
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                {/* mt: margem superior */}
                Adicionar saldo
              </Button>
            </Box>

            {/* Botão para trocar para o passo de cadastro de novo cartão */}
            <Button
              variant="text"
              color="primary"
              sx={{ mt: 1, fontSize: 14, alignSelf: 'center' }}
              onClick={() => setStep('novoCartao')}
            >
              {/* mt: margem superior, fontSize: tamanho, alignSelf: centraliza botão */}
              + Cadastrar novo cartão
            </Button>
          </>
        )}

        {/* Passo de cadastro de novo cartão */}
        {step === 'novoCartao' && (
          <CadastrarCartao
            onSalvar={(cartaoSalvo) => {
              // Ao salvar, adiciona o novo cartão à lista, seleciona ele e mostra mensagem
              const final = cartaoSalvo.numero.slice(-4);
              setCartoes(cs => [...cs, { ...cartaoSalvo, final, saldo: 0 }]);
              setCartaoSelecionado(final);
              setMensagem('Cartão cadastrado!');
              setStep('adicionar');
              setTimeout(() => setMensagem(''), 1200);
            }}
            onCancelar={() => setStep('adicionar')}
          />
        )}

        {/* Mensagem de feedback (sucesso) exibida no rodapé do modal */}
        {mensagem && (
          <Typography color="success.main" align="center" mt={2}>
            {/* color: cor de sucesso do tema
                mt: margem superior */}
            {mensagem}
          </Typography>
        )}
      </Box>
    </Modal>
  );
}