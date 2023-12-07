import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Search from "./pages/Search";
import AddProduct from "./pages/AddProduct";

const App = () => {
	// State dans lequel je stocke le token. Sa valeur de base sera :
	// - Si je trouve un cookie token, ce cookie
	// - Sinon, null
	const [token, setToken] = useState(
		Cookies.get("token") || null
		// Cookies.get("token") ? Cookies.get("token") : null
	);

	// Cette fonction permet de stocker le token dans le state et dans les cookies ou supprimer le token dans le state et dans les cookies
	const handleToken = (token) => {
		if (token) {
			Cookies.set("token", token, { expires: 15 });
			setToken(token);
		} else {
			Cookies.remove("token");
			setToken(null);
		}
	};

	return (
		<Router>
			<Routes>
				<Route path="/products" element={<Products />} />
				<Route path="/search" element={<Search token={token} />} />
				<Route path="/add/:id" element={<AddProduct token={token} />} />
				<Route path="/" element={<Home token={token} />} />
				<Route path="/signup" element={<Signup handleToken={handleToken} />} />
				<Route path="/login" element={<Login handleToken={handleToken} />} />
			</Routes>
		</Router>
	);
};

export default App;
