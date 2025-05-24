import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import Header from "../components/Header";

const Pendencias = () => {
    const categories = ["Desempenho", "Produtos", "Pendências"];
    
    return(
        <div>
            <Header categories={categories} useElementsMenu={[true, false, true]}/>
            <Footer />
        </div>
    );
};

export default Pendencias;