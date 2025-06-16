import React, { useState, useEffect } from "react";
import Button from "../Button";
import Card from "../Card";
import DateSelector from "./DateSelector";
import MessageAlert from "../MessageAlert";

const today = new Date().toJSON().slice(0,10);
//const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

const SellList = () => {
    const [data, setData] = useState(null);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        fetch('/data/soldProducts.json')
        .then((resp) => {
            return resp.json();
        })
        .then(prod_data => {
            setData(prod_data.soldProducts);
        })
    }, []);

    const handleFiscalInfo = (product) => {
        alert(`Fiscal Information: ${product.fiscal_info}`);
    };

    const convertDate = (date) => {
        return `${date.slice(8,10)}/${date.slice(5,7)}/${date.slice(0,4)}`
    }

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

    const filteredProducts = data
        ? data.filter(product => startDate <= product.date && product.date <= endDate)
        : [];

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
                                <th style={{ width: 180, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Price</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Day of sale</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && filteredProducts.map(product => {
                                if(startDate <= product.date && product.date <= endDate) {
                                    return(
                                        <tr key={product.id} style={{ borderRadius: 12 }}>
                                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                                <img
                                                    src={product.product_photo}
                                                    alt={product.product_name}
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
                                                {product.product_name}
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
                                    )
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                    {data && filteredProducts.length === 0 && (
                        <div style={{textAlign:"center", color:"#888", fontSize:"20px", margin:"40px 0px"}}>
                            No product was sold in the specified period.
                        </div>
                    )}
                    {!data && (
                        <div style={{ textAlign: "center", color: "#888", margin: "40px 0" }}>
                            Loading sold products...
                        </div>
                    )}
                    {data && data.length === 0 && (
                        <div style={{ textAlign: "center", color: "#888", margin: "40px 0" }}>
                            No product sold in this period.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SellList;