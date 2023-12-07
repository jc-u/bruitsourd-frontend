import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = ({ handleToken }) => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			setErrorMessage("");
			const response = await axios.post("http://localhost:3000/admin/signup", {
				email: email,
				username: username,
				password: password,
			});
			//   Cookies.set("token", response.data.token, { expires: 15 });
			// J'enregistre le token dans mon state et mes cookies
			handleToken(response.data.token);
			// Je navigue vers ma page /
			navigate("/");
		} catch (error) {
			console.log("erreur", error.response);

			if (error.response.data.message === "Missing parameters") {
				setErrorMessage("Veuillez remplir tous les champs");
			} else if (error.response.status === 409) {
				setErrorMessage("Cet email possède déjà un compte");
			}
		}
	};

	return (
		<div className="signup-container">
			<h2>S'inscrire</h2>
			<form className="signup-form" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Nom d'utilisateur"
					value={username}
					onChange={(event) => {
						setUsername(event.target.value);
					}}
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(event) => {
						setEmail(event.target.value);
					}}
				/>

				<input
					type="password"
					placeholder="Mot de passe"
					value={password}
					onChange={(event) => {
						setPassword(event.target.value);
					}}
				/>
				<span className="signup-login-error-message">{errorMessage}</span>

				<button type="submit">S'inscrire</button>
			</form>
			<Link to="/login">Tu as déjà un compte ? Connecte-toi !</Link>
		</div>
	);
};

export default Signup;
