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
		console.log('geo, ', geo);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Error saving' });
	}
};
