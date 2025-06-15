import React from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import SellList from "../components/Dashboard/SellList";
import Footer from "../components/Footer";

const Sales = () => {
    return(
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AdminHeader categoryIndex={0}/>
            <div style={{display:"flex", flex:"1"}}>
                <AdminSidebar activeIndex={2}/>
                <div className="content" style={{flex:"1", minHeight:"0"}}>
                    <h1 style={{
                        textAlign: "left",
                        color: "#003d52",
                        fontWeight: 700,
                        fontSize: "2rem",
                        marginBottom: "12px",
                        letterSpacing: "1px"
                    }}>
                        Produtos Vendidos
                    </h1>
                    <SellList />
                </div>
            </div>
            <Footer />
        </div>
   );
};

export default Sales;