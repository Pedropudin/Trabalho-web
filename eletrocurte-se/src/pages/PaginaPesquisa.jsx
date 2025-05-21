import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ROUTES from '../routes';
import '../styles/PaginaPesquisa.css';

function PaginaPesquisa({searchName}) {
    //Não sei se convém, mas acho que poderíamos separar isso!! => Usado em PaginaPesquisa e Sidebar
    const products = [
        { id: 1, name: "HyperX Cloud II", price: 200.0, available: true, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
        { id: 2, name: "HyperX Cloud II", price: 200.0, available: false, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
        { id: 3, name: "HyperX Cloud II", price: 200.0, available: true, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
    ];
    
    const displayProducts = products.map((product) => (
        <div key={product.id} className="items">
            <img
                className="item-image"
                src={product.img}
                alt={"Imagem do " + product.name}
                style={!product.available ? { filter: "grayscale(100%)" } : {}}
            />
            <p className="item-name">{product.name}</p><br />
            <p className="item-price"> {product.available ? "R$" + product.price.toFixed(2) : ""}</p>
            {product.available ? (
                <button className="product-display-purchase-button">Adicionar ao Carrinho</button>
            ) : (
                <p className="product-unavailable"><strong>Indisponível</strong></p>
            )}
        </div>
    ));

    return(
        <>
            <Header/>
            <div className="main-content">
                <Sidebar items={products}/>
                <div className="search-results">
                    <h4>Resultados para "Nome de Procura"</h4>
                    <div className="product-display">
                        {displayProducts}
                    </div>
                </div>
            </div>
            <Footer/>
        </>    
    );
}

export default PaginaPesquisa;