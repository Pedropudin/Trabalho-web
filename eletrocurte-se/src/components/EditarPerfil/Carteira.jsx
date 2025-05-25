import React, { useState } from 'react';
import ModalCarteira from './ModalCarteira';

export default function Carteira({ onVoltar }) {
  const [saldo, setSaldo] = useState(150.00);
  const [cartoes, setCartoes] = useState([
    { bandeira: 'Visa', final: '1234', numero: '**** **** **** 1234' }
  ]);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="editarperfil-card-form">
      <h2>Carteira</h2>
      <p style={{ fontSize: '1.2rem', margin: '12px 0' }}>
        Saldo disponível: <b>{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
      </p>
      <button className="editarperfil-btn-salvar" onClick={() => setModalAberto(true)}>
        Adicionar saldo
      </button>
      <button className="editarperfil-btn-voltar" style={{ marginTop: 10 }} onClick={onVoltar}>
        Voltar ao Perfil
      </button>
      <div style={{ marginTop: 18 }}>
        <p style={{ fontWeight: 500, marginBottom: 6 }}>Cartões cadastrados:</p>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {cartoes.map((c, i) => (
            <li key={i} style={{ fontSize: 15 }}>{c.bandeira} <span style={{ color: '#888' }}>{c.numero}</span></li>
          ))}
        </ul>
      </div>
      {modalAberto && (
        <ModalCarteira
          saldo={saldo}
          cartoes={cartoes}
          setCartoes={setCartoes}
          setSaldo={setSaldo}
          onClose={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}