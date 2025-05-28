import React from "react";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AdminHeader = ({ categoryIndex }) => {
    const navigate = useNavigate();
    const categories = ["Desempenho", "Produtos", "Pendências"];

    function categoryNavigation(category) {
        switch (category) {
            case categories[0]:
                navigate(ROUTES.DESEMPENHO);
                break;
            case categories[1]:
                console.log("Ainda não"); 
                break;
            case categories[2]:
                navigate(ROUTES.PENDENCIAS);
                break;
            default:
                console.warn("Invalid category");
        }
        return;
    };

    return(
        <Header 
            categories={categories}
            selectedCategoryIndex={categoryIndex}
            useElementsMenu={[true, false, true]}
            onCategoryClick={categoryNavigation}
        />
    );
};

export default AdminHeader;