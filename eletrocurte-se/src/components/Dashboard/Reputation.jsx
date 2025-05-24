import React from "react";
import Card from "../Card";
import DataDescription from "./DataDescription";

const NewCard = ({ data }) => {
    return(
        <div className="content">
            <Card title={"Reputação"} type={"card-horizontal"}>
                <DataDescription 
                    value={data.sales_percentage}
                    valueColor="#5d7861"
                    description={"Vendas com relação aos últimos 30 dias"}
                    newStyle={{"width": "150px"}}
                />
                <DataDescription
                    value={data.complainings}
                    description={"Reclamações nos últimos 30 dias"}
                />
                <DataDescription
                    value={data.late_send}
                    description={"Despachos com atraso"}
                />
                <DataDescription
                    value={data.new_users}
                    description={"Usuários novos nos últimos 30 dias"}
                />
            </Card>
        </div>
    );
};

export default NewCard;