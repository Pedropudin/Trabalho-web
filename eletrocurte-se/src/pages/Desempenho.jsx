import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Reputation from "../components/Dashboard/Reputation";
import Card from "../components/Card";
import "../styles/Desempenho.css"
//import ProductCard from '../components/Produtos/ProductCard';
//import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';
import "../styles/TextStyles.css"
import AdminSidebar from "../components/admin/AdminSidebar";
import Graph from "../components/Dashboard/Graph";

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

const SalesGraph = () => {
    return(
        <Card
            title={"Vendas"}
            type={"card-horizontal"}
            description="Vendas nos últimos 30 dias"
            style={{width: "70%"}}
        >
            <Graph />
        </Card>
    );
};

const Desempenho = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    /* Changes still to be tested
    // Estado para modal de detalhes do produto
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    }; */

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
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AdminHeader categoryIndex={0} />
            <div style={{ display: "flex", flex: 1}}>
                <AdminSidebar activeIndex={0}/>
                <div style={{ flex: 1, minHeight: 0 }}>
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
                        <SalesGraph />
                    </div>
                </div>
{/* Changes Still to be reviewed
            <div className="content">
                { data && <Reputation
                    percentage={data.sales_percentage}
                    complainings={data.complainings}
                    late_send={data.late_send}
                    new_users={data.new_users}
                /> }
                { data && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                        <ProductCard 
                            product={{
                                nome: data.product_popular.name,
                                preco: data.product_popular.price,
                                imagem: data.product_popular.photo,
                                vendidos: data.product_popular.quantity_sold,
                                estoque: data.product_popular.stock
                            }}
                            onClick={handleProductClick}
                            showBuyButton={false}
                        />
                    </div>
                )}
*/ }
            </div>
            {/*<ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />*/}
            {/*<Footer />*/}
        </div>
    );
};

export default Desempenho;
