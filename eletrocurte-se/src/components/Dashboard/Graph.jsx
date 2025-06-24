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
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch delivered orders
        fetch(process.env.REACT_APP_API_URL + '/api/orders', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("Token")
            }
        })
            .then(resp => resp.json())
            .then(orderData => setOrders(orderData || []));
        // Fetch all products
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(resp => resp.json())
            .then(prodData => setProducts(prodData || []));
    }, []);

    function getProductInfo(id) {
        return products.find(p => String(p.id) === String(id));
    }

    const deliveredProducts = [];
    orders.forEach(order => {
        if (order.status === "delivered" && Array.isArray(order.itens)) {
            order.itens.forEach(item => {
                const prod = getProductInfo(item.id);
                if (prod) {
                    deliveredProducts.push({
                        id: prod.id,
                        name: prod.name,
                        image: prod.image,
                        price: prod.price,
                        date: order.updatedAt ? order.updatedAt.slice(0,10) : "",
                        quantity: item.quantity
                    });
                }
            });
        }
    });

    // Filter by date (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 29); // inclusive of today

    const filteredProducts = deliveredProducts.filter(product => {
        const productDate = new Date(product.date);
        return productDate >= thirtyDaysAgo && productDate <= now;
    });

    // Prepare chart data
    const salesByDay = {};
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(thirtyDaysAgo.getDate() + i);
        const dayStr = d.toISOString().slice(5, 10).replace('-','/');
        salesByDay[dayStr] = 0;
    }
    filteredProducts.forEach(product => {
        console.log(product);
        const date = product.date.slice(5,10).replace('-','/');
        if (salesByDay[date] !== undefined) {
            salesByDay[date] += product.quantity;
        }
    });
    const chartLabels = Object.keys(salesByDay);
    const chartData = Object.values(salesByDay);

    return(
        <div style={{marginTop: "-10px", height: "100%", width: "100%"}}>
            <Line
                options={options} 
                data={{
                    labels: chartLabels,
                    datasets: [{
                        label: "Itens vendidos (últimos 30 dias)",
                        data: chartData,
                        pointRadius: 7,
                        pointHoverRadius: 10
                    }]
                }} 
            />
        </div>
    );
};

export default Graph;