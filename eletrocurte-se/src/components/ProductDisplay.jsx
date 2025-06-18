import '../styles/ProductDisplay.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
import Button from '../components/Button';

/*
  Card dos produtos
  - Exibida na tela de Pesquisa e Setor.
  - Contém foto, nome, preço e botão de compra para um produto. 
*/

function ConfirmationWindow({ open, onClose, handleDelete }) {
    return(
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this product?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} text='Cancel' style={{fontWeight: "bold"}}/>
                <Button onClick={handleDelete} text='Delete' style={{backgroundColor: "#990000", fontWeight: "bold"}}/>
            </DialogActions>
        </Dialog>
    );
};

export default function ProductDisplay({product}) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        setOpen(false);
        // TODO: Implement actual delete logic (API/localStorage update)
        console.log("Product deleted:", product.id);
    };

    return (
        <div className={`items${product.inStock > 0 ? '' : ' unavailable'}`}>
            <img
                className="product-item-image"
                src={product.image}
                alt={"Image of " + product.name}
                style={product.inStock > 0 ? {} : { filter: "grayscale(100%)" }}
            />
            <p className="product-item-name">{product.name}</p><br />
            <p className="product-item-price">
                {product.inStock > 0 ? "R$" + Number(product.price).toFixed(2) : "Product unavailable."}
            </p>
            {localStorage.userType === "admin" && <p className="item-stock">
                In stock: <span style={{fontWeight:"bold"}}>{product.inStock}</span>
            </p>}
            {localStorage.userType !== "admin" ? (product.inStock > 0 ? (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/ProductPage/${product.id}`)}
                >
                    Buy
                </button>
            ) : (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/ProductPage/${product.id}`)}
                >
                    View product
                </button>
            )) : (
                <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                    <button
                        className="product-display-edit-button"
                        onClick={() => navigate(`/admin/PaginaProduto/${product.id}`)} 
                    >
                        Edit
                    </button>
                    <button
                        className="product-display-delete-button"
                        onClick={() => setOpen(true)}
                    >
                        Delete
                    </button>
                    <ConfirmationWindow open={open} onClose={() => setOpen(false)} handleDelete={handleDelete} />
                </div>
            )}
        </div>
    );
}
