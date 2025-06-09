import React, { createContext, useState, useContext } from 'react';

// React Context for the Wallet
// - Provides global access to cards and balances
// - Functions to add cards and add balance
// - Used to share wallet data between components

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [balances, setBalances] = useState({});

  // Adds a new card to state and initializes its balance to 0
  function addCard(card) {
    setCards(prev => [...prev, card]);
    setBalances(prev => ({ ...prev, [card.last4]: 0 }));
  }

  // Adds value to the specified card's balance
  function addBalance(cardLast4, amount) {
    setBalances(prev => ({
      ...prev,
      [cardLast4]: (prev[cardLast4] || 0) + amount,
    }));
  }

  return (
    <WalletContext.Provider value={{ cards, balances, addCard, addBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to access the wallet context in other components
export function useWallet() {
  return useContext(WalletContext);
}