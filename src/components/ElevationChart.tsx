import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const ElevationChart = ({ route: routeData }: any) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState<any>(true);
    console.log(routeData)
    useEffect(() => {
        if (!routeData) {
            setLoading(false);
            return;
        }

        const labels = routeData.map((pt: any, index: number) => `Točka ${index + 1}`);
        const data = routeData.map((pt: any) => pt[2]);

        const formattedData = {
            labels,
            datasets: [
                {
                    label: 'Nadmorska višina (m)',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderWidth: 2,
                    borderColor: '#4f46e5',
                    pointRadius: 0,
                    tension: 0.4
                }
            ]
        };

        setChartData(formattedData);
        setLoading(false);
    }, [routeData]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Elevacijski profil',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    display: true
                }
            },
            x: {
                ticks: {
                    display: false
                },
                grid: {
                    display: false
                }
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {chartData && <div className="h-[300px] w-full">
                <Line data={chartData} options={options} />
            </div>}
        </>
    );
};

export default ElevationChart;