import { useState, useEffect } from "react";
import axios from "axios";

const Products = ({ token }) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get("http://localhost:3000/products", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(data);
				setData(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchData();
	}, [token]);

	return isLoading ? (
		<span>En cours de chargement...</span>
	) : (
		<div>
			<h1>Products</h1>

			{data.products.map((product) => {
				return (
					<div key={product._id}>
						<div>{product.reference}</div>
						<div>{product.artist}</div>
						<div>{product.album}</div>
						<div>{product.format}</div>
						<div>{product.price} €</div>
						<div>{product.quantity}</div>
						<div>{product.release_id}</div>
						<div>{product.fournisseur}</div>
						<div>{product.label}</div>
						<div>{product.style}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Products;
