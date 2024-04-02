import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import AddProduct from "../../components/AddProduct";

const Search = ({ token }) => {
	const [query, setQuery] = useState("");
	const [pagination, setPagination] = useState({ page: 1, per_page: 100 });
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState(null);

	const handleNextPage = () => {
		setPagination({ ...pagination, page: pagination.page + 1 });
	};

	const handlePreviousPage = async () => {
		if (pagination.page > 1) {
			const newPage = pagination.page - 1;
			setPagination((prevPagination) => ({
				...prevPagination,
				page: newPage,
			}));
			// Ensuite, envoyez la requête à l'API avec la nouvelle page
			handleInputChange(null, newPage);
		}
	};

	const handleInputChange = async (event, page = pagination.page) => {
		if (event) event.preventDefault();
		setData(null); // Réinitialise les données
		setIsLoading(true);
		try {
			const { data } = await axios.get("http://localhost:3000/search", {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
				params: {
					query: query,
					page: Number(page),
					per_page: Number(pagination.per_page),
				},
			});
			console.log(data);
			setData(data);
		} catch (error) {
			// handle error
		}
		setIsLoading(false);
		setModalIsOpen(false); // Ferme la modal
	};

	const handleAddProduct = (productId) => {
		setSelectedProductId(productId);
		setModalIsOpen(true);
		setQuery(""); // Réinitialise la query
	};

	return (
		<div>
			<h1>Search</h1>
			<form onSubmit={handleInputChange}>
				<input
					type="text"
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
					}}
				/>
				<button type="submit">Rechercher</button>
				<button onClick={handlePreviousPage} disabled={pagination.page === 1}>
					Page précédente
				</button>
				<div>
					Nombre d'items : {data?.pagination?.items ? data.pagination.items : 0}
				</div>
				<div>Page : {pagination.page}</div>
				<div>
					Nombre de pages :{data?.pagination?.pages ? data.pagination.pages : 0}
				</div>
				<button
					onClick={handleNextPage}
					disabled={pagination.page === data?.pagination?.pages || 1}>
					Page suivante
				</button>
			</form>

			{isLoading ? (
				<span>En cours de chargement...</span>
			) : (
				data &&
				data.results &&
				data.results.map((result) => (
					<div key={result.id}>
						<div>
							<Link onClick={() => handleAddProduct(result.id)}>
								<div>{result.id}</div>
								<div>{result.barcode}</div>
								<img src={result.thumb} alt={result.title} />
								<div>{result.title}</div>
								<div>
									{result.format && result.format.length > 0
										? result.format[0]
										: "N/A"}
								</div>
							</Link>
							<div>
								<a href={`https://www.discogs.com${result.uri}`}>
									Voir plus de détails
								</a>
							</div>
						</div>
						<Modal
							isOpen={selectedProductId === result.id && modalIsOpen}
							onRequestClose={() => {
								setSelectedProductId(null);
								setModalIsOpen(false);
							}}>
							<button onClick={() => setModalIsOpen(false)}>X</button>
							<AddProduct
								token={token}
								id={selectedProductId}
								setModalIsOpen={setModalIsOpen}
							/>
						</Modal>
					</div>
				))
			)}
		</div>
	);
};

export default Search;
