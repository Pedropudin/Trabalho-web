import '../styles/PaginaProduto.css';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PaginaProduto() {
    //Mesma coisa!! 
    const product = { name: "Headset HyperX Cloud II", marca:"hyperx", price: Number(299.0), inStock: 10, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" };
    //Acho que aqui tbm valeria separar, poderia ser no mesmo documento do outro, apenas colocando 3 thumbs como parte do objeto!! 
    const thumbs = [
            {name: "photo 1", link:"https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg", alt:"Headset HyperX Cloud II"},
            {name: "photo 2", link:"https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg", alt:"Headset HyperX Cloud II"},
            {name: "photo 3", link:"https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg", alt:"Headset HyperX Cloud II"},
        ];

    //Função para miniaturas 
    const displayThumbs = (
        thumbs.map((thumbs, idx) => (
            <div className="thumbs" key={thumbs.name + '-' + idx}>
                <img className="thumb"
                    src={thumbs.link}
                    alt={thumbs.alt}
                />
            </div>
        ))
    );
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="products">
          <div className="item">
            <div className="item-images">
              <img
                className="product-image"
                src="https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg"
                alt="Headset HyperX Cloud II"
              />
              <div className="thumbs">
                {displayThumbs}
                <svg
                  width="24"
                  height="15"
                  viewBox="0 0 24 15"
                  xmlns="http://www.w3.org/2000/svg"
                  className="IconArrowCarousel"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 12.8182L21.8182 15L12 5.18182L2.18182 15L0 12.8182L12 0.818182L24 12.8182Z"
                    fill="#565C69"
                  />
                </svg>
              </div>
            </div>
            <div className="item-information">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-description">
                Compatível com PC, PS5, Xbox Series X/S, Drivers Angulados de 53mm, Áudio DTS, Microfone de 10 mm, USB-C, USB-A, Fio de 3,5 mm, Vermelho e Preto (727A9AA)
                <br />
              </p>
              <h2 className="product-price">
                R${product.price.toFixed(2).replace('.', ',')}
              </h2>
              <p>
                Em até 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')} sem juros no cartão de crédito.
              </p>
              <div className="product-buttons" style={{ display: "flex", gap: "16px" }}>
                <button className="product-purchase-button">COMPRAR</button>
                <button className="product-cart-button">ADICIONAR AO CARRINHO</button>
              </div>
            </div>
          </div>
          <div className="item-description">
            <div className="text-description">
              <h2>Descrição do Produto</h2>
              <ul>
                <li>
                  <strong>Headset Gamer Sem Fio HyperX Cloud II Core</strong>
                  <ul>
                    <li>
                      80 horas de duração da bateria devem ajudá-lo a dar adeus àquelas irritantes notificações de bateria fraca.
                    </li>
                  </ul>
                </li>
              </ul>
              <ul>
                <li>
                  <strong>Áudio Espacial Imersivo E Localização De Som</strong>
                  <ul>
                    <li>
                      O DTS Headphone:X Spatial Audio ajuda a melhorar a localização do som e a melhorar a imersão dos seus jogos e entretenimento de áudio.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="text-specifications">
              <h2>Especificações do Produto</h2>
              <ul>
                <li>
                  <strong>Características:</strong>
                  <ul>
                    <li>Marca: HyperX</li>
                    <li>Modelo: 6Y2G8AA</li>
                  </ul>
                </li>
                <li>
                  <strong>Especificações:</strong>
                  <ul>
                    <li>
                      <strong>Fone de Ouvido:</strong>
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
                    </li>
                    <li>
                      <strong>Microfone:</strong>
                      <ul>
                        <li>Elemento: Microfone condensador de eletreto</li>
                        <li>Padrão polar: Bidirecional, com cancelamento de ruído</li>
                        <li>Sensibilidade: -17,2 dBFS/Pa a 1 kHz</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Conexões e Recursos:</strong>
                      <ul>
                        <li>Especificação USB: USB 2.0</li>
                        <li>Profundidade de bits: 16 bits</li>
                        <li>Controles de áudio: Controles de áudio integrados</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Especificações da Bateria:</strong>
                      <ul>
                        <li>Vida útil da bateria: 80 horas</li>
                        <li>Tempo de carregamento: 4,5 horas</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Especificações Sem Fio:</strong>
                      <ul>
                        <li>Alcance sem fio: Até 20 metros</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Conteúdo da Embalagem:</strong>
                      <ul>
                        <li>Headset Gamer Sem Fio</li>
                        <li>Adaptador USB</li>
                        <li>Cabo de carregamento USB</li>
                        <li>Microfone removível</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Garantia:</strong>
                      <ul>
                        <li>
                          1 ano de garantia (3 meses de garantia legal + 9 meses de garantia contratual junto ao fabricante)
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Peso:</strong>
                      <ul>
                        <li>717 gramas (bruto com embalagem)</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}