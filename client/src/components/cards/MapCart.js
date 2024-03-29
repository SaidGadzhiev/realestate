import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_KEY } from '../../config';
import { useEffect, useState } from 'react';
import Marker from './Marker';

const MapCard = ({ ad }) => {
	const [adCenter, setAdCenter] = useState([20, 10]);

	useEffect(() => {
		if (ad?.location?.coordinates) {
			setAdCenter({
				lat: ad?.location?.coordinates[1],
				lng: ad?.location?.coordinates[0],
			});
		}
	}, [ad]);

	return (
		<div style={{ width: '100%', height: '350px' }}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
				defaultCenter={{ lat: 58.1304, lng: 106.3468 }}
				center={adCenter}
				defaultZoom={11}
			>
				<Marker lat={adCenter.lat} lng={adCenter.lng} text='📍' />
			</GoogleMapReact>
		</div>
	);
};

export default MapCard;
