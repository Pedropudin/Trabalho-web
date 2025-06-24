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

    const handleSave = async () => {
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
                    alert("Failed to add admin.");
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
                        {/*<th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Role</th>*/}
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Contact</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(emp => (
                        <tr key={emp._id}>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.name}</td>
                            {/*<td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.role}</td>*/}
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.email}</td>
                            <td>
                                <IconButton onClick={() => handleEdit(emp)}>
                                    <EditSquareIcon style={{color:"#193E52"}}/>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => handleRemove(emp)}>
                                    <DisabledByDefaultIcon style={{color:"red"}}/>
                                </IconButton>
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
                    {/*<TextField
                        margin="dense"
                        label="Role"
                        name="role"
                        value={editValues.role}
                        onChange={handleChange}
                        fullWidth
                    />*/}
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