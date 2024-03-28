import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Link, useLocation } from 'react-router-dom';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const [auth, setAuth] = useAuth();

	const navigate = useNavigate();

	const location = useLocation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post(`/login`, {
				email,
				password,
			});
			if (data?.error) {
				toast.error(data.error);
				setLoading(false);
			} else {
				setAuth(data);
				localStorage.setItem('auth', JSON.stringify(data));
				toast.success('Logged in successfuly');
				setLoading(false);
				//location used to redirect user if he was logged out and wanted to revisit the same page after logging in
				location?.state != null
					? navigate(location.state)
					: navigate('/dashboard');
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
			<h1 className='display-1 bg-primary text-light p-5'>Login</h1>
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
							<input
								type='password'
								placeholder='Enter your password'
								className='form-control mb-4'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								disabled={loading}
								className='btn btn-primary col-12 mb-4'
							>
								{loading ? 'Waiting...' : 'Loding'}
							</button>
						</form>
						<Link to='/auth/forgot-password'>Forgot Password?</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
