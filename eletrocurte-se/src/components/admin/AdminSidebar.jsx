import React, { use, useState } from "react";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from "@mui/material";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const SidebarElement = ({ collapsed, activeIndex, elementsList, onClickList, style }) => {

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
                {
                    elementsList.map((value,index) => {
                        if(index == activeIndex){
                            return <MenuItem key={index} active>{value}</MenuItem>
                        } else {
                            return <MenuItem key={index} onClick={onClickList[index]}>{value}</MenuItem>
                        }
                    })
                }
            </Menu>
        </Sidebar>
    );
};

const AdminSidebar = ({ activeIndex=0, onClickList }) => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const elements = ["Dashboard", "Empregados", "Vendas", "Estoque"];
    const elementsFunctions = [
        () => navigate(ROUTES.DESEMPENHO),
        () => navigate(ROUTES.TIME),
        () => navigate(ROUTES.VENDAS),
        () => console.log("C")
    ]
    let s;

    if(!showSidebar) {
        s = { display: "flex", flexDirection: "column", marginBottom: '-40px', backgroundColor:"white"};
    } else {
        s = { display: "flex", flexDirection: "column"}
    }

    return(
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
                <SidebarElement 
                    collapsed={showSidebar}
                    activeIndex={activeIndex}
                    elementsList={elements}
                    onClickList={elementsFunctions}
                />
            </div>
        </div>
    );
};

export default AdminSidebar;