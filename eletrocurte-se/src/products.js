// Produtos do histórico de compras
export const produtosHistorico = [
    {
    nome: 'Tralalero tralala',
    preco: 'R$ 159,99',
    img: '/imagens/airfryer.jpeg',
    data: '28/01/2025',
  },
  {
    nome: 'Raquete Elétrica',
    preco: 'R$ 89,90',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    data: '12/03/2025',
  },

  {
    nome: 'Raquete Elétrica',
    preco: 'R$ 89,90',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    data: '12/03/2021',
  },

  {
    nome: 'Raquete Elétrica',
    preco: 'R$ 89,90',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    data: '12/03/2027',
  },
  
  {
    nome: 'Escova Elétrica',
    preco: 'R$ 159,99',
    img: '/imagens/escova_elétrica.jpeg',
    data: '15/03/2025',
  },
  {
    nome: 'Aspirador de Pó',
    preco: 'R$ 349,90',
    img: '/imagens/aspirador_de_pó.jpeg',
    data: '20/03/2025',
  },
  {
    nome: 'Máquina de Lavar',
    preco: 'R$ 2.799,00',
    img: '/imagens/máquina_de_lavar.jpeg',
    data: '25/03/2025',
  },
  {
    nome: 'Air Fryer',
    preco: 'R$ 479,00',
    img: '/imagens/airfryer.jpeg',
    data: '28/03/2025',
  },

  {
    nome: 'Tralalero tralala',
    preco: 'R$ 159,99',
    img: '/imagens/airfryer.jpeg',
    data: '28/07/2025',
  },

  
];

// Produtos do histórico de produtos visualizados
export const produtosVisualizados = [
  {
    nome: 'Raquete Elétrica',
    preco: 'R$ 89,90',
    img: '/imagens/raquete_elétrica2.jpeg',
    data: '12/03/2025',
  },
  {
    nome: 'Escova Elétrica',
    preco: 'R$ 159,99',
    img: '/imagens/escova_elétrica.jpeg',
    data: '15/03/2025',
  },
  {
    nome: 'Aspirador de Pó',
    preco: 'R$ 349,90',
    img: '/imagens/aspirador_de_pó.jpeg',
    data: '20/03/2025',
  },
  {
    nome: 'Máquina de Lavar',
    preco: 'R$ 2.799,00',
    img: '/imagens/máquina_de_lavar.jpeg',
    data: '25/03/2025',
  },
  {
    nome: 'Air Fryer',
    preco: 'R$ 479,00',
    img: '/imagens/airfryer.jpeg',
    data: '28/03/2025',
  },

  {
    nome: 'Tralalero tralala',
    preco: 'R$ 159,99',
    img: '/imagens/airfryer.jpeg',
    data: '28/07/2025',
  },
];

// Função utilitária para obter produtos por rota
export function getProdutosByRoute(route) {
  // Exemplo: pode expandir para outras rotas e lógicas
  switch (route) {
    case '/historico-compras':
      return produtosHistorico;
    case '/historico-produtos':
      return produtosVisualizados;
    // Adicione outros cases para outras rotas e listas de produtos
    default:
      return [];
  }
}
