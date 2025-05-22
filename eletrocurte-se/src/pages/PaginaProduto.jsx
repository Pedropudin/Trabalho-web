import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ROUTES from '../routes';
import '../styles/PaginaProduto.css';

export default function PaginaProduto(){


    return (
        <>
            <Header />
                <div className="main-content">
                    <div className="products">
                        <div className="items">
                            <div className="item-images"> 
                                <img className="product-image" src="../../Page-Products/fone-hyperx.jpg" alt="Headset HyperX Cloud II" />
                                <div className="thumbs">
                                    <img className="thumb" src="../../Page-Products/fone-hyperx1.jpg" alt="Headset HyperX Cloud II" />
                                    <img className="thumb" src="../../Page-Products/fone-hyperx2.jpg" alt="Headset HyperX Cloud II" />
                                    <img className="thumb" src="../../Page-Products/fone-hyperx3.jpg" alt="Headset HyperX Cloud II" />
                                    <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="https://www.w3.org/2000/svg" className="IconArrowCarousel"><path fillRule="evenodd" clipRule="evenodd" d="M24 12.8182L21.8182 15L12 5.18182L2.18182 15L2.60179e-08 12.8182L12 0.818182L24 12.8182Z" fill="#565C69"></path></svg>
                                </div>    
                            </div>
                            <div className="item-information">
                                <h1 className="product-name">Headset HyperX Cloud II</h1>
                                <p className="product-description">Compatível com PC, PS5, Xbox Series X/S, Drivers Angulados de 53mm, Áudio DTS, Microfone de 10 mm, USB-C, USB-A, Fio de 3,5 mm, Vermelho e Preto (727A9AA)<br /></p>
                                <h2 className="product-price">R$ 299,00</h2>
                                <p>Em até 10x de R$ 29,90 sem juros no cartão.</p>
                                <div className="product-buttons">
                                    <button className="product-display-purchase-button">COMPRAR</button>
                                    <button className="product-cart-purchase-button">ADICIONAR AO CARRINHO</button>
                                </div>     
                            </div> 
                        </div>
                        <div className="item-description">
                            <div className="text-description">
                                <h2>Descrição do Produto</h2>
                                <ul>
                                    <li><strong>Headset Gamer Sem Fio HyperX Cloud II Core</strong></li>
                                    <ul><li>80 horas de duração da bateria devem ajudá-lo a dar adeus àquelas irritantes notificações de bateria fraca.</li></ul>
                                </ul>

                                <ul>
                                    <li><strong>Áudio Espacial Imersivo E Localização De Som</strong></li>
                                    <ul><li>O DTS Headphone:X Spatial Audio ajuda a melhorar a localização do som e a melhorar a imersão dos seus jogos e entretenimento de áudio.</li></ul>
                                </ul>

                            </div>
                            <div className="text-specifications">
                                <h2>Especificações do Produto</h2>
                                <ul>
                                    <li><strong>Características:</strong></li>
                                    <ul>
                                        <li>Marca: HyperX</li>
                                        <li>Modelo: 6Y2G8AA</li>
                                    </ul>
                                    <li><strong>Especificações:</strong></li>
                                    <ul>
                                        <li><strong>Fone de Ouvido:</strong></li>
                                        <ul>
                                            <li>Driver: Dinâmico, 53mm com ímãs de neodímio</li>
                                            <li>Fator de forma: Sobre a orelha, circumaural, fechado atrás</li>
                                            <li>Resposta de frequência: 10 Hz - 21 kHz</li>
                                            <li>Sensibilidade: 100 dBSPL/mW a 1 kHz</li>
                                            <li>DTH: &lt; 2%</li>
                                            <li>Tipo de quadro: Alumínio</li>
                                            <li>Almofadas de ouvido: Espuma viscoelástica e couro sintético premium</li>
                                            <li>Comprimento do cabo: 1,64 pés | Cabo de carga USB</li>
                                        </ul>
                                        <li><strong>Microfone:</strong></li>
                                        <ul>
                                            <li>Elemento: Microfone condensador de eletreto</li>
                                            <li>Padrão polar: Bidirecional, com cancelamento de ruído</li>
                                            <li>Sensibilidade: -17,2 dBFS/Pa a 1 kHz</li>
                                        </ul>
                                        <li><strong>Conexões e Recursos:</strong></li>
                                        <ul>
                                            <li>Especificação USB: USB 2.0</li>
                                            <li>Profundidade de bits: 16 bits</li>
                                            <li>Controles de áudio: Controles de áudio integrados</li>
                                        </ul>
                                        <li><strong>Especificações da Bateria:</strong></li>
                                        <ul>
                                            <li>Vida útil da bateria: 80 horas</li>
                                            <li>Tempo de carregamento: 4,5 horas</li>
                                        </ul>
                                        <li><strong>Especificações Sem Fio:</strong></li>
                                        <ul>
                                            <li>Alcance sem fio: Até 20 metros</li>
                                        </ul>
                                        <li><strong>Conteúdo da Embalagem:</strong></li>
                                        <ul>
                                            <li>Headset Gamer Sem Fio</li>
                                            <li>Adaptador USB</li>
                                            <li>Cabo de carregamento USB</li>
                                            <li>Microfone removível</li>
                                        </ul>
                                        <li><strong>Garantia:</strong></li>
                                        <ul>
                                            <li>1 ano de garantia (3 meses de garantia legal + 9 meses de garantia contratual junto ao fabricante)</li>
                                        </ul>
                                        <li><strong>Peso:</strong></li>
                                        <ul>
                                            <li>717 gramas (bruto com embalagem)</li>
                                        </ul>
                                    </ul>
                                </ul>
                            </div>
                    </div>
                    </div>
                </div>             
            <Footer />
        </>

    ); 
}