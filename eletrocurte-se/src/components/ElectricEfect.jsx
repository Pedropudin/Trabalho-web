// -----------------------------------------------------------------------------
// EfeitoEletrico.jsx
// Visual component for animated electric effect on the screen.
// Generates animated particles and plays sound when triggered externally.
// Used for visual feedback in actions like ScrollToTop.
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useRef } from 'react';
import '../styles/EfeitoEletrico.css';

export default function EfeitoEletrico({ trigger }) {
  // List of animated particles on the screen
  const [particulas, setParticulas] = useState([]);
  // Stores the last trigger to avoid repetition
  const lastTrigger = useRef(null);

  useEffect(() => {
    // Only runs if the trigger actually changed
    if (
      trigger &&
      trigger.x !== undefined &&
      trigger.y !== undefined &&
      (lastTrigger.current?.x !== trigger.x || lastTrigger.current?.y !== trigger.y)
    ) {
      lastTrigger.current = trigger;

      // Plays the electric effect sound
      const som = new Audio('/electric_zap_001-6374.mp3');
      som.volume = 0.3;
      som.play().catch(() => {});

      // Creates animated particles in random positions near the trigger
      const novas = [];
      for (let i = 0; i < 6; i++) {
        const formatos = ['circulo', 'quadrado', 'faisca'];
        const classeForma = formatos[Math.floor(Math.random() * formatos.length)];
        const offsetX = Math.random() * 40 - 20;
        const offsetY = Math.random() * 40 - 20;
        novas.push({
          id: Math.random() + '-' + i,
          x: trigger.x + offsetX,
          y: trigger.y + offsetY,
          classe: classeForma,
        });
      }
      setParticulas(novas);

      // Removes particles after 0.5s
      const timeout = setTimeout(() => setParticulas([]), 500);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  return (
    <>
      {/* Renders animated particles on the screen */}
      {particulas.map(p => (
        <div
          key={p.id}
          className={`efeito-eletrico ${p.classe}`}
          style={{ left: p.x, top: p.y }}
        />
      ))}
    </>
  );
}