import React from "react";

const inputStyle = {
    backgroundColor: "#68D3FE",
    marginLeft: "8px",
    border: "1px solid black",
    borderRadius: "8px",
    padding: "3px",
    fontSize: "15px",
}

const DateSelector = ({ startDate, endDate, maxDate, onChange }) => {
    
    return (
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "10px" }}>
            <label>
                Start:
                <input
                    type="date"
                    value={startDate}
                    max={maxDate}
                    onChange={e => onChange(e.target.value, endDate)}
                    style={inputStyle}
                />
            </label>
            <label>
                End:
                <input
                    type="date"
                    value={endDate}
                    max={maxDate}
                    onChange={e => onChange(startDate, e.target.value)}
                    style={inputStyle}
                />
            </label>
        </div>
    );
};

export default DateSelector;