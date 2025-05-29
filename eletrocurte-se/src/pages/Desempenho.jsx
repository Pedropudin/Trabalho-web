import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Reputation from "../components/Dashboard/Reputation";
import Card from "../components/Card";
import "../styles/Dashboard.css"
import "../styles/TextStyles.css"

const PopularProduct = ({
    name,
    photo,
    price,
    sold,
    stock
}) => {

    const priceStyle = {
        backgroundColor: '#C8FACE',
        borderRadius: '50px',
        padding: '10px',
        fontSize: '20px'
    }

    return(
        <Card
            title={"Popularidade"}
            description={"Produto mais vendido nos últimos 30 dias"}
            type={"card-horizontal"}
        >
            <div className="popular-container" >
                <img src={photo} style={{width: '20%'}} />
                <div className="popular-text">
                    <span className="title-text">{name}</span>
                    <span style={priceStyle} >R$ {price}</span>
                    <span className="description-text">{sold} unidades vendidas</span>
                </div>
                <div className="popular-text">
                    <span className="title-text">{stock}</span>
                    <span className="description-text">Unidades em estoque</span>
                </div>
            </div>
        </Card>
    );
};

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
            <div className="content">
                { data && <Reputation
                    percentage={data.sales_percentage}
                    complainings={data.complainings}
                    late_send={data.late_send}
                    new_users={data.new_users}
                /> }        
                { data && <PopularProduct
                    name={data.product_popular.name}
                    photo={data.product_popular.photo}
                    price={data.product_popular.price}
                    sold={data.product_popular.quantity_sold}
                    stock={data.product_popular.stock}
                /> }
                
            </div>
            <Footer />
        </div>
    );
};

export default Desempenho;
