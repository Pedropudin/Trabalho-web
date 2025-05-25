import React from 'react';

export default function Privacidade({ onVoltar }) {
  return (
    <div className="editarperfil-card-form">
      <h2>Privacidade</h2>
      <ul>
        <li>Permitir notificações por e-mail: <b>Ativado</b></li>
        <li>Compartilhamento de dados com parceiros: <b>Desativado</b></li>
      </ul>
      <button className="editarperfil-btn-voltar" onClick={onVoltar}>
        Voltar ao Perfil
      </button>
    </div>
  );
}
