import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Navigate } from "react-router-dom";

export const Home = () => {

	const { store} = useGlobalReducer()

	if (!store.token) {
		return <Navigate to="/login" />
	}

	return (
		<div className="container">
			<div className="text-center p-5">
				<h1>Bienvenido/a, iniciaste sesión</h1>
			</div>
		</div>
	);
};