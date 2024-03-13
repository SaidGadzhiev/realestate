import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post(`/forgot-password`, {
				email,
			});
			if (data?.error) {
				toast.error(data.error);
				setLoading(false);
			} else {
				toast.success('Please check your email for password reset link');
				setLoading(false);
				navigate('/');
			}
		} catch (err) {
			setLoading(false);
			if (err.response.data.error) {
				toast.error(err.response.data.error);
			} else {
				toast.error('Something went wrong, try again later');
			}
		}
	};

	return (
		<div>
			<h1 className='display-1 bg-primary text-light p-5'>
				Forgot password reset
			</h1>
			<div className='container'>
				<div className='row'>
					<div className='col-lg-4 offset-lg-4'>
						<form onSubmit={handleSubmit}>
							<input
								type='text'
								placeholder='Enter your email'
								className='form-control'
								required
								autoFocus
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<button
								disabled={loading}
								className='btn btn-primary col-12 mb-4'
							>
								{loading ? 'Waiting...' : 'Submit'}
							</button>
						</form>
						<Link to='/auth/forgot-password'>Back to login</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
