import { FaShoePrints, FaRoute, FaHashtag, FaClock } from "react-icons/fa6";
import Stepschart from "./Stepschart";
import ActivitiesChart from "./Activiteschart";
import WalkingImage from "@/assets/walking.svg";
import { useEffect, useState } from "react";

const Statistics_layout = () => {

    const [stats, setStats] = useState(null);
    const [totalSteps, setTotalSteps] = useState(0);
    const [entryCount, setEntryCount] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/stats?userId=1`);  
        const data = await response.json();
        setStats(data);
        console.log(data);

        let steps = 0;
        let duration = 0;
        let distance = 0;
        let count = 0;
        if (Array.isArray(data)) {
          data.forEach(entry => {
            steps += entry.steps;
            duration += parseInt(entry.duration.slice(0, 2)) * 3600 + parseInt(entry.duration.slice(3, 5)) * 60 + parseInt(entry.duration.slice(6, 8));
            distance += entry.ROUTES.distance;
            count++;
          });
        }
        setTotalSteps(steps);
        setTotalDuration(duration);
        setTotalDistance(distance / 1000);
        setEntryCount(count);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };  
    

    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const formatDuration = (durationInSeconds: number) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};

    return (
        <>
            <div className='bg-gray-100'>
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-md p-5 flex items-center justify-between">
                        <FaShoePrints className="text-4xl text-indigo-600" />
                        <div className="text-right">
                            <p className="text-2xl font-bold">{totalSteps}</p>
                            <p className="text-gray-600 font-bold">Korakov</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-md p-5 flex items-center justify-between">
                        <FaRoute className="text-4xl text-indigo-600" />
                        <div className="text-right">
                            <p className="text-2xl font-bold">{totalDistance} km</p>
                            <p className="text-gray-600 font-bold">Prehojenih</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-md p-5 flex items-center justify-between">
                        <FaHashtag className="text-4xl text-indigo-600" />
                        <div className="text-right">
                            <p className="text-2xl font-bold">{entryCount}</p>
                            <p className="text-gray-600 font-bold">Aktivnosti</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-md p-5 flex items-center justify-between">
                        <FaClock className="text-4xl text-indigo-600" />
                        <div className="text-right">
                            <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                            <p className="text-gray-600 font-bold">Aktivnih</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-md p-5 flex justify-center items-center">
                        <Stepschart />
                    </div>
                    <div className="bg-white rounded-md p-5 flex justify-center items-center">
                        <ActivitiesChart />
                    </div>
                </div>


                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-white rounded-md p-5 flex justify-between items-center">
                        <div className="flex items-center mx-10">
                            <img src={WalkingImage} alt="Walking Image" className="w-80 text-indigo-600" />
                        </div>
                        <div className="text-right mx-10">
                            <p className="text-4xl font-bold">EAT - SLEEP - MOVE - REPEAT</p>
                            <p className="text-md sm:text-md lg:text-md mt-4">"Keep moving, one step at a time, for a journey worth repeating."</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Statistics_layout;
