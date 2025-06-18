import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";
import "../styles/SectorPage.css";

// Components
import AdminHeader from "../components/admin/AdminHeader";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from "../components/Sidebar";
import ScrollToTop from "../components/ScrollToTop";
import ProductDisplay from "../components/ProductDisplay";

/*
  Eletrocurte-se sector page.
  - Displays all products separated by sector when accessed as "/PaginaSetor"
  - Displays all products belonging to a general category, such as Hardware or Peripherals.
  - To reach this page, you need to change the URL '/PaginaSetor/SectorName' or just interact with the buttons and clickable elements of the interface.
  - Has brand and price filter functionalities, as well as ascending/descending sorting by A-Z and price.
*/

export default function SectorPage() {
    // --- Hooks & State ---
    const { name } = useParams();
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [productsLocal, setProductsLocal] = useState([]);

    // --- Fetch from database ---
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(res => res.json())
            .then(data => setProductsLocal(data))
            .catch(() => setProductsLocal([]));
    }, []);

    // --- Utils ---
    const normalize = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // --- Derived Data ---
    const validProducts = useMemo(() =>
        productsLocal.filter(
            p => p && p.name && p.brand && p.price !== undefined && p.inStock !== undefined
        ), [productsLocal]
    );
    const sectorProducts = useMemo(() =>
        name
            ? validProducts.filter((p) => normalize(p.generalSector) === normalize(name))
            : validProducts
    , [validProducts, name]);
    const brandsLocal = useMemo(() =>
        [
            ...new Set(sectorProducts.map(p => p.brand?.toLowerCase()))
        ].map(brand => ({
            id: brand,
            label: brand?.charAt(0).toUpperCase() + brand?.slice(1)
        })), [sectorProducts]);

    // --- Product Ordering ---
    const orderedProducts = useMemo(() => {
        const products = [...sectorProducts];
        products.sort((a, b) => {
            if (a.inStock > 0 && b.inStock === 0) return -1;
            if (a.inStock === 0 && b.inStock > 0) return 1;
            if (order === "alphabetical-asc") {
                return a.name.localeCompare(b.name);
            } else if (order === "alphabetical-desc") {
                return b.name.localeCompare(a.name);
            } else if (order === "low-price") {
                return a.price - b.price;
            } else if (order === "high-price") {
                return b.price - a.price;
            }
            return 0;
        });
        return products;
    }, [order, sectorProducts]);

    // --- Filtering ---
    const filteredProducts = useMemo(() =>
        orderedProducts.filter(product => {
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand?.toLowerCase());
            const matchesMin = minPrice === '' || product.price >= Number(minPrice);
            const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
            return matchesBrand && matchesMin && matchesMax;
        })
    , [orderedProducts, selectedBrands, minPrice, maxPrice]);

    const specificSectors = useMemo(() =>
        Array.from(new Set(filteredProducts.map((p) => p.specificSector)))
    , [filteredProducts]);

    // --- Handlers ---
    function handleOrderChange(e) {
        setOrder(e.target.value);
    }

    // --- Render ---
    return (
        <>
            {localStorage.userType === "admin"
                ? <AdminHeader categoryIndex={99} />
                : <Header />
            }
            <div className="sector-main-content">
                <div className="sector-sidebar">
                    <Sidebar
                        items={orderedProducts}
                        brands={brandsLocal}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                    />
                </div>
                <div className="sector-results">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="sector-results-header-row">
                                <h4>Results for "{!name ? "General" : name}"</h4>
                                <select
                                    id="order-criteria"
                                    value={order}
                                    onChange={handleOrderChange}
                                    className="sector-order-criterion"
                                >
                                    <option value="alphabetical-asc">Name A-Z</option>
                                    <option value="alphabetical-desc">Name Z-A</option>
                                    <option value="high-price">Highest Price</option>
                                    <option value="low-price">Lowest Price</option>
                                </select>
                            </div>
                                {specificSectors.length > 0 ? (
                                    specificSectors.map((sector) => {
                                        const productsSector = filteredProducts.filter((p) => p.specificSector === sector);

                                        if (productsSector.length === 0) return null;
                                        return (
                                            <div key={sector} className="sector-display-all">
                                                <h2 className="sector-name">{sector}</h2>
                                                <div className="sector-products-row">
                                                    <div className="vertical-line"></div>
                                                    <div className="sector-product-display">
                                                        {productsSector.map(product => (
                                                            <ProductDisplay key={product.id} product={product} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                        })
                                    ) : (
                                        <div className="sector-display-all">
                                            <p className="sector-no-products-message">No products found.</p>
                                        </div>
                                ) }
                        </>
                    ) : (
                        <div className="sector-display-all">
                            <p className="sector-no-products-message">No products found.</p>
                        </div>
                    )}
                </div>
            </div>
            <ScrollToTop />
            <Footer />
        </>
    );
}