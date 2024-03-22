import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GOOGLE_PLACES_KEY } from '../../config';
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
		title: '',
		description: '',
		loading: false,
		type,
		action,
	});

	const navigate = useNavigate();

	const handleClick = async () => {
		try {
			setAd({ ...ad, loading: true });

			const { data } = await axios.post('/ad', ad);
			console.log('response ', data);
			if (data?.error) {
				toast.error(data.error);
				setAd({ ...ad, loading: false });
			} else {
				toast.success('Ad created successfully');
				setAd({ ...ad, loading: false });
				navigate('/dashboard');
			}
		} catch (err) {
			console.log(err);
			setAd({ ...ad, loading: false });
		}
	};

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
			<div>
				<CurrencyInput
					placeholder='Enter price'
					defaultValue={ad.price}
					className='form-control mb-3'
					onValueChange={(value) => setAd({ ...ad, price: value })}
				/>
			</div>

			{type === 'House' ? (
				<>
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
				</>
			) : (
				<></>
			)}

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

			<button
				onClick={handleClick}
				className={`btn btn-primary  mb-5 ${ad.loading ? 'disabled' : ''}`}
			>
				{ad.loading ? 'Saving' : 'Submit'}
			</button>

			{/* {JSON.stringify(ad, null, 4)} */}
		</>
	);
};

export default AdForm;
