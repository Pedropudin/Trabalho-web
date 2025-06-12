import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import ROUTES from "../routes";
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

import "../styles/Footer.css";

const Footer = () => {
    const { pathname } = useLocation();
    const isTermsPage =
        pathname.replace(/\/+$/, '').toLowerCase() === ROUTES.TERMS_CONDITIONS.replace(/\/+$/, '').toLowerCase();

    return (
        isTermsPage ? (
            <footer>
                <div className="rodape-conteudo">
                    <p>000.000.000-00</p>
                    <p>email@gmail.com</p>
                    <p>Phone: (00) 00000-0000</p>
                    <p>
                        <Link to={ROUTES.PRESENTATION}>
                            About us!
                        </Link>
                    </p>
                    <p>Address</p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    </div>
                </div>
                <br />
                <p className="copyright">Copyright &copy;2025</p>
            </footer>
        ) : (
            <footer>
                <div className="rodape-conteudo">
                    <p>000.000.000-00</p>
                    <p>email@gmail.com</p>
                    <p>Phone: (00) 00000-0000</p>
                    <p>
                        <Link to={ROUTES.TERMS_CONDITIONS}>
                            Terms and Conditions
                        </Link>
                    </p>
                    <p>Address</p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    </div>
                </div>
                <br />
                <p className="copyright">Copyright &copy;2025</p>
            </footer>
        )
    );
};

export default Footer;