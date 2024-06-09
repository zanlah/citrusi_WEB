import { useEffect, useState } from 'react'  
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

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

interface ActivityData {
  [month: string]: number;
}

const ActivitiesChart = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/stats?userId=1`);
        const data = await response.json();

        const activitiesPerMonth: ActivityData = {};

        if (Array.isArray(data)) {
          data.forEach((entry: { date: string }) => {
            const month = entry.date.split('-')[1]; // Extract the month part from the date
            if (activitiesPerMonth[month]) {
              activitiesPerMonth[month]++;
            } else {
              activitiesPerMonth[month] = 1;
            }
          });
        }

        const labels = Object.keys(activitiesPerMonth);
        const activityData = Object.values(activitiesPerMonth);

       const formattedData: ChartData = {
          labels,
          datasets: [
            {
              label: 'Število aktivnosti',
              data: activityData,
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
        text: 'Mesečne aktivnosti',
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
