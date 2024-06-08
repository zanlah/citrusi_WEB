import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

const Stepschart = () => {

  /**
   * ! Connect with the API and retrieve data
   */

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/Stepsdata.json')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = {
          labels: data.labels,
          datasets: [
            {
              label: 'Steps',
              data: data.data,
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              borderWidth: 1,
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
        text: 'Walking Statistics',
      },
    },
  };

  return (
    <>
    { chartData && <Bar data={chartData} options={options} />}
    </>
  );
};

export default Stepschart;
