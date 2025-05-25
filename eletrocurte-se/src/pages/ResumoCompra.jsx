import '../styles/ResumoCompra.css';
import React from 'react';
import Products from '../Products';
import Header from '../components/Header';
import ROUTES from '../routes';
import Footer from '../components/Footer';

export default function ResumoCompra(){
    const items = [...Products];
    function renderItems(){
        return(items.map((items)=>(
            <div className="item-informacao" key={items.id}>
                <h4 className="item-numero">{items.id}.</h4>
                <img className="imagem-item-compra" src={items.img}></img>
                <h3 className="nome-item-compra">{items.name}</h3>
                <div className="botoes-quantidade">
                    <button className="retirar-item-compra" onClick={handleItemReduction}>-</button>
                    <input type="text" className="quantidade-item-compra" placeholder={items.quantity}></input>
                    <button className="adicionar-item-compra" onClick={handleItemAddition}>+</button>
                </div>
                <h4 className="preco-item-compra">{items.price.toFixed(2).replace('.',',')}</h4>
            </div>
        ))
      );
    }

    function handleItemAddition(){
        if(items.quantity > items.inStock){
            items.quantity++; 
        }
        else{
            alert("Cannot go above stock!")
        }
    }
    function handleItemReduction(){
        if(items.quantity == 0){
            items.quantity--; 
        }
        else{
            alert("Cannot go below 0")
        }
    }
    

    return(
        <>
            <Header/>
            <div className="resumo-compra">
                <div className="itens-compra">
                    <h1>Resumo da compra: </h1>
                    <div className="item-compra">
                        {renderItems()}
                        <div className="total">
                            <h4 className="preco-final-compra">Total: {(items.price*items.quantity).toFixed(2).replace('.',',')} </h4>
                        </div>
                    </div>
                    <button className="botao-continuar">Continuar compra</button>
                </div>

            </div>
            <Footer/>
        </>
    )
}

//Mostrar produtos, quantidades e o total da compra