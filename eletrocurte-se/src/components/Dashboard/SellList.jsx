import React, { useState, useEffect } from "react";
import Button from "../Button";
import Card from "../Card";
import DateSelector from "./DateSelector";
import MessageAlert from "../MessageAlert";

const today = new Date().toJSON().slice(0,10);

const SellList = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [showAlert, setShowAlert] = useState(false);

    // Fetch orders and products from the API on component mount
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/api/orders', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("Token")
            }
        })
            .then(resp => resp.json())
            .then(orderData => setOrders(orderData || []));
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(resp => resp.json())
            .then(prodData => setProducts(prodData || []));
    }, []);

    // Returns product details for a given product id
    function getProductInfo(id) {
        return products.find(p => String(p.id) === String(id));
    }

    // Updates the status of an order and updates local state
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await fetch(process.env.REACT_APP_API_URL + `/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("Token")
                },
                body: JSON.stringify({ status: newStatus })
            });
            setOrders(orders =>
                orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    // Build a flat list of products from orders with relevant status
    const deliveredProducts = [];
    orders.forEach(order => {
        // Only include orders with status delivered, pending, or in transit
        if (
            (order.status === "delivered" ||
            order.status === "pending" ||
            order.status === "in transit") &&
            Array.isArray(order.itens)
        ) {
            order.itens.forEach(item => {
                const prod = getProductInfo(item.id);
                if (prod) {
                    deliveredProducts.push({
                        id: prod.id,
                        name: prod.name,
                        image: prod.image,
                        price: prod.price,
                        date: order.updatedAt ? order.updatedAt.slice(0,10) : "",
                        quantity: item.quantity,
                        status: order.status,
                        orderId: order._id
                    });
                }
            });
        }
    });

    // Filter products by selected date range
    const filteredProducts = deliveredProducts.filter(product =>
        startDate <= product.date && product.date <= endDate
    );

    // Map each unique orderId to a sequential number for display
    const orderIdToNumber = {};
    let orderCounter = 1;
    deliveredProducts.forEach(product => {
        if (!(product.orderId in orderIdToNumber)) {
            orderIdToNumber[product.orderId] = orderCounter++;
        }
    });

    // Displays invoice information for a product
    const handleFiscalInfo = (product) => {
        alert(`Fiscal Information: ${product.name}`);
    };

    // Converts date from YYYY-MM-DD to DD/MM/YYYY
    const convertDate = (date) => {
        return `${date.slice(8,10)}/${date.slice(5,7)}/${date.slice(0,4)}`
    }

    // Handles date selection and validation
    const handleDate = (start, end) => {
        if(start > end) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return
        }
        setStartDate(start);
        setEndDate(end);
        return
    };

    return (
        <div style={{
            width: "95%",
            maxWidth: "1100px",
            margin: "32px auto",
        }}>
            {showAlert && <MessageAlert message={"The end date cannot be earlier than the start date"} />}
            <DateSelector startDate={startDate} endDate={endDate} maxDate={today} onChange={(start,end) => handleDate(start,end)} />
            <Card type="card-vertical" style={{ padding: 0 }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        minWidth: 700,
                        background: "#f8fafd"
                    }}>
                        <thead>
                            <tr>
                                <th style={{ width: 120, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Picture</th>
                                <th style={{ width: 320, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "left" }}>Name</th>
                                <th style={{ width: 100, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Order</th>
                                <th style={{ width: 180, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Price</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Day of sale</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Status</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id + product.date + product.orderId} style={{ borderRadius: 12 }}>
                                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                objectFit: "cover",
                                                borderRadius: 10,
                                                border: "2px solid #C7F7CE",
                                                background: "#fff"
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: "12px 8px", fontWeight: 600, color: "#193E52", fontSize: "1.1rem" }}>
                                        {product.name}
                                    </td>
                                    <td style={{ padding: "12px 8px", textAlign: "center", fontWeight: 500 }}>
                                        {orderIdToNumber[product.orderId]}
                                    </td>
                                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                        <span style={{
                                            backgroundColor: "#C7F7CE",
                                            borderRadius: "10px",
                                            padding: "8px 18px",
                                            fontWeight: 600,
                                            fontSize: "1.1rem",
                                            color: "#1a4d2e",
                                            minWidth: "90px",
                                            display: "inline-block"
                                        }}>
                                            R$ {Number(product.price).toFixed(2)}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 8px", textAlign: "center", color: "#666" }}>
                                        {convertDate(product.date)}
                                    </td>
                                    <td>
                                        <select
                                            value={product.status}
                                            onChange={e => handleStatusChange(product.orderId, e.target.value)}
                                            style={{
                                                padding: "6px 10px",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                fontWeight: 600,
                                                color: "#193E52",
                                                background: "#f8fafd"
                                            }}
                                        >
                                            <option value="pending">pending</option>
                                            <option value="in transit">in transit</option>
                                            <option value="delivered">delivered</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                        <Button
                                            type={1}
                                            text="Invoice"
                                            onClick={() => handleFiscalInfo(product)}
                                            style={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                width: "110px"
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div style={{textAlign:"center", color:"#888", fontSize:"20px", margin:"40px 0px"}}>
                            No product was sold in the specified period.
                        </div>
                    )}
                    {orders.length === 0 && (
                        <div style={{ textAlign: "center", color: "#888", margin: "40px 0" }}>
                            Loading sold products...
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SellList;