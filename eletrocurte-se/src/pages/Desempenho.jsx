import React from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import Header from "../components/Header";

const Desempenho = () => {
    const navigate = useNavigate();
    const categories = ["Desempenho", "Produtos", "Pendências"];

    
    return(
        <div>
            <Header categories={categories} useElementsMenu={[true, false, true]}/>
            <Footer />
        </div>
    );
};

export default Desempenho;
