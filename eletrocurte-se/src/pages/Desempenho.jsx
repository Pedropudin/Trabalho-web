import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Reputation from "../components/Dashboard/Reputation";
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import "../styles/Dashboard.css"
import "../styles/TextStyles.css"

const Desempenho = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
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
    };

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
                        />
                    </div>
                )}
            </div>
            <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
            <Footer />
        </div>
    );
};

export default Desempenho;
