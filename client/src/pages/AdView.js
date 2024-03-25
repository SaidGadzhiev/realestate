import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageGallery from '../components/misc/ImageGallery';
import Logo from '../logo.svg';
import Gallery from 'react-photo-gallery';

const testPhotos = [
	{
		src: 'http://example.com/example/img1.jpg',
		width: 4,
		height: 3,
	},
	{
		src: 'http://example.com/example/img2.jpg',
		width: 1,
		height: 1,
	},
];

const AdView = () => {
	const params = useParams();

	const [ad, setAd] = useState({});
	const [related, setRelated] = useState([]);

	useEffect(() => {
		if (params?.slug) {
			fetchAd();
		}
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

	const generatePhotosArray = (photos) => {
		if (photos?.length > 0) {
			const x = photos?.length === 1 ? 2 : 4;
			let arr = [];

			photos.map((p) =>
				arr.push({
					src: p.Location,
					width: x,
					height: x,
				})
			);
			return arr;
		} else {
			return [{ src: Logo, width: 2, height: 1 }];
		}
	};

	return (
		<>
			{/* <Gallery photos={testPhotos} /> */}
			{/* <ImageGallery photos={generatePhotosArray(ad?.photos)} /> */}
			<pre>{JSON.stringify({ ad, related })}</pre>
		</>
	);
};
export default AdView;
