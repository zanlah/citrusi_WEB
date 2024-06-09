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

interface StepsPerDayData {
  [date: string]: number;
}

const Stepschart = () => {

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/stats?userId=1`);
        const data = await response.json();

        const stepsPerDay: StepsPerDayData = {};

        data.forEach((entry: { date: string; steps: any; }) => {
          const date = entry.date.split('T')[0]; // Extract the date part
          if (stepsPerDay[date]) {
            stepsPerDay[date] += entry.steps;
          } else {
            stepsPerDay[date] = entry.steps;
          }
        });

        const labels = Object.keys(stepsPerDay);
        const stepData = Object.values(stepsPerDay);

        const formattedData = {
          labels,
          datasets: [
            {
              label: 'Število korakov',
              data: stepData,
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              borderWidth: 1,
            },
          ],
        };
        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
        text: 'Statistika korakov',
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
