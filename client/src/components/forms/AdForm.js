import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import { GOOGLE_PLACES_KEY } from '../../config';

const AdForm = ({ action, type }) => {
	const [ad, setAd] = useState({
		photos: [],
		uploading: false,
		price: '',
		address: '',
		bedrooms: '',
		bathrooms: '',
		carpark: '',
		landsize: '',
		type: '',
		title: '',
		description: '',
		loading: false,
	});

	console.log(ad);

	return (
		<>
			<div className='mb-3 form-contol'>
				<GooglePlacesAutocomplete
					apiKey={GOOGLE_PLACES_KEY}
					apiOptions='ca'
					selectProps={{
						defaultInputValue: ad?.address,
						placeholder: 'Search for address..',
						onChange: ({ value }) => {
							setAd({ ...ad, address: value.description });
						},
					}}
				/>
			</div>

			{JSON.stringify(ad, null, 4)}
		</>
	);
};

export default AdForm;
