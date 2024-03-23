import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Gallery from 'react-photo-gallery';

const AdView = () => {
	const params = useParams();

	const [ad, setAd] = useState({});
	const [related, setRelated] = useState([]);

	useEffect(() => {
		if (params?.slug) fetchAd();
	}, [params?.slug]);

	const fetchAd = async () => {
		try {
			const { data } = await axios.get(`/ad/${params.slug}`);
			setAd(data.ad);
			setRelated(data.related);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<pre>{JSON.stringify({ ad, related })}</pre>
		</>
	);
};
export default AdView;
