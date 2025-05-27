import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Reputation from "../components/Dashboard/Reputation";
import "../styles/Dashboard.css"

const Desempenho = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const categories = ["Desempenho", "Produtos", "Pendências"];

    /* Provisory local data */
    useEffect(() => {
        fetch('/data/dashboard.json')
        .then((resp) => {
            return resp.json();
        })
        .then(dash_data => {
            setData(dash_data);
        })
    }, []);

    return(
        <div>
            <AdminHeader categoryIndex={0} />
            {data && <Reputation data={data}/>}
            <Footer />
        </div>
    );
};

export default Desempenho;
