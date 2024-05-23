import { useEffect, useState } from 'react'  
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
};

const ActivitiesChart = () => {

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/Activitydata.json')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = {
          labels: data.labels,
          datasets: [
            {
              label: 'Activities',
              data: data.data,
              fill: false,
              borderColor: '#3b82f6',
              tension: 0,
            },
          ],
        };
        setChartData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Activities',
      },
    },
  };

  return (
    <>
    { chartData && <Line data={chartData} options={options}/>}
    </>
  );
};

export default ActivitiesChart;
