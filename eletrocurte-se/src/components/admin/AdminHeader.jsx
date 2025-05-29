import React, { useEffect } from "react";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AdminHeader = ({ categoryIndex }) => {
    const navigate = useNavigate();
    const categories = ["Desempenho", "Produtos", "Pendências"];

    // Protege rotas de admin: se não está logado como admin, redireciona para home
    useEffect(() => {
        if (localStorage.getItem('userType') !== 'admin' || localStorage.getItem('isLoggedIn') !== 'true') {
            navigate(ROUTES.PAGINA_INICIAL, { replace: true });
        }
    }, [navigate]);

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

    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        // Protege o histórico e impede voltar para logout
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(ROUTES.LOGOUT, { replace: true });
    }

    return(
        <Header 
            categories={categories}
            selectedCategoryIndex={categoryIndex}
            useElementsMenu={[true, false, true]}
            onCategoryClick={categoryNavigation}
            onLogout={handleLogout}
        />
    );
};

export default AdminHeader;