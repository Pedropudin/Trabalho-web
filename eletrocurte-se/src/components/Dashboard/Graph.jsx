import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const Graph = () => {
    const [data,setData] = useState(null);

    useEffect(() => {
        fetch('/data/dashboard.json')
        .then((resp) => {
            return resp.json();
        })
        .then(dash_data => {
            setData(dash_data.sales);
        })
    }, []);

    return(
        <div style={{marginTop: "-10px", height: "100%", width: "100%"}}>
            { data && <Line
                options={options} 
                data={{
                    labels: data.hardware.map(item => item.day),
                    datasets: [{
                        label: "Hardware",
                        data: data.hardware.map(item => item.sold),
                        pointRadius: 7,
                        pointHoverRadius: 10
                    }]
                }} 
            /> }
        </div>
    );
};

export default Graph;