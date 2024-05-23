import { FaShoePrints, FaRoute, FaHashtag, FaClock, FaPersonWalking } from "react-icons/fa6";
import Stepschart from "./Stepschart";
import ActivitiesChart from "./Activiteschart";
import WalkingImage from "@/assets/walking.svg";

const Statistics_layout = () => {
    return (
        <>
        <div className='bg-gray-100 min-h-screen'>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-md p-5 flex items-center justify-between">
                    <FaShoePrints className="text-4xl text-blue-500" />
                    <div className="text-right">
                        <p className="text-2xl font-bold">1234</p>
                        <p className="text-gray-600 font-bold">Steps</p>
                    </div>
                </div>
                <div className="bg-white rounded-md p-5 flex items-center justify-between">
                    <FaRoute className="text-4xl text-blue-500" />
                    <div className="text-right">
                        <p className="text-2xl font-bold">123.4 km</p>
                        <p className="text-gray-600 font-bold">Traveled</p>
                    </div>
                </div>
                <div className="bg-white rounded-md p-5 flex items-center justify-between">
                    <FaHashtag className="text-4xl text-blue-500" />
                    <div className="text-right">
                        <p className="text-2xl font-bold">4</p>
                        <p className="text-gray-600 font-bold">Activities</p>
                    </div>
                </div>
                <div className="bg-white rounded-md p-5 flex items-center justify-between">
                    <FaClock className="text-4xl text-blue-500" />
                    <div className="text-right">
                        <p className="text-2xl font-bold">1h 40min</p>
                        <p className="text-gray-600 font-bold">Time</p>
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
                        <img src={WalkingImage} alt="Walking Image" className="w-80 text-blue-500" />
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
