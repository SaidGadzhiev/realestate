import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import axios from 'axios';
import AdCard from '../components/cards/AdCard';

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
			setAdsForSell(data.adsForSell);
			setAdsForRent(data.adsForRent);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<div>
				<h1 className='display-1 bg-primary text-light p-5'>For Sell</h1>
				<div className='container'>
					<div className='row'>
						{adsForSell?.map((ad) => (
							<AdCard ad={ad} key={ad?._id} />
						))}
					</div>
				</div>
			</div>

			<div>
				<h1 className='display-1 bg-primary text-light p-5'>For Rent</h1>
				<div className='container'>
					<div className='row'>
						{adsForRent?.map((ad) => (
							<AdCard ad={ad} key={ad?._id} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
