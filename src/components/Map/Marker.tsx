import { type FC } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface MarkerProps {
  lat: number;
  lng: number;
  partner: any;
  onClick?: () => void;
  isSelected?: boolean;
}

const Marker: FC<MarkerProps> = ({ partner, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ transform: 'translate(-50%, -100%)' }}
    >
      <FaMapMarkerAlt
        size={isSelected ? 40 : 32}
        className={`drop-shadow-lg transition-all ${isSelected
            ? 'text-emerald-400 scale-110'
            : 'text-emerald-500 group-hover:scale-110'
          }`}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-white rounded-lg shadow-lg p-3 whitespace-nowrap">
          <p className="font-semibold text-sm">
            {partner.profile?.society || `${partner.profile?.first_name} ${partner.profile?.last_name}`}
          </p>
          <p className="text-xs text-gray-600">{partner.city}</p>
        </div>
      </div>
    </div>
  );
};

export default Marker;