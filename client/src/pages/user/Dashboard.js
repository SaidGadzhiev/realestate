import Sidebar from '../../components/nav/Sidebar';
import { useAuth } from '../../context/auth';

export default function Dashboard() {
	const [auth, setAuth] = useAuth();
	return (
		<div>
			<h1 className='display-1 bg-primary text-light p-5'>Hello</h1>
			<Sidebar />
		</div>
	);
}
