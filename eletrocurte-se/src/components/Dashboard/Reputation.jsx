import React from "react";
import Card from "../Card";
import DataDescription from "./DataDescription";

const NewCard = ({ 
    percentage,
    complainings,
    late_send,
    new_users
 }) => {
    return(
        <div>
            <Card title={"Reputação"} type={"card-horizontal"}>
                <DataDescription 
                    value={percentage}
                    valueColor="#5d7861"
                    description={"Vendas com relação aos últimos 30 dias"}
                    newStyle={{"width": "150px"}}
                />
                <DataDescription
                    value={complainings}
                    description={"Reclamações nos últimos 30 dias"}
                />
                <DataDescription
                    value={late_send}
                    description={"Despachos com atraso"}
                />
                <DataDescription
                    value={new_users}
                    description={"Usuários novos nos últimos 30 dias"}
                />
            </Card>
        </div>
    );
};

export default NewCard;