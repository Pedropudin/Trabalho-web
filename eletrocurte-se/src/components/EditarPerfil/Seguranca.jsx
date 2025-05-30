import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button, Typography, Paper, TextField, Snackbar } from '@mui/material';

// Componente FormSeguranca
// Permite ao usuário alterar e validar e-mail, senha e CPF
// Props:
// - onVoltar: função chamada ao clicar em voltar ao perfil
//
// Estados:
// - form: objeto com campos email, senha, cpf
// - mensagem: mensagem de feedback
// - tipoMensagem: tipo do feedback (info, error, success)
// - validando: controla estado de validação assíncrona
// - snackbar: controla feedback visual
//
// Funções:
// - extrairDominio: extrai domínio do e-mail
// - checarDominioEmail: valida domínio do e-mail via DNS
// - validarCamposCompletos: valida todos os campos do formulário
// - handleSubmit: executa validação e feedback
//
// Lógica:
// - Validação de formato de e-mail, CPF e senha forte
// - Validação de domínio de e-mail via API DNS
// - Feedback visual com Snackbar/Alert
// - Layout com Paper, Typography, TextField, Button
// - CSS inline (sx) para espaçamento, largura, centralização

const senhaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Regex para senha forte

// Extrai domínio do e-mail para validação DNS
function extrairDominio(email) {
  const partes = email.split('@');
  return partes.length === 2 ? partes[1].toLowerCase() : '';
}

export default function FormSeguranca({ onVoltar }) {
  // Estado do formulário (email, senha, cpf)
  const [form, setForm] = useState({ email: '', senha: '', cpf: '' });
  const [mensagem, setMensagem] = useState(''); // Mensagem de feedback
  const [tipoMensagem, setTipoMensagem] = useState('info'); // Tipo do feedback
  const [validando, setValidando] = useState(false); // Indica se está validando domínio
  const [snackbar, setSnackbar] = useState(false); // Estado para feedback visual

  // Atualiza estado ao digitar nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpa mensagem ao digitar para melhor UX
    setMensagem('');
    setTipoMensagem('info');
  };

  // Valida domínio do e-mail via DNS Google
  async function checarDominioEmail(dominio) {
    try {
      const url = `https://dns.google/resolve?name=${dominio}&type=MX`;
      const res = await fetch(url);
      if (!res.ok) return false;
      const data = await res.json();
      return data.Answer && data.Answer.length > 0;
    } catch {
      return false;
    }
  }

  // Valida todos os campos do formulário
  const validarCamposCompletos = () => {
    if (!form.cpf || !form.email || !form.senha) {
      return { valido: false, mensagem: 'Preencha todos os campos.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return { valido: false, mensagem: 'E-mail inválido.' };
    }
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
      return { valido: false, mensagem: 'CPF inválido. Use o formato 000.000.000-00.' };
    }
    if (!senhaSegura.test(form.senha)) {
      return {
        valido: false,
        mensagem:
          'Senha insegura. Deve conter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.',
      };
    }
    return { valido: true };
  };

  // Submete o formulário, valida campos e domínio
  const handleSubmit = async (e) => {
    e.preventDefault();
    const valida = validarCamposCompletos();
    if (!valida.valido) {
      setMensagem(valida.mensagem);
      setTipoMensagem('error');
      setSnackbar(true);
      return;
    }
    setValidando(true);
    const dominio = extrairDominio(form.email);
    const dominioValido = await checarDominioEmail(dominio);
    setValidando(false);
    if (!dominioValido) {
      setMensagem('Domínio do e-mail não existe ou não possui registro MX válido.');
      setTipoMensagem('error');
      setSnackbar(true);
      return;
    }
    setMensagem('Alterações salvas com sucesso!');
    setTipoMensagem('success');
    setSnackbar(true);
  };

  useEffect(() => {
    // Limpa mensagem de sucesso após 3s
    if (tipoMensagem === 'success') {
      const timer = setTimeout(() => {
        setMensagem('');
        setTipoMensagem('info');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tipoMensagem]);

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      {/* Paper: container visual com sombra e bordas arredondadas
          elevation={4}: nível de sombra
          sx: padding, largura máxima, centralização, borda arredondada */}
      <Typography variant="h5" align="center" fontWeight={700} mb={2}>
        {/* Typography: título grande centralizado
            variant="h5": tamanho grande
            align="center": centraliza texto
            fontWeight={700}: negrito
            mb={2}: margem inferior */}
        Segurança
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="E-mail"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={validando}
        />
        {/* TextField: campo de texto para e-mail
            fullWidth: ocupa toda a largura
            margin="normal": espaçamento vertical
            disabled: desabilita durante validação */}
        <TextField
          label="Senha"
          type="password"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={validando}
          helperText="Mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e especiais."
        />
        {/* TextField: campo de senha com dica de segurança */}
        <TextField
          label="CPF"
          type="text"
          name="cpf"
          value={form.cpf}
          onChange={(e) => {
            let raw = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (raw.length > 9) {
              raw = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) => `${p1}.${p2}.${p3}-${p4}`);
            } else if (raw.length > 6) {
              raw = raw.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, p1, p2, p3) => `${p1}.${p2}.${p3}`);
            } else if (raw.length > 3) {
              raw = raw.replace(/(\d{3})(\d{0,3})/, (_, p1, p2) => `${p1}.${p2}`);
            }
            handleChange({ target: { name: 'cpf', value: raw } });
          }}
          fullWidth
          margin="normal"
          disabled={validando}
          placeholder="000.000.000-00"
        />
        {/* TextField: campo de CPF com máscara e placeholder */}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={validando} sx={{ mt: 2 }}>
          {/* Button: botão de ação principal
              variant="contained": fundo preenchido
              color="primary": cor principal do tema
              fullWidth: ocupa toda a largura
              disabled: desabilita durante validação
              sx: mt=2 (margem superior) */}
          {validando ? 'Validando...' : 'Salvar Alterações'}
        </Button>
        <Button type="button" variant="outlined" color="inherit" fullWidth onClick={onVoltar} sx={{ mt: 2 }} disabled={validando}>
          {/* Button: botão secundário para voltar
              variant="outlined": borda visível
              color="inherit": cor neutra
              fullWidth: ocupa toda a largura
              sx: mt=2 (margem superior)
              disabled: desabilita durante validação */}
          Voltar ao Perfil
        </Button>
      </form>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={tipoMensagem} sx={{ width: '100%' }}>
          <AlertTitle>{tipoMensagem === 'success' ? 'Sucesso' : tipoMensagem === 'warning' ? 'Aviso' : 'Erro'}</AlertTitle>
          {mensagem}
        </Alert>
      </Snackbar>
    </Paper>
  );
}