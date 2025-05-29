import '../styles/PaginaProduto.css';
import React, { useState } from 'react';
import Products from '../Products'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom'; 

export default function PaginaProduto() {
  const { id } = useParams(); 
  const product = Products.find(p => String(p.id) === String(id));

  // Garante que a imagem principal está nas thumbs, sem duplicatas
  const thumbs = product?.thumbs || [];
  const [mainImg, setMainImg] = useState(product?.img);

  if (!product) {
    return (
      <>
        <Header />
        <main className="main-content">
          <h2 style={{ margin: '2rem', textAlign: 'center' }}>Produto não encontrado.</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="products">
          <div className="item">
            <div className="item-images">
              <img
                className="product-image"
                src={mainImg}
                alt={product.name}
                style={{ cursor: 'pointer' }}
                onClick={() => window.open(mainImg, '_blank')}
              />
              <div className="thumbs">
                {thumbs.map((thumbUrl, i) => (
                  <img
                    key={i}
                    className="thumb"
                    src={thumbUrl}
                    alt={`Miniatura de ${product.name}`}
                    style={{
                      border: mainImg === thumbUrl ? '2px solid #007b99' : undefined
                    }}
                    onClick={() => setMainImg(thumbUrl)}
                  />
                ))}
              </div>
            </div>
            <div className="item-information">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-description">{product.description}</p>
              <h2 className="product-price">
                R${product.price.toFixed(2).replace('.', ',')}
              </h2>
              <p>
                Em até 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')} sem juros no cartão de crédito.
                <span className="product-in-stock">Em estoque: {product.inStock}</span>
              </p>
              <div className="product-buttons">
                <button className="product-purchase-button">COMPRAR</button>
                <button className="product-cart-button">ADICIONAR AO CARRINHO</button>
              </div>
            </div>
          </div>
          <div className="item-description">
            <div className="text-description">
              <h2>Descrição do Produto</h2>
              <p>{product.fullDescription}</p>
            </div>
            <div className="text-specifications">
              <h2>Especificações do Produto</h2>
              <ul>
                {product.specifications?.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}