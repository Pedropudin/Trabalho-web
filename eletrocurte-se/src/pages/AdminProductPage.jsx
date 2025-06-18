import '../styles/ProductPage.css';
import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Paper, Stack, TextField, Button, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, { Toaster } from 'react-hot-toast';
import "../styles/AdminProductPage.css";

export default function AdminProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    // Fetch product directly from backend by id
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + '/api/products')
      .then(res => res.json())
      .then(products => {
        const found = products.find(p => String(p.id) === String(id) || String(p._id) === String(id));
        setEditProduct(found ? { ...found } : null);
        setLoading(false);
        console.log(found);
      })
      .catch(() => {
        setEditProduct(null);
        setLoading(false);
      });
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
      toast.error("Name and price are required.");
      return;
    }
    const adminToken = localStorage.getItem('Token');
    // Prefer MongoDB _id if present, fallback to numeric id
    const productId = editProduct._id || editProduct.id;
    console.log(editProduct);
    fetch(process.env.REACT_APP_API_URL + `/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminToken
      },
      body: JSON.stringify(editProduct)
    })
      .then(res => {
        if (res.ok) {
          window.location.reload();
        } else {
          toast.error("Failed to update product.");
        }
      })
      .catch(() => {
        toast.error("Failed to update product.");
      });
  };

  // Image upload handler: prompt for URL and add to thumbs or set as main image if none
  const handleUploadImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && url.trim()) {
      setEditProduct(prev => {
        const cleanUrl = url.trim();
        // If no main image, set this as main image
        if (!prev.image) {
          return {
            ...prev,
            image: cleanUrl,
            thumbs: [...(prev.thumbs || [])]
          };
        }
        // If already in thumbs or as main image, do nothing
        if (prev.image === cleanUrl || (prev.thumbs || []).includes(cleanUrl)) {
          return prev;
        }
        return {
          ...prev,
          thumbs: [...(prev.thumbs || []), cleanUrl]
        };
      });
    }
  };

  // Image delete handler: remove from thumbs or main image, update accordingly
  const handleRemoveImage = (url) => {
    setEditProduct(prev => {
      // If deleting main image
      if (prev.image === url) {
        const newThumbs = [...(prev.thumbs || [])];
        // Promote first thumb to main image if available
        const newImage = newThumbs.length > 0 ? newThumbs[0] : "";
        return {
          ...prev,
          image: newImage,
          thumbs: newThumbs.filter(t => t !== newImage)
        };
      }
      // If deleting from thumbs
      return {
        ...prev,
        thumbs: (prev.thumbs || []).filter(t => t !== url)
      };
    });
  };

  if (loading) {
    return (
      <>
        <AdminHeader categoryIndex={99} />
        <main className="main-content">
          <h2 style={{ margin: '2rem', textAlign: 'center' }}>Loading...</h2>
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
          <h2 style={{ margin: '2rem', textAlign: 'center' }}>Product not found.</h2>
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
              <Button onClick={handleUploadImage} style={{
                gap: "10px"
              }}>
                Add image
                <UploadIcon />
              </Button>
              <Paper
                elevation={2}
                sx={{
                  width: 320,
                  height: 320,
                  mb: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 10px 0 rgba(0,0,0,0.08)",
                  position: "relative"
                }}
              >
                <img
                  className="product-image"
                  src={editProduct.image}
                  alt={editProduct.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
                {/* Remove main image if it exists */}
                {editProduct.image && (
                  <Button onClick={e => {
                    e.stopPropagation();
                    handleRemoveImage(editProduct.image);
                  }} style={{
                    position:"absolute",
                    right:"0", top:"0",
                    backgroundColor: "rgb(228, 0, 0)",
                    width: "fit-content"
                  }}>
                    <DeleteIcon />
                  </Button>
                )}
              </Paper>
              <Stack direction="row" spacing={2}>
                {(editProduct.thumbs || []).map((thumbUrl, i) => (
                  <Paper
                    key={i}
                    elevation={editProduct.image === thumbUrl ? 3 : 1}
                    sx={{
                      border: editProduct.image === thumbUrl ? '0 solid #1976d2' : '0 solid #eee',
                      borderRadius: 2,
                      p: 0.5,
                      cursor: "pointer",
                      background: editProduct.image === thumbUrl ? "#e3f2fd" : "#fff",
                      boxShadow: "0 0 4px 0 rgba(0,0,0,0.07)",
                      position: "relative"
                    }}
                    onClick={() => {
                      setEditProduct(prev => {
                        // Move selected thumb to main image, demote current main image to thumbs
                        if (prev.image === thumbUrl) return prev;
                        const newThumbs = [prev.image, ...(prev.thumbs || []).filter(t => t !== thumbUrl)];
                        return {
                          ...prev,
                          image: thumbUrl,
                          thumbs: newThumbs.filter(Boolean)
                        };
                      });
                    }}
                  >
                    <img src={thumbUrl} alt={`Thumbnail of ${editProduct.name}`} style={{ width: 56, height: 56, objectFit: "contain" }} />
                  </Paper>
                ))}
              </Stack>
            </div>
            <div className="item-information">
              <TextField
                label="Product Name"
                value={editProduct.name}
                onChange={e => handleChange("name", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={editProduct.description}
                onChange={e => handleChange("description", e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
              <TextField
                label="Full Description"
                value={editProduct.fullDescription || ""}
                onChange={e => handleChange("fullDescription", e.target.value)}
                fullWidth
                margin="normal"
                multiline
                minRows={3}
              />
              <TextField
                label="Price"
                type="number"
                value={editProduct.price}
                onChange={e => handleChange("price", parseFloat(e.target.value) || 0)}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: "0.01" }}
              />
              <TextField
                label="Stock"
                type="number"
                value={editProduct.inStock}
                onChange={e => handleChange("inStock", parseInt(e.target.value) || 0)}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: "1" }}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Specifications</Typography>
              {(editProduct.specifications || []).map((spec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <TextField
                    value={spec}
                    onChange={e => handleSpecChange(i, e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Button color="error" onClick={() => handleRemoveSpec(i)}>Remove</Button>
                </div>
              ))}
              <Button variant="outlined" onClick={handleAddSpec} sx={{ mt: 1, mb: 2 }}>Add Specification</Button>
              <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "space-evenly" }}>
                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
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
