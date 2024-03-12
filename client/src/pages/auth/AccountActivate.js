import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { Navigate } from 'react-router-dom';

export default function AccountActivate() {
	const [auth, setAuth] = useAuth();

	const navigate = useNavigate();

	const { token } = useParams();

	useEffect(() => {
		if (token) {
			requestActivation();
		}
	}, [token]);

	const requestActivation = async () => {
		try {
			const { data } = await axios.post(`/register`, { token });
			if (data?.error) {
				toast.error(data.error);
			} else {
				localStorage.setItem('auth', JSON.stringify(data));

				setAuth(data);
				toast.success('Successfully logged in!');
				navigate('/');
			}
		} catch (err) {
			console.log(err);
			toast.error('Something went wrong. Try to register again');
		}
	};

	return (
		<div className='display-1 d-flex justify-content-center align-items-center vh-100'>
			Please wait...
		</div>
	);
}
