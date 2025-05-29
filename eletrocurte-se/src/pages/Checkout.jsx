import '../styles/Checkout.css';
import React from 'react';
import Header from '../components/Header';
import ROUTES from '../routes';
import { navigate, useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import Review from '../components/Review';
import CompraFinalizada from '../components/CompraFinalizada';
import PaymentDetails from '../components/PaymentDetails';
import PersonalDetails from '../components/PersonalDetails';

export default function Checkout(){
    const navigate = useNavigate(); 
    return(
        <>
            <Header/>
                <PaymentDetails/>
                <PersonalDetails/>
                <Review /> 
                <CompraFinalizada/> 
            <Footer/>
        </>
    );
}