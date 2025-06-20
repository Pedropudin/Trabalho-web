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
        <footer>
            <div className="rodape-conteudo">
                <p>Tax ID: 12.345.678/0001-99</p>
                <p>
                    <a href="mailto:contact@eletrocurte-se.com" target="_blank" rel="noopener noreferrer">
                        contact@eletrocurte-se.com
                    </a>
                </p>
                <p>Phone: (11) 3567-4821</p>
                {isTermsPage ? (
                    <p>
                        <Link to={ROUTES.PRESENTATION}>
                            About us!
                        </Link>
                    </p>
                ) : (
                    <p>
                        <Link to={ROUTES.TERMS_CONDITIONS}>
                            Terms and Conditions
                        </Link>
                    </p>
                )}
                <p>
                    <a href="https://www.google.com/maps?q=Av.+das+Nações,+1234" target="_blank" rel="noopener noreferrer">
                        1234 Nations Avenue
                    </a>
                </p>
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
    );
};

export default Footer;