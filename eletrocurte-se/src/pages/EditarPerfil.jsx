import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTES from '../routes';
import Header from '../components/Header';
import '../styles/EditarPerfil.css';
import Footer from '../components/Footer';
import Pedidos from '../components/EditarPerfil/Pedidos';
import Mensagens from '../components/EditarPerfil/Mensagens';
import Carteira from '../components/EditarPerfil/Carteira/Carteira';
import Enderecos from '../components/EditarPerfil/Enderecos';
import Privacidade from '../components/EditarPerfil/Privacidade';
import FormSeguranca from '../components/EditarPerfil/Seguranca';
import Historico from '../components/EditarPerfil/Historico';

/*
  Página de edição de perfil do usuário.
  Permite alterar nome, e-mail, senha, CPF e endereço.
*/

export default function EditarPerfil() {
  const location = useLocation();
  const flag = location.state?.flag || '';

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    endereco: '',
  });
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha || !form.cpf || !form.endereco) {
      setMensagem('Preencha todos os campos!');
      return;
    }
    setMensagem('Dados atualizados com sucesso!');
    setTimeout(() => {
      setMensagem('');
      navigate(ROUTES.PERFIL);
    }, 1500);
  }

  return (
    <>
      <Header />
      <main className="editarperfil-body-content">
        <div className="editarperfil-cards-grid">
          {/* Renderização condicional baseada na flag */}
          {flag === 'pedidos' && (
            <Pedidos onVoltar={() => navigate(ROUTES.PERFIL)} />
          )}

          {flag === 'mensagens' && (
            <Mensagens onVoltar={() => navigate(ROUTES.PERFIL)} />
          )}

          {flag === 'carteira' && (
            <Carteira onVoltar={() => navigate(ROUTES.PERFIL)} />
          )}

          {flag === 'seguranca' && (
            <FormSeguranca
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              mensagem={mensagem}
              onVoltar={() => navigate(ROUTES.PERFIL)}
            />
          )}

          {flag === 'enderecos' && (
            <Enderecos onVoltar={() => navigate(ROUTES.PERFIL)} />
          )}

          {flag === 'privacidade' && (
            <Privacidade onVoltar={() => navigate(ROUTES.PERFIL)} />
          )}

          {flag === 'historico' && (
            <Historico onVoltar={() => navigate(ROUTES.PERFIL)} />
          )}

          {/* Formulário padrão apenas se nenhuma flag específica estiver ativa */}
          {![
            'pedidos',
            'mensagens',
            'carteira',
            'seguranca',
            'enderecos',
            'privacidade',
            'historico',
          ].includes(flag) && (
            <form className="editarperfil-card-form" onSubmit={handleSubmit}>
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
              />
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                required
              />
              <label htmlFor="senha">Senha:</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Nova senha"
                required
              />
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
              <label htmlFor="endereco">Endereço:</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua, número, bairro, cidade"
                required
              />
              <button type="submit" className="editarperfil-btn-salvar">
                Salvar Alterações
              </button>
              {mensagem && <div className="editarperfil-mensagem-editar">{mensagem}</div>}
              <button
                type="button"
                className="editarperfil-btn-voltar"
                onClick={() => navigate(ROUTES.PERFIL)}
              >
                Voltar ao Perfil
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}