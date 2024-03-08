import * as config from '../config.js';
import jwt from 'jsonwebtoken';
import { emailTemplate } from '../helpers/email.js';

export const welcome = (req, res) => {
	console.log('found');
	res.status(200).json({ data: '🥓 helsdsl' });
};

export const preRegister = async (req, res) => {
	try {
		// console.log(req.body);

		const { email, password } = req.body;
		const token = jwt.sign({ email, password }, config.JWT_SECRET, {
			expiresIn: '1h',
		});

		config.AWSSES.sendEmail(
			emailTemplate(
				email,
				`
            <p>Please click the link below to activate your account.</p>
                <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
            `,
				config.REPLY_TO,
				'Activate your account'
			),
			(err, data) => {
				if (err) {
					console.log(err);
					return res.json({ ok: false });
				} else {
					console.log(data);
					return res.json({ ok: true });
				}
			}
		);
	} catch (err) {
		console.log(err);
		return res.json({ error: 'error....' });
	}
};

export const register = async (req, res) => {
	try {
		const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
	} catch (err) {
		return res.json({ error: 'error....' });
	}
};
