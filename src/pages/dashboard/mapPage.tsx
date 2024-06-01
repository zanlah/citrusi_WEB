/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GoogleMapReact from 'google-map-react';
import proj4 from 'proj4';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetOverlay,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const AnyReactComponent = ({ text }: any) => <div className="absolute translate-x-1/2 rounded-md h-5 w-5 text-blue bg-red-500">{text}</div>;
const Marker = ({ text }: any) => (
    <div style={{ color: 'blue', background: 'red', padding: '5px', borderRadius: '50%' }}>
        {text}
    </div>
);




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

        fetch('http://52.143.190.38/api/routes/list')
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
    return (
        <div className="min-h-screen">
            <Navbar />
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact

                    bootstrapURLKeys={{ key: "AIzaSyAhHBDaNhQVgnDd6QC83XmwyIWjTvungkM" }}
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
                <SheetContent >
                    <SheetHeader>
                        <SheetTitle>{selectedRoute && selectedRoute.name}</SheetTitle>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MapPage;
