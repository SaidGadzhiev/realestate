import { useAuth } from '../context/auth';

const Home = () => {
	const [auth, setAuth] = useAuth();
	return (
		<div>
			<h1 className='display-1 bg-primary text-light p-5'>Home</h1>
		</div>
	);
};

export default Home;
