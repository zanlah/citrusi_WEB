/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import GoogleMapReact from 'google-map-react';
import proj4 from 'proj4';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import ElevationChart from '@/components/ElevationChart';

/*
const AnyReactComponent = ({ text }: any) => <div className="absolute translate-x-1/2 rounded-md h-5 w-5 text-blue bg-red-500">{text}</div>;
const Marker = ({ text }: any) => (
    <div style={{ color: 'blue', background: 'red', padding: '5px', borderRadius: '50%' }}>
        {text}
    </div>
);
*/




const fromProjection = 'EPSG:3857';
const toProjection = 'EPSG:4326';  // WGS 84

const MapPage = () => {
    const [openShowRouteDetails, setOpenShowRouteDetails] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<any>(null);
    const center = {
        lat: 46.1512,
        lng: 14.9955
    };
    const zoom = 8;



    const convertCoordinates = (coords: number[]) => {
        const converted = proj4(fromProjection, toProjection, coords);
        return converted;
    };

    const handleApiLoaded = (map: any, maps: any) => {

        fetch(import.meta.env.VITE_SERVER_URL + '/routes/list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const routesData = data.data.map((route: any) => ({
                    ...route,
                    latLngs: route.coordinates.map((coord: number[]) => ({
                        latLng: convertCoordinates([coord[0], coord[1]]),
                        elevation: coord[2],
                        additionalData: coord[3]
                    }))
                }));
                routesData.forEach((route: any) => {
                    const polyline = new maps.Polyline({
                        path: route.latLngs.map((pt: any) => ({ lat: pt.latLng[1], lng: pt.latLng[0] })),
                        geodesic: true,
                        strokeColor: '#C643A4',
                        strokeOpacity: 1.0,
                        strokeWeight: 4
                    });
                    polyline.setMap(map);
                    new maps.Marker({
                        position: { lat: route.latLngs[0].latLng[1], lng: route.latLngs[0].latLng[0] },
                        map: map,
                        title: "start",
                        icon: {
                            path: maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#a4c25e',
                            fillOpacity: 1,
                            strokeWeight: 0
                        }
                    });

                    new maps.Marker({
                        position: { lat: route.latLngs[route.latLngs.length - 1].latLng[1], lng: route.latLngs[route.latLngs.length - 1].latLng[0] },
                        map,
                        title: 'End',
                        icon: {
                            path: maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#de1257',
                            fillOpacity: 1,
                            strokeWeight: 0
                        }

                    });
                    maps.event.addListener(polyline, 'click', () => {
                        setSelectedRoute(route);
                        setOpenShowRouteDetails(true);
                    });
                    /* route.latLngs.forEach((pt: any, index: number) => {
                         new maps.Marker({
                             position: pt.latLng,
                             map,
                             title: `Point ${index + 1}: Elevation ${pt.elevation}m, Distance ${pt.additionalData.toFixed(2)}m`
                         });
                     });*/
                });
            })
            .catch(error => console.error('Error fetching routes:', error));
    };


    const formatTime = (minutes: number) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDistance = (distance: number) => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)} km`;
        }
        return `${distance} m`;
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact

                    bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    options={map => (
                        {
                            fullscreenControl: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            mapTypeId: map.MapTypeId.HYBRID,

                            styles: [
                                {
                                    featureType: "administrative.country",
                                    elementType: "geometry.stroke",
                                    stylers: [
                                        { visibility: "visible" },
                                        { color: "#ffffff" },
                                        { weight: 3 }]
                                },
                                {
                                    featureType: "administrative.province",
                                    elementType: "geometry.stroke",
                                    stylers: [{ visibility: "visible" }, { color: "#00ff00" }]
                                }
                            ],
                            tilt: 50,
                            maxZoom: 20,
                            minZoom: 8,

                        })
                    }
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }: { map: any, maps: any }) => handleApiLoaded(map, maps)}
                >

                </GoogleMapReact>
            </div>
            <Sheet open={openShowRouteDetails} onOpenChange={setOpenShowRouteDetails}>
                <SheetContent className='min-w-[500px]'>
                    <SheetHeader>
                        <SheetTitle className='text-xl'>{selectedRoute && selectedRoute.name}</SheetTitle>
                        <SheetDescription className='text-lg font-light'>Podatki o poti:</SheetDescription>
                    </SheetHeader>
                    <div className="grid mt-1  mb-5 space-y-1">
                        <div className="flex justify-between">
                            <div className="text-left text-gray-600">Višinska razlika:</div>
                            <div className="col-span-3 text-right">{selectedRoute && selectedRoute.cumulativeElevationGain} m</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-left text-gray-600">Dolžina:</div>
                            <div className="text-right">{selectedRoute && formatDistance(selectedRoute.distance)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-left text-gray-600">Čas:</div>
                            <div className=" text-right">{selectedRoute && formatTime(selectedRoute.duration)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-left text-gray-600">Težavnost:</div>
                            <div className=" text-right">{selectedRoute && selectedRoute.difficulty || "ni podatka"}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-left text-gray-600">Plezalna oprema: </div>
                            <div className=" text-right">{selectedRoute && selectedRoute.hasSafetyGear || "ni potrebna"}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-left text-gray-600">Koča zaprta:</div>
                            <div className=" text-right">{selectedRoute && selectedRoute.hutClosed || "ne"}</div>
                        </div>

                        {selectedRoute && <ElevationChart route={selectedRoute.coordinates} />}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MapPage;
