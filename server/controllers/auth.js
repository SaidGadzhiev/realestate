export const welcome = (req, res) => {
	console.log('found');
	res.status(200).json({ data: '🥓 helsdsl' });
};
