import React, { createContext, useState, useContext } from 'react';

// React Context for the Wallet
// - Allows global access to cards and balances
// - Functions to add card and balance
// - Used to share data between wallet-related components

const CarteiraContext = createContext();

export function CarteiraProvider({ children }) {
  const [cartoes, setCartoes] = useState([]);
  const [saldos, setSaldos] = useState({});

  // Adds a new card to the state and initializes its balance to 0
  function adicionarCartao(cartao) {
    setCartoes((prev) => [...prev, cartao]);
    setSaldos((prev) => ({ ...prev, [cartao.final]: 0 }));
  }

  // Adds the value to the informed card's balance
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

// Hook to access the wallet context in other components
export function useCarteira() {
  return useContext(CarteiraContext);
}
