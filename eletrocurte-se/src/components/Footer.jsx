import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import "../styles/Footer.css";

const Footer = () => {
    return(
        <footer>
            <div class="rodape-conteudo">
                <p>000.000.000-00</p>
                <p>email@gmail.com</p>
                <p>Tel: (00) 00000-0000</p>

                <p>
                    <a href="../pagina_de_termos_e_condicoes/index.html" target="_blank">
                        Termos e Condições
                    </a>
                </p>
                <p>Endereço</p>

                <div class="social-icons">
                    <a href="https://www.instagram.com/" target="_blank">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://www.twitter.com/" target="_blank">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://www.facebook.com/" target="_blank">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                </div>
            </div>

            <br/>
            <p class="copyright">Copyright &copy;2025</p>
        </footer>
    );
};

export default Footer;