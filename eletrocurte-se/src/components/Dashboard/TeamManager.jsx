import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Card from "../Card";

const TeamManager = () => {
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editValues, setEditValues] = useState({ name: "", role: "", email: "" });

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + "/api/users/admins")
        .then((resp) => {
            return resp.json();
        })
        .then(emp_data => {
            setData(emp_data.employees);
        })
    }, []);

    const handleAdd = () => {
        setSelectedEmp(null)
        setEditValues({ name: "", role: "", email:"" });
        setIsAdding(true);
        setOpen(true);
    }

    const handleEdit = (emp) => {
        setSelectedEmp(emp);
        setEditValues({ name: emp.name, role: emp.role, email: emp.email });
        setIsAdding(false);
        setOpen(true);
    };

    const handleRemove = async (emp) => {
        // Try to remove from backend
        try {
            const response = await fetch(
                process.env.REACT_APP_API_URL + '/api/users/admin/' + emp._id,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("Token")
                    }
                }
            );
            if (response.ok) {
                setData(data.filter(e => e._id !== emp._id));
            } else {
                alert("Failed to remove admin.");
            }
        } catch (err) {
            alert("Error removing admin.");
        }
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedEmp(null);
    };

    const handleChange = (e) => {
        setEditValues({ ...editValues, [e.target.name]: e.target.value });
    };

    // Validation regexes (copied from Login.jsx)
    const nameRegex = /^.{3,}$/;
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const adminDomainRegex = /^[a-zA-Z0-9._-]+@eletrocurte-se(\.[a-zA-Z]{2,6})?$/;

    // DNS validation for email domain (async)
    async function validateEmailGoogle(email) {
        const domain = email.split('@')[1];
        if (!domain) return false;
        try {
            const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
            const data = await res.json();
            return Array.isArray(data.Answer) && data.Answer.length > 0;
        } catch {
            return false;
        }
    }

    // Validation function for admin fields
    async function validateAdminFields({ name, email, password, token }) {
        if (!adminDomainRegex.test(email) && !emailRegex.test(email)) {
            alert("Please enter a valid email. Admins can use @eletrocurte-se domain.");
            return false;
        }
        if (!adminDomainRegex.test(email)) {
            const validEmail = await validateEmailGoogle(email);
            if (!validEmail) {
                alert("The email domain does not exist or does not accept emails.");
                return false;
            }
        }
        if (!nameRegex.test(name)) {
            alert("Admin name must have at least 3 characters.");
            return false;
        }
        if (password !== undefined && password !== "") {
            if (!strongPassword.test(password)) {
                alert("Password must be at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.");
                return false;
            }
        }
        if (token !== undefined && token !== "") {
            if (!/^\d{6}$/.test(token)) {
                alert("Token must contain exactly 6 numeric digits.");
                return false;
            }
        }
        return true;
    }

    const handleSave = async () => {
        // Validate fields before saving
        const valid = await validateAdminFields(editValues);
        if (!valid) return;

        if (isAdding) {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/api/users/create-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("Token")
                    },
                    body: JSON.stringify(editValues)
                });
                if (response.ok) {
                    const newAdmin = await response.json();
                    setData([
                        ...(data || []),
                        // Use backend response if it returns the new admin, otherwise fallback to editValues
                        newAdmin.employee || { ...editValues, id: newAdmin.id || (data && data.length > 0 ? Math.max(...data.map(emp => emp.id || 0)) + 1 : 1) }
                    ]);
                } else {
                    alert("Failed to add admin. Try using a diferent token");
                    return;
                }
            } catch (err) {
                alert("Error adding admin.");
            }
        } else {
            // Update admin info in backend
            try {
                const response = await fetch(
                    process.env.REACT_APP_API_URL + '/api/users/admin/' + selectedEmp._id,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem("Token")
                        },
                        body: JSON.stringify(editValues)
                    }
                );
                if (response.ok) {
                    const updatedAdmin = await response.json();
                    setData(data.map(emp =>
                        emp._id === selectedEmp._id ? updatedAdmin : emp
                    ));
                } else {
                    alert("Failed to update admin.");
                    return;
                }
            } catch (err) {
                alert("Error updating admin.");
            }
        }
        handleClose();
    };

    return (
        <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Name</th>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Contact</th>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Token</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(emp => (
                        <tr key={emp._id}>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.name}</td>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.email}</td>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.token}</td>
                            <td>
                                <IconButton onClick={() => handleEdit(emp)}>
                                    <EditSquareIcon style={{color:"#193E52"}}/>
                                </IconButton>
                            </td>
                            <td>
                                {emp.name !== "admin01" && <IconButton onClick={() => handleRemove(emp)}>
                                    <DisabledByDefaultIcon style={{color:"red"}}/>
                                </IconButton>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <IconButton
                onClick={handleAdd}
                style={{
                    backgroundColor:"#193E52",
                    color:"white",
                    fontSize:"15px",
                    display:"flex",
                    gap:"5px",
                    borderRadius:"10px",
                    marginTop:"10px"
                }}
            >
                <GroupAddIcon style={{color:"#fff"}}/>
                Add employee
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit employee</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={editValues.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={editValues.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        name="password"
                        value={editValues.password}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Token"
                        name="token"
                        value={editValues.token}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TeamManager;