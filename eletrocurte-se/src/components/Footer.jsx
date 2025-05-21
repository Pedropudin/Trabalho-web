import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ROUTES from "../routes";
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import "../styles/Footer.css";

const Footer = () => {
    const { pathname } = useLocation();

    return (
        pathname === ROUTES.TERMOS ? (
            <footer>
                <div className="rodape-conteudo">
                    <p>000.000.000-00</p>
                    <p>email@gmail.com</p>
                    <p>Tel: (00) 00000-0000</p>
                    <p>
                        <Link to={ROUTES.APRESENTACAO}>
                            Sobre nós!
                        </Link>
                    </p>
                    <p>Endereço</p>
                    <div className="social-icons">
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
                <p className="copyright">Copyright &copy;2025</p>
            </footer>
        ) : (
            <footer>
                <div className="rodape-conteudo">
                    <p>000.000.000-00</p>
                    <p>email@gmail.com</p>
                    <p>Tel: (00) 00000-0000</p>
                    <p>
                        <Link to={ROUTES.TERMOS}>
                            Termos e Condições
                        </Link>
                    </p>
                    <p>Endereço</p>
                    <div className="social-icons">
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
                <p className="copyright">Copyright &copy;2025</p>
            </footer>
        )
    );
};

export default Footer;