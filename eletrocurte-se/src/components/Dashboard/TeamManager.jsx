import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Card from "../Card";

const TeamManager = () => {
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editValues, setEditValues] = useState({ name: "", role: "", email: "" });

    useEffect(() => {
        fetch('/data/employees.json')
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

    const handleClose = () => {
        setOpen(false);
        setSelectedEmp(null);
    };

    const handleChange = (e) => {
        setEditValues({ ...editValues, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (isAdding) {
            const newId = data && data.length > 0 ? Math.max(...data.map(emp => emp.id || 0)) + 1 : 1;
            setData([
                ...data,
                { id: newId, ...editValues }
            ]);
        } else {
            setData(data.map(emp =>
                emp.id === selectedEmp.id ? { ...emp, ...editValues } : emp
            ));
        }
        handleClose();
    };

    return (
        <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Nome</th>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Cargo</th>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Contato</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(emp => (
                        <tr key={emp.id}>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.name}</td>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.role}</td>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.email}</td>
                            <td>
                                <IconButton onClick={() => handleEdit(emp)}>
                                    <EditSquareIcon style={{color:"#193E52"}}/>
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
                Adicionar empregado
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Editar Funcionário</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nome"
                        name="name"
                        value={editValues.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Cargo"
                        name="role"
                        value={editValues.role}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TeamManager;