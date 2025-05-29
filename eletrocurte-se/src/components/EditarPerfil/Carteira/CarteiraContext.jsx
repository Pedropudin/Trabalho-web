import React, { createContext, useState, useContext } from 'react';

// Contexto React para a Carteira
// - Permite acesso global a cartões e saldos
// - Funções para adicionar cartão e saldo
// - Usado para compartilhar dados entre componentes relacionados à carteira

const CarteiraContext = createContext();

export function CarteiraProvider({ children }) {
  const [cartoes, setCartoes] = useState([]);
  const [saldos, setSaldos] = useState({});

  // Adiciona um novo cartão ao estado e inicializa seu saldo em 0
  function adicionarCartao(cartao) {
    setCartoes((prev) => [...prev, cartao]);
    setSaldos((prev) => ({ ...prev, [cartao.final]: 0 }));
  }

  // Soma o valor ao saldo do cartão informado
  function adicionarSaldo(finalCartao, valor) {
    setSaldos((prev) => ({
      ...prev,
      [finalCartao]: (prev[finalCartao] || 0) + valor,
    }));
  }

  return (
    <CarteiraContext.Provider value={{ cartoes, saldos, adicionarCartao, adicionarSaldo }}>
      {children}
    </CarteiraContext.Provider>
  );
}

// Hook para acessar o contexto da carteira em outros componentes
export function useCarteira() {
  return useContext(CarteiraContext);
}
