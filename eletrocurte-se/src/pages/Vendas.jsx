import React from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import Footer from "../components/Footer";

const Vendas = () => {
    return(
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AdminHeader categoryIndex={0}/>
            <div style={{display:"flex", flex:"1"}}>
                <AdminSidebar activeIndex={2}/>
                <div className="content" style={{flex:"1", minHeight:"0"}}>
                    <h1>Vendas</h1>
                </div>
            </div>
            <Footer />
        </div>
   );
};

export default Vendas;