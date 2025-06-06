import '../styles/ProductCard.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

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
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tem certeza que deseja excluir este produto?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleDelete} color="error">
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default function ProductCard({product}) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        setOpen(false);
        console.log("Produto excluído:", product.id);
    };

    return (
        <div className={`items${product.inStock > 0 ? '' : ' unavailable'}`}>
            <img
                className="item-image"
                src={product.img}
                alt={"Imagem do " + product.name}
                style={!product.inStock > 0 ? { filter: "grayscale(100%)" } : {}}
            />
            <p className="item-name">{product.name}</p><br />
            <p className="item-price">
                {product.inStock > 0 ? "R$" + product.price.toFixed(2) : "Produto indisponível."}
            </p>
            {localStorage.userType === "admin" && <p className="item-stock">
                Em estoque: <span style={{fontWeight:"bold"}}>{product.inStock}</span>
            </p>}
            {localStorage.userType !== "admin" ? (product.inStock > 0 ? (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/PaginaProduto/${product.id}`)}
                >
                    Comprar
                </button>
            ) : (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/PaginaProduto/${product.id}`)}
                >
                    Ver produto
                </button>
            )) : (
                <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                    <button
                        className="product-display-edit-button"
                        onClick={() => console.log("AAAAAAAAA")} 
                    >
                        Editar
                    </button>
                    <button
                        className="product-display-delete-button"
                        onClick={() => setOpen(true)}
                    >
                        Excluir
                    </button>
                    <ConfirmationWindow open={open} onClose={() => setOpen(false)} handleDelete={handleDelete} />
                </div>
            )}
        </div>
    );
}