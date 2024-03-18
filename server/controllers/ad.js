import * as config from '../config.js';
import { nanoid } from 'nanoid';

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
