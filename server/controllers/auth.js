import * as config from '../config.js';
import jwt from 'jsonwebtoken';
import { emailTemplate } from '../helpers/email.js';
import { hashPassword, comparePassword } from '../helpers/auth.js';
import User from '../models/user.js';
import { nanoid } from 'nanoid';
import validator from 'email-validator';

export const welcome = (req, res) => {
	console.log('found');
	res.status(200).json({ data: '🥓 helsdsl' });
};

//sends an email to activate/verify their account
export const preRegister = async (req, res) => {
	try {
		const { email, password } = req.body;

		//validation
		if (!validator.validate(email)) {
			return res.status(400).json({ error: 'A valid email is required' });
		}

		if (!password) {
			return res.status(400).json({ error: 'Password is required' });
		}

		if (password && password.length < 6) {
			return res
				.status(400)
				.json({ error: 'Password should be at least 6 characters' });
		}

		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ error: 'Email is already taken' });
		}

		//generating token
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
					return res.status(400).json({ ok: false });
				} else {
					console.log(data);
					return res.status(200).json({ ok: true });
				}
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'error....' });
	}
};

//saves the account to the mongoDB with the User Schema
export const register = async (req, res) => {
	try {
		const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);

		const hashedPassword = await hashPassword(password);

		const user = await new User({
			username: nanoid(6),
			email,
			password: hashedPassword,
		}).save();

		const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
			expiresIn: '1h',
		});
		const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
			expiresIn: '7d',
		});

		user.password = undefined;
		user.resetCode = undefined;

		return res.status(200).json({
			token,
			refreshToken,
			user,
		});
	} catch (err) {
		return res.status(400).json({ error: 'error....' });
	}
};

//checks the logins credentials
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		//find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'Wrong email' });
		}

		console.log(user.password);

		//compare passwords
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.status(400).json({ error: 'Wrong password' });
		}
		console.log(match);

		//create tokens
		const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
			expiresIn: '1h',
		});
		const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
			expiresIn: '7d',
		});

		//hides or removes the password and reset code from the res.status for security reasons
		user.password = undefined;
		user.resetCode = undefined;

		return res.status(200).json({
			token,
			refreshToken,
			user,
		});
	} catch (err) {
		return res.status(400).json({ error: 'error....something wrong' });
	}
};

//send an email to the user with a new token
export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ error: 'Could not find the user with that email' });
		} else {
			//assign the user to a resetCode which is used to identify the token
			const resetCode = nanoid();
			user.resetCode = resetCode;
			user.save();
			//generate a token
			const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
				expiresIn: '1h',
			});
			//send the email for the user to open that token
			config.AWSSES.sendEmail(
				emailTemplate(
					email,
					`
				<p>Please click the link below to access your account:</p>
				<a href='${config.CLIENT_URL}/auth/access-account/${token}'>Access my account</a>
				`,
					config.REPLY_TO,
					'Access your account'
				),
				(err, data) => {
					if (err) {
						console.log(err);
						return res.status(400).json({ ok: false });
					} else {
						console.log(data);
						return res.status(200).json({ ok: true });
					}
				}
			);
		}
	} catch (err) {
		return res.status(400).json({ err: 'error....something wrong' });
	}
};

export const accessAccount = async (req, res) => {
	try {
		const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

		const user = await User.findOneAndUpdate({ resetCode }, { resetCode: '' });

		//create tokens
		const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
			expiresIn: '1h',
		});
		const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
			expiresIn: '7d',
		});

		//hides/removes the password and reset code from the res.status for security reasons
		user.password = undefined;
		user.resetCode = undefined;

		return res.status(200).json({
			token,
			refreshToken,
			user,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'error....wrong information' });
	}
};
