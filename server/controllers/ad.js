import slugify from 'slugify';
import * as config from '../config.js';
import { nanoid } from 'nanoid';
import Ad from '../models/ad.js';
import User from '../models/user.js';

export const uploadImage = async (req, res) => {
	try {
		const { image } = req.body;
		const base64image = new Buffer.from(
			image.replace(/^data:image\/\w+;base64,/, ''),
			'base64'
		);

		const type = image.split(';')[0].split('/')[1];

		const parrams = {
			Bucket: 'realestate-app-udemy',
			Key: `${nanoid()}.${type}`,
			Body: base64image,
			ACL: 'public-read',
			ContentEncoding: 'base64',
			ContentType: `image/${type}`,
		};

		config.AWSS3.upload(parrams, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			} else {
				res.send(data);
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'upload failed...' });
	}
};

export const removeImage = (req, res) => {
	try {
		const { Key, Bucket } = req.body;
		config.AWSS3.deleteObject({ Bucket, Key }, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			} else {
				res.send({ ok: true });
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Deleting the file was failed' });
	}
};

export const create = async (req, res) => {
	try {
		const { photos, description, title, address, price, type, landsize } =
			req.body;
		if (!photos?.length) {
			return res.json({ error: 'Photos are required' });
		}
		if (!price) {
			return res.json({ error: 'Price is required' });
		}
		if (!type) {
			return res.json({ error: 'Is property house or land' });
		}
		if (!address) {
			return res.json({ error: 'Address is required' });
		}
		if (!description) {
			return res.json({ error: 'Description is required' });
		}

		const geo = await config.GOOGLE_GEOCODER.geocode(address);

		const ad = await new Ad({
			...req.body,
			postedBy: req.user._id,
			location: {
				type: 'Point',
				coordinates: [geo?.[0]?.longitude, geo?.[0].latitude],
			},
			googleMap: geo,
			slug: slugify(`${type}-${address}-${price}-${nanoid(10)}`),
		}).save();

		console.log('THIS IS THE AD SLUG: ', ad.slug);

		//make user role => seller
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: { role: 'Seller' },
			},
			{ new: true }
		);

		user.password = undefined;
		user.resetCode = undefined;

		res.json({
			ad,
			user,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Error saving' });
	}
};

export const ads = async (req, res) => {
	try {
		const adsForSell = await Ad.find({ action: 'Sell' })
			.select('-googleMap -location -photo.Key -photo.key -photo.ETag')
			.sort({ createAt: -1 })
			.limit(12);

		const adsForRent = await Ad.find({ action: 'Rent' })
			.select('-googleMap -location -photo.Key -photo.key -photo.ETag')
			.sort({ createAt: -1 })
			.limit(12);

		console.log({ adsForSell, adsForSell });

		return res.json({ adsForSell, adsForRent });
	} catch (err) {
		return res.status(400).json({ error: 'Error getting the ads' });
	}
};

export const read = async (req, res) => {
	console.log(req.params.slug);
	try {
		const ad = await Ad.findOne({ slug: req.params.slug }).populate(
			'postedBy',
			'name username email phone company photo.Location'
		);
		const related = await Ad.find({
			//$ne = excluding
			_id: { $ne: ad._id },
			action: ad.action,
			type: ad.type,
			address: {
				$regex: ad.googleMap[0].city,
				$options: 'i',
			},
		})
			.limit(3)
			.select('-photos.Key -photos.ket -photos.ETag -photos.Bucket -googleMap');

		res.json({ ad, related });
	} catch (err) {
		return res.status(400).json({ error: 'Error getting the ads' });
	}
};

export const addToWishList = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: { wishlist: req.body.adId },
			},
			{ new: true }
		);

		const { password, resetCode, ...rest } = user._doc;

		res.json(rest);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Error adding item to the wishlist' });
	}
};

export const removeFromWishList = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { wishlist: req.params.adId },
			},
			{ new: true }
		);

		const { password, resetCode, ...rest } = user._doc;

		res.json(rest);
	} catch (err) {
		console.log(err);
		return res
			.status(400)
			.json({ error: 'Error removing item from the wishlist' });
	}
};
