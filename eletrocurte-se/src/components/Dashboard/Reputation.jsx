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
            <Card title={"Reputation"} type={"card-horizontal"}>
                <DataDescription 
                    value={percentage}
                    valueColor="#5d7861"
                    description={"Sales in the last 30 days"}
                    newStyle={{"width": "150px"}}
                />
                {/*<DataDescription
                    value={complainings}
                    description={"Complainings in the last 30 days"}
                />*/}
                {/*<DataDescription
                    value={late_send}
                    description={"Late dispatch"}
                />*/}
                <DataDescription
                    value={new_users}
                    description={"New users in the last 30 days"}
                />
            </Card>
        </div>
    );
};

export default NewCard;