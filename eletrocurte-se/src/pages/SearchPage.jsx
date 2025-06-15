import '../styles/SearchPage.css';
import React, { useState, useEffect } from 'react';
import {useParams } from "react-router-dom";
import Header from '../components/Header';
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
    // State variables
    const { name } = useParams();  // Identifies the name from the url  
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [productsLocal, setProductsLocal] = React.useState([]);
    
    // Reads product data directly from database
    useEffect(() => {
        // Busca sempre do backend para garantir consistência
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(res => res.json())
            .then(data => setProductsLocal(data))
            .catch(() => setProductsLocal([])); 
    }, []);

    
    const validProducts = productsLocal.filter(
      p => p && p.name && p.brand && p.price !== undefined && p.inStock !== undefined
    );
    
    const brandsLocal = [
      ...new Set(validProducts.map(p => p.brand?.toLowerCase()))
    ].map(brand => ({
      id: brand,
      label: brand?.charAt(0).toUpperCase() + brand?.slice(1)
    }));

    // Handles product order change
    function handleOrderChange(e) {
        setOrder(e.target.value);
    }
    // Uses useMemo to organize, whenever changed, the new order of our products
    const orderedProducts = React.useMemo(() => {
      const sortedProducts = [...validProducts].sort((a, b) => {
          if (a.inStock > 0  && b.inStock === 0) return -1; 
          if (a.inStock === 0  && b.inStock > 0) return 1; 
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

    const filteredProducts = orderedProducts.filter(product => {
        const matchesName = !name || product.name.toLowerCase().includes(name.toLowerCase());
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand?.toLowerCase());
        const matchesMin = minPrice === '' || product.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax && matchesName;
    });
    
    return(
        <>
            <Header/>
            <div className="main-content">
                <Sidebar
                    items={productsLocal}
                    brands = {brandsLocal}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />
                <div className="results">
                    <div className="results-header-row">
                        <h4>Results for "{!name ? "General" : name}"</h4>
                        <select
                            id="order-criteria"
                            value={order}
                            onChange={handleOrderChange}
                            className="order-criterion"
                        >
                            <option value="alphabetical-asc">Name A-Z</option>
                            <option value="alphabetical-desc">Name Z-A</option>
                            <option value="high-price">Highest Price</option>
                            <option value="low-price">Lowest Price</option>
                        </select>
                    </div>
                    <nav className="product-display">
                        {filteredProducts.length === 0 ? (
                            <p style={{ margin: "40px auto", fontWeight: "bold" }}>No products found.</p>
                        ) : (
                            filteredProducts.map(produtos => (
                                <ProductDisplay key={produtos.id} product={produtos} />
                            ))
                        )}
                    </nav>
                </div>
            </div>
            <ScrollToTop/>
            <Footer/>
        </>    
    );
}