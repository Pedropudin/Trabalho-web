import React, { useState, useEffect } from "react";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import Card from "../Card";

const TeamManager = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/data/employees.json')
        .then((resp) => {
            return resp.json();
        })
        .then(emp_data => {
            setData(emp_data.employees);
        })
    }, []);

    return(
        <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Nome</th>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Cargo</th>
                        <th style={{ borderBottom: "2px solid #007b99", padding: "8px" }}>Contato</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(emp => (
                        <tr key={emp.id}>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.name}</td>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.role}</td>
                            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{emp.email}</td>
                            <td><EditSquareIcon style={{color:"#193E52"}}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

export default TeamManager;