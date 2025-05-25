import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button, Typography } from '@mui/material';

const senhaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function extrairDominio(email) {
  const partes = email.split('@');
  return partes.length === 2 ? partes[1].toLowerCase() : '';
}

export default function FormSeguranca({ onVoltar }) {
  const [form, setForm] = useState({ email: '', senha: '', cpf: '' });
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('info');
  const [validando, setValidando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpa mensagem ao digitar para melhor UX
    setMensagem('');
    setTipoMensagem('info');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valida = validarCamposCompletos();
    if (!valida.valido) {
      setMensagem(valida.mensagem);
      setTipoMensagem('error');
      return;
    }

    setValidando(true);
    const dominio = extrairDominio(form.email);
    const dominioValido = await checarDominioEmail(dominio);
    setValidando(false);

    if (!dominioValido) {
      setMensagem('Domínio do e-mail não existe ou não possui registro MX válido.');
      setTipoMensagem('error');
      return;
    }

    setMensagem('Alterações salvas com sucesso!');
    setTipoMensagem('success');
  };

  useEffect(() => {
    if (tipoMensagem === 'success') {
      const timer = setTimeout(() => {
        setMensagem('');
        setTipoMensagem('info');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tipoMensagem]);

  return (
    <>
      <form className="editarperfil-card-form" onSubmit={handleSubmit} noValidate>
        <h2>Segurança</h2>

        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          disabled={validando}
        />

        <label htmlFor="senha">Senha:</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          placeholder="Nova senha (mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais)"
          disabled={validando}
        />

        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
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
          placeholder="000.000.000-00"
          disabled={validando}
        />

        <button type="submit" className="editarperfil-btn-salvar" disabled={validando}>
          {validando ? 'Validando...' : 'Salvar Alterações'}
        </button>

        {mensagem && (
          <Alert
            severity={tipoMensagem}
            sx={{
              mt: 2,
              mx: 'auto',
              maxWidth: 400,
              textAlign: 'center',
            }}
          >
            <AlertTitle>{tipoMensagem === 'success' ? 'Sucesso' : tipoMensagem === 'warning' ? 'Aviso' : 'Erro'}</AlertTitle>
            {mensagem}
          </Alert>
        )}

        <button type="button" className="editarperfil-btn-voltar" onClick={onVoltar} disabled={validando}>
          Voltar ao Perfil
        </button>
      </form>
    </>
  );
}