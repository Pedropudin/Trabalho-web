import React from 'react';

export default function Enderecos({ onVoltar }) {
  return (
    <div className="editarperfil-card-form">
      <h2>Endereços</h2>
      <ul>
        <li>Rua das Flores, 123 - Centro, São Paulo/SP</li>
        <li>Av. Brasil, 456 - Jardim, Rio de Janeiro/RJ</li>
      </ul>
      <button className="editarperfil-btn-voltar" onClick={onVoltar}>
        Voltar ao Perfil
      </button>
    </div>
  );
}
