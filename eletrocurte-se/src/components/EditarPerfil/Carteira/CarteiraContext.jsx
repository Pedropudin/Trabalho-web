import React, { createContext, useState, useContext } from 'react';

const CarteiraContext = createContext();

export function CarteiraProvider({ children }) {
  const [cartoes, setCartoes] = useState([]);
  const [saldos, setSaldos] = useState({});

  function adicionarCartao(cartao) {
    setCartoes((prev) => [...prev, cartao]);
    setSaldos((prev) => ({ ...prev, [cartao.final]: 0 }));
  }

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

export function useCarteira() {
  return useContext(CarteiraContext);
}
