import React from 'react';
import '../styles/PaginaInicial.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const PaginaInicial = () => {
    return (
        <>
            <Header />
            <main>
                <h1>Página Inicial</h1>
            </main>
            <ScrollToTop />
            <Footer />
        </>
    );
}

export default PaginaInicial;