import GoogleMapReact from 'google-map-react';
import { useRef, useState, useEffect, type ChangeEvent, type FC } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaTimesSolid } from "react-icons/lia";
import { FaMapMarkerAlt } from "react-icons/fa";
import Marker from '@/components/Map/Marker';
import { useGoogleGeocoding } from '@/hooks/useGoogleGeocoding';
import type { UserProfile } from '@/types/user';

interface PartnerWithCoords {
    id: number;
    user_id: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
    show_hours: boolean;
    hours: any;
    by_appointment: boolean;
    profile?: Partial<UserProfile>;
    coords?: { lat: number; lng: number };
}

interface MapProps {
    partners: any[];
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
    className?: string;
    onPartnerSelect?: (partner: any) => void;
    selectedPartnerId?: string;
}

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const Map: FC<MapProps> = ({
    partners,
    center,
    zoom,
    className,
    onPartnerSelect,
    selectedPartnerId
}) => {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [mapsApi, setMapsApi] = useState<any>(null);
    const [toggleLocations, setToggleLocations] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [partnersWithCoords, setPartnersWithCoords] = useState<PartnerWithCoords[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<PartnerWithCoords | null>(null);
    const [isLoadingCoords, setIsLoadingCoords] = useState<boolean>(true);

    const searchBoxRef = useRef<HTMLInputElement>(null);
    const { getCoordsFromAddress, getCurrentPosition } = useGoogleGeocoding();

    useEffect(() => {
        const geocodePartners = async () => {
            setIsLoadingCoords(true);
            const partnersWithCoordsData: PartnerWithCoords[] = [];

            for (const partner of partners) {
                if (!partner.address || !partner.city) {
                    console.warn('⚠️ Partner sans adresse complète:', partner);
                    continue;
                }

                const address = `${partner.address}, ${partner.postal_code} ${partner.city}, ${partner.country}`;
                const coords = await getCoordsFromAddress(address);

                if (coords) {
                    partnersWithCoordsData.push({
                        ...partner,
                        coords,
                    });
                } else {
                    console.warn('❌ Échec du géocodage pour:', address);
                }
            }

            setPartnersWithCoords(partnersWithCoordsData);
            setIsLoadingCoords(false);
        };

        if (partners.length > 0) {
            geocodePartners();
        } else {
            setIsLoadingCoords(false);
        }
    }, [partners]);

    useEffect(() => {
        if (selectedPartnerId && partnersWithCoords.length > 0 && mapInstance) {
            const partner = partnersWithCoords.find(p => p.user_id === selectedPartnerId);
            if (partner && partner.coords) {
                setSelectedPartner(partner);

                mapInstance.panTo({
                    lat: partner.coords.lat,
                    lng: partner.coords.lng
                });
                mapInstance.setZoom(15);
            }
        }
    }, [selectedPartnerId, partnersWithCoords, mapInstance]);

    const handleApiLoaded = ({ map, maps }: any) => {
        setMapInstance(map);
        setMapsApi(maps);
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleDeleteSearch = () => {
        setSearchValue('');
    };

    const handleSetOwnLocation = async () => {
        const coords = await getCurrentPosition();
        if (coords && mapInstance) {
            mapInstance.panTo(coords);
            mapInstance.setZoom(12);
        }
    };

    const handleToggleLocations = () => {
        setToggleLocations(!toggleLocations);
    };

    const handlePartnerClick = (partner: PartnerWithCoords) => {
        setSelectedPartner(partner);
        if (partner.coords && mapInstance) {
            const currentZoom = mapInstance.getZoom();
            const offset = 0.002 / Math.pow(2, currentZoom - 10);

            mapInstance.panTo({
                lat: partner.coords.lat + offset,
                lng: partner.coords.lng
            });
            mapInstance.setZoom(15);
        }
        onPartnerSelect?.(partner);
    };

    const filteredPartners = partnersWithCoords.filter((partner) => {
        if (!searchValue) return true;
        const searchLower = searchValue.toLowerCase();
        return (
            partner.profile?.society?.toLowerCase().includes(searchLower) ||
            partner.profile?.first_name?.toLowerCase().includes(searchLower) ||
            partner.profile?.last_name?.toLowerCase().includes(searchLower) ||
            partner.city?.toLowerCase().includes(searchLower) ||
            partner.address?.toLowerCase().includes(searchLower)
        );
    });

    const haveSearch = searchValue.length > 0;

    return (
        <div className={`relative w-full h-full ${className}`}>
            <div className='absolute top-4 right-4 left-4 z-50'>
                <div className={`${haveSearch ? "flex items-center justify-between" : "lg:grid lg:grid-cols-[1fr_120px] lg:items-center"} rounded shadow bg-white p-3`}>
                    <input
                        className='w-full box-border outline-none lg:border-none'
                        ref={searchBoxRef}
                        type="text"
                        placeholder="Rechercher un partenaire..."
                        value={searchValue}
                        onChange={handleSearch}
                    />
                    <button
                        onClick={() => haveSearch ? handleDeleteSearch() : handleSetOwnLocation()}
                        className={`${!haveSearch ? "mt-2 lg:mt-0 rounded shadow bg-[#ECECEC] text-sm w-full lg:w-max" : ""} p-1`}
                        type="button"
                    >
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
                        className='w-full lg:hidden ml-auto bg-white shadow p-3 rounded flex items-center justify-between'
                        type="button"
                    >
                        <span>Points de contrôle ({filteredPartners.length})</span>
                        <RxHamburgerMenu size={18} />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${toggleLocations ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"} lg:opacity-100 lg:max-h-96`}
                    >
                        <div className='lg:w-80 shadow bg-white rounded max-h-96 overflow-y-auto'>
                            {isLoadingCoords ? (
                                <div className='p-4 text-center text-gray-500'>
                                    Chargement des points de contrôle...
                                </div>
                            ) : filteredPartners.length === 0 ? (
                                <div className='p-4 text-center text-gray-500'>
                                    Aucun point de contrôle trouvé
                                </div>
                            ) : (
                                <ul className='p-3 grid gap-2'>
                                    {filteredPartners.map((partner) => (
                                        <li
                                            key={partner.id}
                                            onClick={() => handlePartnerClick(partner)}
                                            className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors hover:bg-emerald-50 ${selectedPartner?.id === partner.id ? 'bg-emerald-100' : ''
                                                }`}
                                        >
                                            <FaMapMarkerAlt size={18} className='text-emerald-500 mt-1 shrink-0' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-semibold text-sm truncate'>
                                                    {partner.profile?.society || `${partner.profile?.first_name} ${partner.profile?.last_name}`}
                                                </p>
                                                <p className='text-xs text-gray-600 truncate'>
                                                    {partner.address}
                                                </p>
                                                <p className='text-xs text-gray-500'>
                                                    {partner.postal_code} {partner.city}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-full">
                <GoogleMapReact
                    options={{
                        fullscreenControl: false,
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                    bootstrapURLKeys={{ key: GOOGLE_MAP_KEY, libraries: ['places'] }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={handleApiLoaded}
                >
                    {partnersWithCoords.map((partner) =>
                        partner.coords ? (
                            <Marker
                                key={partner.id}
                                lat={partner.coords.lat}
                                lng={partner.coords.lng}
                                partner={partner}
                                onClick={() => handlePartnerClick(partner)}
                                isSelected={selectedPartner?.id === partner.id}
                            />
                        ) : null
                    )}
                </GoogleMapReact>
            </div>
        </div>
    );
};

export default Map;