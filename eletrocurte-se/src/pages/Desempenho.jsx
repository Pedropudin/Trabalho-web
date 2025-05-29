import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Reputation from "../components/Dashboard/Reputation";
import Card from "../components/Card";
import "../styles/Desempenho.css"
import "../styles/TextStyles.css"
import { IconButton } from "@mui/material";

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

const AdminSidebar = ({ collapsed, style }) => {
    return(
        <Sidebar
            collapsed={collapsed}
            collapsedWidth="0px"
            width="fit-content"
            backgroundColor="white"
            transitionDuration={1000}
            rootStyles={{
                border: "none"
            }}
        >
            <Menu menuItemStyles={{
                button: ({level, active, disabled}) => {
                    if(active)
                        return {
                            fontSize: "20px",
                            fontWeight: "bold",
                            borderRadius: "10px"
                        };
                    else   
                        return {
                            fontSize: "18px",
                            borderRadius: "10px"
                        }
                }
            }}>
                <MenuItem active>Dashboard</MenuItem>
                <MenuItem>Empregados</MenuItem>
                <MenuItem>Vendas</MenuItem>
                <MenuItem>Estoque</MenuItem>
            </Menu>
        </Sidebar>
    );
};

const Desempenho = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    let s;

    if(!showSidebar) {
        s = { display: "flex", flexDirection: "column", marginBottom: '-40px', backgroundColor:"white"};
    } else {
        s = { display: "flex", flexDirection: "column"}
    }

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
                <div style={s}>
                    <IconButton
                        onClick={() => setShowSidebar(!showSidebar)}
                        style={{
                            backgroundColor: "#003d52",
                            color: "#fff",
                            margin: "8px",
                            borderRadius: "30px"
                        }}
                    >
                        <MenuIcon fontSize="large"/>
                    </IconButton>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <AdminSidebar style={{height: "100%"}} collapsed={showSidebar}/>
                    </div>
                </div>
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
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Desempenho;
