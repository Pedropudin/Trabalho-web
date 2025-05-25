import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTES from '../routes';
import Header from '../components/Header';
import '../styles/EditarPerfil.css';
import Footer from '../components/Footer';
import Pedidos from '../components/EditarPerfil/Pedidos';
import Mensagens from '../components/EditarPerfil/Mensagens';
import Carteira from '../components/EditarPerfil/Carteira/Carteira';
import Enderecos from '../components/EditarPerfil/Enderecos/Enderecos';
import Privacidade from '../components/EditarPerfil/Privacidade';
import FormSeguranca from '../components/EditarPerfil/Seguranca';
import Historico from '../components/EditarPerfil/Historico';

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

  useEffect(() => {
    const flagsSecundarias = [
      'pedidos',
      'mensagens',
      'carteira',
      'seguranca',
      'enderecos',
      'privacidade',
      'historico',
    ];
    if (!flag && !flagsSecundarias.includes(flag)) {
      navigate(ROUTES.PERFIL);
    }
  }, [flag, navigate]);

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
          {flag === 'pedidos' && <Pedidos onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'mensagens' && <Mensagens onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'carteira' && <Carteira onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'seguranca' && (
            <FormSeguranca
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              mensagem={mensagem}
              onVoltar={() => navigate(ROUTES.PERFIL)}
            />
          )}
          {flag === 'enderecos' && <Enderecos onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'privacidade' && <Privacidade onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'historico' && <Historico onVoltar={() => navigate(ROUTES.PERFIL)} />}
        </div>
      </main>
      <Footer />
    </>
  );
}