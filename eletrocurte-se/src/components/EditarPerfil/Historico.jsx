import React from 'react';

export default function Historico({ onVoltar }) {
  return (
    <div className="editarperfil-card-form">
      <h2>Histórico de Compras</h2>
      <ul>
        <li>Máquina de Lavar - 25/03/2025</li>
        <li>Air Fryer - 28/03/2025</li>
        <li>Raquete Elétrica - 12/03/2025</li>
      </ul>
      <button className="editarperfil-btn-voltar" onClick={onVoltar}>
        Voltar ao Perfil
      </button>
    </div>
  );
}
