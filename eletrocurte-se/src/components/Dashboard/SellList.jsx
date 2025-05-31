import React, { useState, useEffect } from "react";
import Button from "../Button";
import Card from "../Card";

const SellList = () => {
    const [data, setData] = useState(null);

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
        alert(`Informação fiscal: ${product.fiscal_info}`);
    };

    return (
        <div style={{
            width: "95%",
            maxWidth: "1100px",
            margin: "32px auto",
        }}>
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
                                <th style={{ width: 120, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Foto</th>
                                <th style={{ width: 320, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "left" }}>Nome</th>
                                <th style={{ width: 180, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Preço</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99", textAlign: "center" }}>Data da Venda</th>
                                <th style={{ width: 140, padding: "12px 8px", borderBottom: "2px solid #007b99" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map(product => (
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
                                        {product.date}
                                    </td>
                                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                        <Button
                                            type={1}
                                            text="Nota Fiscal"
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
                    {!data && (
                        <div style={{ textAlign: "center", color: "#888", margin: "40px 0" }}>
                            Carregando produtos vendidos...
                        </div>
                    )}
                    {data && data.length === 0 && (
                        <div style={{ textAlign: "center", color: "#888", margin: "40px 0" }}>
                            Nenhum produto vendido neste período.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SellList;