import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ROUTES from '../routes';
// import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Reputation from "../components/Dashboard/Reputation";
import Card from "../components/Card";
import "../styles/Performance.css"
import "../styles/TextStyles.css"
import AdminSidebar from "../components/admin/AdminSidebar";
import Graph from "../components/Dashboard/Graph";
import Footer from "../components/Footer";

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
            title={"Popularity"}
            description={"Most sold product in the last 30 days"}
            type={"card-horizontal"}
        >
            <div className="popular-container" >
                <img src={photo} alt={name} style={{width: '20%'}} />
                <div className="popular-text">
                    <span className="title-text">{name}</span>
                    <span style={priceStyle} >R$ {price}</span>
                    <span className="description-text">{sold} products sold</span>
                </div>
                <div className="popular-text">
                    <span className="title-text">{stock}</span>
                    <span className="description-text">Products in stock</span>
                </div>
            </div>
        </Card>
    );
};

const SalesGraph = () => {
    return(
        <Card
            title={"Sales"}
            type={"card-horizontal"}
            description="Sales in the last 30 days"
            style={{width: "70%"}}
        >
            <Graph />
        </Card>
    );
};

const Performance = () => {
    const [data, setData] = useState(null);
    const [newUsers, setNewUsers] = useState(0);
    const [salesLast30Days, setSalesLast30Days] = useState(0);
    const [, setSalesLast60Days] = useState(0);

    /* Provisory local data */
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/api/users')
        .then((resp) => {
            return resp.json();
        })
        .then(dash_data => {
            setData(dash_data);

            // Calculate users created in last 30 days
            if (Array.isArray(dash_data)) {
                const now = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                const count = dash_data.filter(user => {
                    const createdAt = new Date(user.createdAt);
                    return createdAt >= thirtyDaysAgo;
                }).length;
                setNewUsers(count);
            }
        });

        // Fetch orders and count sales in last 30 days
        fetch(process.env.REACT_APP_API_URL + '/api/orders',{
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("Token")
            }
        })
        .then(resp => resp.json())
        .then(orderData => {
            if (Array.isArray(orderData)) {
                const now = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                const salesCount = orderData.filter(order => {
                    if (order.status !== "delivered" || !order.updatedAt) return false;
                    const updatedAt = new Date(order.updatedAt);
                    return updatedAt >= thirtyDaysAgo;
                }).length;
                setSalesLast30Days(salesCount);
            }
            if (Array.isArray(orderData)) {
                const now = new Date();
                const sixtyDaysAgo = new Date();
                sixtyDaysAgo.setDate(now.getDate() - 60);
                const salesCount = orderData.filter(order => {
                    if (order.status !== "delivered" || !order.updatedAt) return false;
                    const updatedAt = new Date(order.updatedAt);
                    return updatedAt >= sixtyDaysAgo;
                }).length;
                setSalesLast60Days(salesCount);
            }
        });
    }, []);

    return(
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AdminHeader categoryIndex={0} />
            <div style={{ display: "flex", flex: 1}}>
                <AdminSidebar activeIndex={0}/>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <div className="content">
                        { data && <Reputation
                            // percentage={(salesLast30Days/(salesLast60Days-salesLast30Days) + 1) * 100}
                            percentage={salesLast30Days}
                            // Using total number instead of percentage
                            complainings={data.complainings}
                            late_send={data.late_send}
                            new_users={newUsers}
                        /> }        
                        { data && data.product_popular && <PopularProduct
                            name={data.product_popular.name}
                            photo={data.product_popular.photo}
                            price={data.product_popular.price}
                            sold={data.product_popular.quantity_sold}
                            stock={data.product_popular.stock}
                        /> }
                        <SalesGraph />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Performance;
