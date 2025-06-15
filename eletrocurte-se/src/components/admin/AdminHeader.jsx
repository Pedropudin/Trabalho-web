import React, { useEffect } from "react";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AdminHeader = ({ categoryIndex }) => {
    const navigate = useNavigate();
    const categories = ["Desempenho", "Pendências", "Hardware", "Periféricos", "Computadores", "Celulares"];

    // Protege rotas de admin: se não está logado como admin, redireciona para home
    useEffect(() => {
        if (localStorage.getItem('userType') !== 'admin' || localStorage.getItem('isLoggedIn') !== 'true') {
            navigate(ROUTES.HOME_PAGE, { replace: true });
        }
    }, [navigate]);

    function categoryNavigation(category) {
        switch (category) {
            case categories[0]:
                navigate(ROUTES.DESEMPENHO);
                break;
            case categories[1]:
                navigate(ROUTES.PENDENCIAS);
                break;
            default:
                navigate(ROUTES.PAG_SETOR.replace(":name", category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                break;
        }
        return;
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(ROUTES.LOGOUT, { replace: true });
    }

    return(
        <Header 
            categories={categories}
            selectedCategoryIndex={categoryIndex}
            useElementsMenu={[true, false, true]}
            adminContext={true}
            onCategoryClick={categoryNavigation}
            onLogoClick={() => navigate(ROUTES.DESEMPENHO)}
            onProfile={() => navigate(ROUTES.TIME)}
            onLogout={handleLogout}
        />
    );
};

export default AdminHeader;