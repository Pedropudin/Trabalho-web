// Produtos do histórico de compras
export const produtosHistorico = [
  {
    nome: 'Raquete Elétrica',
    preco: 'R$ 89,90',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', // Raquete elétrica
    data: '12/03/2025',
  },
  {
    nome: 'Escova Elétrica',
    preco: 'R$ 159,99',
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', // Escova elétrica
    data: '15/03/2025',
  },
  {
    nome: 'Aspirador de Pó',
    preco: 'R$ 349,90',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', // Aspirador de pó
    data: '20/03/2025',
  },
  {
    nome: 'Máquina de Lavar',
    preco: 'R$ 2.799,00',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80', // Máquina de lavar
    data: '25/03/2025',
  },
  {
    nome: 'Air Fryer',
    preco: 'R$ 479,00',
    img: 'https://images.unsplash.com/photo-1606813909354-527c48b2a6c5?auto=format&fit=crop&w=400&q=80', // Air Fryer
    data: '28/03/2025',
  },
  {
    nome: 'Tralalero tralala',
    preco: 'R$ 159,99',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', // Imagem genérica
    data: '28/07/2025',
  },
];

// Produtos do histórico de produtos visualizados
export const produtosVisualizados = [
  {
    nome: 'Raquete Elétrica',
    preco: 'R$ 89,90',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    data: '12/03/2025',
  },
  {
    nome: 'Escova Elétrica',
    preco: 'R$ 159,99',
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    data: '15/03/2025',
  },
  {
    nome: 'Aspirador de Pó',
    preco: 'R$ 349,90',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    data: '20/03/2025',
  },
  {
    nome: 'Máquina de Lavar',
    preco: 'R$ 2.799,00',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
    data: '25/03/2025',
  },
  {
    nome: 'Air Fryer',
    preco: 'R$ 479,00',
    img: 'https://images.unsplash.com/photo-1606813909354-527c48b2a6c5?auto=format&fit=crop&w=400&q=80',
    data: '28/03/2025',
  },
  {
    nome: 'Controle Remoto',
    preco: 'R$ 79,90',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', // Controle remoto
    data: '10/04/2025',
  },
  {
    nome: 'Hardware',
    preco: 'R$ 1.199,00',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80', // Hardware
    data: '12/04/2025',
  },
  {
    nome: 'Televisão Samsung QLED/4K',
    preco: 'R$ 2.999,00',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', // TV
    data: '15/04/2025',
  },
  {
    nome: 'Microondas',
    preco: 'R$ 499,00',
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', // Microondas (imagem similar à escova elétrica)
    data: '18/04/2025',
  },
  {
    nome: 'Liquidificador',
    preco: 'R$ 159,00',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', // Liquidificador
    data: '20/04/2025',
  },
];

// Função utilitária para obter produtos por rota
export function getProdutosByRoute(route) {
  switch (route) {
    case '/historico-compras':
      return produtosHistorico;
    case '/historico-produtos':
      return produtosVisualizados;
    default:
      return [];
  }
}
