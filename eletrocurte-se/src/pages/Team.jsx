import React from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import TeamManager from "../components/Dashboard/TeamManager";
import Footer from "../components/Footer";
import "../styles/Team.css";

const Team = () => {
    return(
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AdminHeader categoryIndex={0}/>
            <div style={{display:"flex", flex:"1"}}>
                <AdminSidebar activeIndex={1}/>
                <div className="content" style={{flex:"1", minHeight:"0"}}>
                    <h1>Team Management</h1>
                    <TeamManager />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Team;