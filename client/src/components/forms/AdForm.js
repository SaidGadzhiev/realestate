import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GOOGLE_PLACES_KEY } from '../../config';
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from './ImageUpload';

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

	return (
		<>
			<div className='mb-3 form-contol'>
				<ImageUpload ad={ad} setAd={setAd} />
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

			<CurrencyInput
				placeholder='Enter price'
				defaultValue={ad.price}
				className='form-control mb-3'
				onValueChange={(value) => setAd({ ...ad, price: value })}
			/>

			<input
				type='number'
				min='0'
				className='form-control mb3'
				placeholder='How many bedrooms'
				value={ad.bedrooms}
				onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
			/>

			<input
				type='number'
				min='0'
				className='form-control mb3'
				placeholder='How many bathrooms'
				value={ad.bathrooms}
				onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
			/>

			<input
				type='number'
				min='0'
				className='form-control mb3'
				placeholder='How many car parks'
				value={ad.carpark}
				onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
			/>

			<input
				type='text'
				className='form-control mb3'
				placeholder='What is the land size'
				value={ad.landsize}
				onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
			/>

			<input
				type='text'
				className='form-control mb3'
				placeholder='Enter title'
				value={ad.title}
				onChange={(e) => setAd({ ...ad, title: e.target.value })}
			/>

			<textarea
				className='form-control mb3'
				placeholder='Description'
				value={ad.description}
				onChange={(e) => setAd({ ...ad, description: e.target.value })}
			/>

			<button className='btn btn-primary'>Submit</button>

			{JSON.stringify(ad, null, 4)}
		</>
	);
};

export default AdForm;
