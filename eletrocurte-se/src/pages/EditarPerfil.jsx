import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ROUTES from '../routes';
import Header from '../components/Header';
import '../styles/EditarPerfil.css';
import Footer from '../components/Footer';

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
            <div className="editarperfil-info">
              <h2>Meus Pedidos</h2>
              {/* Lista de pedidos do usuário */}
              <p>Veja o status dos seus pedidos aqui.</p>
            </div>
          )}

          {flag === 'mensagens' && (
            <div className="editarperfil-info">
              <h2>Mensagens</h2>
              {/* Caixa de mensagens ou notificações */}
              <p>Confira suas mensagens e novidades.</p>
            </div>
          )}

          {flag === 'carteira' && (
            <div className="editarperfil-info">
              <h2>Carteira</h2>
              {/* Informações de saldo, cartões, etc */}
              <p>Gerencie seu saldo e contas.</p>
            </div>
          )}

          {flag === 'seguranca' && (
            <form className="editarperfil-card-form" onSubmit={handleSubmit}>
              <h2>Segurança</h2>
              {/* Formulário apenas para senha, e-mail, CPF */}
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

          {flag === 'enderecos' && (
            <div className="editarperfil-info">
              <h2>Endereços</h2>
              {/* Formulário/lista de endereços */}
              <p>Gerencie seus endereços de entrega.</p>
            </div>
          )}

          {flag === 'privacidade' && (
            <div className="editarperfil-info">
              <h2>Privacidade</h2>
              {/* Configurações de privacidade */}
              <p>Configurações de dados e privacidade.</p>
            </div>
          )}

          {flag === 'historico' && (
            <div className="editarperfil-info">
              <h2>Histórico de Compras</h2>
              {/* Histórico de compras */}
              <p>Veja suas compras anteriores.</p>
            </div>
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