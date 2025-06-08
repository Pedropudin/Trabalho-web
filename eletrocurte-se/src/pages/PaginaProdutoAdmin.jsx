import '../styles/PaginaProduto.css';
import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Paper, Stack, TextField, Button, Typography } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

export default function PaginaProdutoAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [produtosLocais, setProdutosLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const localProducts = localStorage.getItem("products");
    if (localProducts) {
      const products = JSON.parse(localProducts);
      setProdutosLocais(products);
      const found = products.find(p => String(p.id) === String(id));
      setEditProduct(found ? { ...found } : null);
      setLoading(false);
    } else {
      fetch('/data/produtos.json')
        .then(res => res.json())
        .then(data => {
          setProdutosLocais(data);
          const found = data.find(p => String(p.id) === String(id));
          setEditProduct(found ? { ...found } : null);
          setLoading(false);
        })
        .catch(() => {
          setProdutosLocais([]);
          setEditProduct(null);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle input changes
  const handleChange = (field, value) => {
    setEditProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle specifications (array of strings)
  const handleSpecChange = (i, value) => {
    const newSpecs = [...(editProduct.specifications || [])];
    newSpecs[i] = value;
    setEditProduct(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  const handleAddSpec = () => {
    setEditProduct(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), ""]
    }));
  };

  const handleRemoveSpec = (i) => {
    const newSpecs = [...(editProduct.specifications || [])];
    newSpecs.splice(i, 1);
    setEditProduct(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  // Save changes
  const handleSave = () => {
    if (!editProduct.name || !editProduct.price) {
      toast.error("Nome e preço são obrigatórios.");
      return;
    }
    const updatedProducts = produtosLocais.map(p =>
      String(p.id) === String(editProduct.id) ? editProduct : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.success("Produto atualizado com sucesso!");
    setTimeout(() => navigate("/PaginaPesquisa"), 1200);
  };

  if (loading) {
    return (
      <>
        <AdminHeader categoryIndex={99} />
        <main className="main-content">
          <h2 style={{ margin: '2rem', textAlign: 'center' }}>Carregando...</h2>
        </main>
        <Footer />
      </>
    );
  }

  if (!editProduct) {
    return (
      <>
        <AdminHeader categoryIndex={99} />
        <main className="main-content">
          <h2 style={{ margin: '2rem', textAlign: 'center' }}>Produto não encontrado.</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="main-content">
        <div className="products">
          <div className="item">
            <div className="item-images" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Paper
                elevation={2}
                sx={{
                  width: 320,
                  height: 320,
                  mb: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 10px 0 rgba(0,0,0,0.08)"
                }}
              >
                <img
                  className="product-image"
                  src={editProduct.img}
                  alt={editProduct.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Paper>
              <Stack direction="row" spacing={2}>
                {(editProduct.thumbs || []).map((thumbUrl, i) => (
                  <Paper
                    key={i}
                    elevation={editProduct.img === thumbUrl ? 3 : 1}
                    sx={{
                      border: editProduct.img === thumbUrl ? '0 solid #1976d2' : '0 solid #eee',
                      borderRadius: 2,
                      p: 0.5,
                      cursor: "pointer",
                      background: editProduct.img === thumbUrl ? "#e3f2fd" : "#fff",
                      boxShadow: "0 0 4px 0 rgba(0,0,0,0.07)"
                    }}
                    onClick={() => setEditProduct(prev => ({ ...prev, img: thumbUrl }))}
                  >
                    <img src={thumbUrl} alt={`Miniatura de ${editProduct.name}`} style={{ width: 56, height: 56, objectFit: "contain" }} />
                  </Paper>
                ))}
              </Stack>
            </div>
            <div className="item-information">
              <TextField
                label="Nome do Produto"
                value={editProduct.name}
                onChange={e => handleChange("name", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Descrição"
                value={editProduct.description}
                onChange={e => handleChange("description", e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
              <TextField
                label="Descrição Completa"
                value={editProduct.fullDescription || ""}
                onChange={e => handleChange("fullDescription", e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={3}
              />
              <TextField
                label="Preço"
                type="number"
                value={editProduct.price}
                onChange={e => handleChange("price", parseFloat(e.target.value) || 0)}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: "0.01" }}
              />
              <TextField
                label="Estoque"
                type="number"
                value={editProduct.inStock}
                onChange={e => handleChange("inStock", parseInt(e.target.value) || 0)}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: "1" }}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Especificações</Typography>
              {(editProduct.specifications || []).map((spec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <TextField
                    value={spec}
                    onChange={e => handleSpecChange(i, e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Button color="error" onClick={() => handleRemoveSpec(i)}>Remover</Button>
                </div>
              ))}
              <Button variant="outlined" onClick={handleAddSpec} sx={{ mt: 1, mb: 2 }}>Adicionar Especificação</Button>
              <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>Salvar</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
              </div>
              <Toaster />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
