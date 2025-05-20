import React, { useState, useEffect, useRef } from 'react';
import '../styles/EfeitoEletrico.css';

export default function EfeitoEletrico({ trigger }) {
  const [particulas, setParticulas] = useState([]);
  const lastTrigger = useRef(null);

  useEffect(() => {
    // Só executa se o trigger mudou de fato
    if (
      trigger &&
      trigger.x !== undefined &&
      trigger.y !== undefined &&
      (lastTrigger.current?.x !== trigger.x || lastTrigger.current?.y !== trigger.y)
    ) {
      lastTrigger.current = trigger;

      // Toca o som
      const som = new Audio('/electric_zap_001-6374.mp3');
      som.volume = 0.3;
      som.play().catch(() => {});

      // Cria partículas
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

      // Remove partículas após 0.5s
      const timeout = setTimeout(() => setParticulas([]), 500);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  return (
    <>
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