import GoogleMapReact from 'google-map-react';
import { useRef, useState, type ChangeEvent, type FC } from 'react';
import { FaMapMarker } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaTimesSolid } from "react-icons/lia";

interface MapProps {
    center: {
        lat: number;
        lng: number;
    },
    zoom: number;
    className?: string;
}

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const Map: FC<MapProps> = ({ center, zoom, className }) => {
    const [mapInstance, setMapInstance] = useState(null);
    const [mapsApi, setMapsApi] = useState(null);
    const [toggleLocations, setToggleLocations] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const searchBoxRef = useRef<HTMLInputElement>(null);

    const handleApiLoaded = ({ map, maps }: any) => {
        setMapInstance(map);
        setMapsApi(maps);
    }

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }

    const handleDeleteSearch = () => {
        setSearchValue('');
    }

    const handleSetOwnLocation = () => {

    }

    const handleToggleLocations = () => {
        setToggleLocations(!toggleLocations);
    }

    const haveSearch = searchValue.length > 0;

    return (
        <div className={`relative w-full h-full ${className}`}>
            <div className='absolute top-4 right-4 left-4 z-50'>
                <div className={`${haveSearch ? "flex items-center justify-between" : "lg:grid lg:grid-cols-[1fr_120px] lg:items-center"} rounded shadow bg-white p-3`}>
                    <input
                        className='w-full box-border outline-none lg:border-none'
                        ref={searchBoxRef}
                        type="text"
                        placeholder="Recherche..."
                        value={searchValue}
                        onChange={handleSearch} />
                    <button
                        onClick={() => haveSearch ? handleDeleteSearch() : handleSetOwnLocation()}
                        className={`${!haveSearch ? "mt-2 lg:mt-0 rounded shadow bg-[#ECECEC] text-sm w-full lg:w-max" : ""} p-1`}
                        type="button">
                        {haveSearch ? (
                            <LiaTimesSolid size={18} />
                        ) : (
                            `Votre localisation`
                        )}
                    </button>
                </div>
                <div className='mt-2'>
                    <button
                        onClick={handleToggleLocations}
                        className='w-full lg:hidden ml-auto bg-white shadow p-3 rounded' type="button">
                        <RxHamburgerMenu size={18} />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${toggleLocations ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"} lg:opacity-100 lg:max-h-96`}>
                        <ul className='lg:w-max shadow bg-white p-3 rounded grid gap-2'>
                            {[...Array(10)].map((_, index) => (
                                <li key={index} className='flex items-center gap-2'>
                                    <FaMapMarker size={18} className='text-green' /> 24Kara Hanoi
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full h-screen">
                <GoogleMapReact
                    options={{ fullscreenControl: false }}
                    bootstrapURLKeys={{ key: GOOGLE_MAP_KEY, libraries: ['places'] }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={handleApiLoaded} />
            </div>
        </div>
    )
}

export default Map;