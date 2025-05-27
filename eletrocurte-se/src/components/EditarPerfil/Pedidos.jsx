import React from 'react';

export default function Pedidos({ onVoltar }) {
  return (
    <div className="editarperfil-card-form">
      <h2>Meus Pedidos</h2>
      <ul>
        <li>Pedido #12345 - Entregue em 20/05/2025</li>
        <li>Pedido #12344 - Em transporte</li>
        <li>Pedido #12343 - Aguardando pagamento</li>
      </ul>
      <button className="editarperfil-btn-voltar" onClick={onVoltar}>
        Voltar ao Perfil
      </button>
    </div>
  );
}