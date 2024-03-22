import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import axios from 'axios';

const Home = () => {
	const [auth, setAuth] = useAuth();

	const [adsForSell, setAdsForSell] = useState();
	const [adsForRent, setAdsForRent] = useState();

	useEffect(() => {
		fetchAds();
	}, []);

	const fetchAds = async () => {
		try {
			const { data } = await axios.get('/ads');
			console.log(data.adsForSell);
			setAdsForSell(data.adsForSell);
			setAdsForRent(data.adsForRent);
		} catch (err) {
			console.log(err);
		}
	};

	console.log(adsForSell, adsForRent);
	return (
		<div>
			<h1 className='display-1 bg-primary text-light p-5'>Home</h1>
		</div>
	);
};

export default Home;
