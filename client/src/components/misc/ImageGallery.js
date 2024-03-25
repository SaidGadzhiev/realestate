import { useState, useCallback } from 'react';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { useParams } from 'react-router-dom';

const ImageGallery = ({ photos }) => {
	const [current, setCurrent] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const params = useParams();

	const openLightBox = useCallback((event, { photo, index }) => {
		setCurrent(index);
		setIsOpen(true);
	}, []);

	const closeLightBox = () => {
		setCurrent(0);
		setIsOpen(false);
	};

	return (
		<>
			<Gallery photos={photos} onClick={openLightBox} />
			<ModalGateway>
				{isOpen ? (
					<Modal onClose={closeLightBox}>
						<Carousel
							currentIndex={current}
							views={photos.map((x) => ({
								...x,
								srcset: x.srcSet,
								caption: x.title,
							}))}
						/>
					</Modal>
				) : null}
			</ModalGateway>
		</>
	);
};
export default ImageGallery;
