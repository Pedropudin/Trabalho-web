import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";
import '../styles/SearchPage.css';

// Components
import Header from '../components/Header';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import ProductDisplay from '../components/ProductDisplay';

/*
  Eletrocurte-se search page.
  - Displays all products in random order when accessed as "/SearchPage"
  - Displays products that contain what was placed in the URL or searched through the search bar.
  - Has brand and price filter functionalities, as well as ascending/descending sorting by A-Z and price.
*/

export default function SearchPage() {
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

    // --- Derived Data ---
    const validProducts = useMemo(() =>
        productsLocal.filter(
            p => p && p.name && p.brand && p.price !== undefined && p.inStock !== undefined
        ), [productsLocal]
    );

    // --- Handlers ---
    function handleOrderChange(e) {
        setOrder(e.target.value);
    }

    // --- Product Ordering ---
    const orderedProducts = useMemo(() => {
        const sortedProducts = [...validProducts].sort((a, b) => {
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
        return sortedProducts;
    }, [order, validProducts]);

    // --- Filtering ---
    const filteredProducts = useMemo(() =>
        orderedProducts.filter(product => {
            const matchesName = !name || product.name.toLowerCase().includes(name.toLowerCase());
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand?.toLowerCase());
            const matchesMin = minPrice === '' || product.price >= Number(minPrice);
            const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
            return matchesBrand && matchesMin && matchesMax && matchesName;
        }), [orderedProducts, name, selectedBrands, minPrice, maxPrice]
    );

    const brandsLocal = useMemo(() =>
        [
            ...new Set(filteredProducts.map(p => p.brand?.toLowerCase()))
        ].map(brand => ({
            id: brand,
            label: brand?.charAt(0).toUpperCase() + brand?.slice(1)
        })), [filteredProducts]
    );
    // --- Render ---
    return (
        <>
            {localStorage.userType === "admin"
                ? <AdminHeader categoryIndex={99} />
                : <Header />
            }
            <div className="search-main-content">
                <div className="search-sidebar">
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
                <div className="search-results">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="search-results-header-row">
                                <h4>Results for "{!name ? "General" : name}"</h4>
                                <select
                                    id="order-criteria"
                                    value={order}
                                    onChange={handleOrderChange}
                                    className="search-order-criterion"
                                >
                                    <option value="alphabetical-asc">Name A-Z</option>
                                    <option value="alphabetical-desc">Name Z-A</option>
                                    <option value="high-price">Highest Price</option>
                                    <option value="low-price">Lowest Price</option>
                                </select>
                            </div>
                            <div className="search-product-display">
                                {filteredProducts.map(produtos => (
                                    <ProductDisplay key={produtos.id} product={produtos} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="search-product-display">
                            <p className="search-no-products-message">No products found.</p>
                        </div>
                    )}
                </div>
            </div>
            <ScrollToTop />
            <Footer />
        </>
    );
}