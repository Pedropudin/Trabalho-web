import React from 'react';

export default function Mensagens({ onVoltar }) {
  return (
    <div className="editarperfil-card-form">
      <h2>Mensagens</h2>
      <ul>
        <li>Promoção: Frete grátis para compras acima de R$ 200!</li>
        <li>Seu pedido #12344 foi enviado.</li>
        <li>Atualização de política de privacidade.</li>
      </ul>
      <button className="editarperfil-btn-voltar" onClick={onVoltar}>
        Voltar ao Perfil
      </button>
    </div>
  );
}
