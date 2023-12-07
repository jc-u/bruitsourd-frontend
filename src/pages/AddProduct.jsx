import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = ({ token }) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [artist, setArtist] = useState("");
	const [album, setAlbum] = useState("");
	const [format, setFormat] = useState("");
	const [color, setColor] = useState("");
	const [purchasePrice, setPurchasePrice] = useState(0);
	const [publicPrice, setPublicPrice] = useState(0);
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [release_id, setReleaseId] = useState("");
	const [label, setLabel] = useState("");
	const [fournisseur, setFournisseur] = useState("");
	const [genre, setGenre] = useState("");
	const [style, setStyle] = useState("");
	const [year, setYear] = useState("");
	const [country, setCountry] = useState("");
	const [estimatedWeight, setEstimatedWeight] = useState("");
	const [thumb, setThumb] = useState("");
	const [images, setImages] = useState("");
	const [more_images, setMoreImages] = useState(null);
	const [tracklist, setTracklist] = useState("");
	const [video, setVideo] = useState("");
	const [uri, setUri] = useState("");
	const [condition, setCondition] = useState("Mint(M)");
	const [condition_sleeve, setConditionSleeve] = useState("Mint (M)");
	const [comments, setComments] = useState("");
	const [publish, setPublish] = useState(false);
	const [status, setStatus] = useState("For Sale");

	const navigate = useNavigate();

	// Mettez à jour la valeur de publicPrice chaque fois que purchasePrice change
	useEffect(() => {
		const newPublicPrice =
			purchasePrice === 0
				? 0
				: purchasePrice % 1 <= 0.3
				? Math.floor(purchasePrice) + 4
				: Math.ceil(purchasePrice) + 4;
		setPublicPrice(newPublicPrice);

		const newPrice =
			(Math.ceil(publicPrice) * 0.14 + publicPrice) % 1 <= 0.5
				? Math.floor(Math.ceil(publicPrice) * 0.14 + publicPrice)
				: Math.ceil(Math.ceil(publicPrice) * 0.14 + publicPrice);
		setPrice(newPrice);
	}, [publicPrice, purchasePrice]);

	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const { data } = await axios.get(`http://localhost:3000/search/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(data);
				setData(data);
				setArtist(data.artists[0].name);
				setAlbum(data.title);
				setFormat(data.formats[0].name);
				setColor(data.formats[0].text);
				setPurchasePrice(0);
				setPublicPrice(0);
				setPrice(0);
				setQuantity(1);
				setReleaseId(data.id);
				setLabel(data.labels.map((label) => [label.name]));
				setFournisseur("");
				setGenre(data.genres.map((genre) => [genre]));
				setStyle(data.styles.map((style) => [style]));
				setYear(data.year);
				setCountry(data.country);
				setEstimatedWeight(data.estimated_weight);
				setThumb(data.thumb);
				setImages(data.images[0].uri);
				setMoreImages(null);
				setTracklist(data.tracklist.map((track) => [track.title]));
				setVideo(
					data.videos && data.videos.length > 0
						? data.videos.map((video) => [video.uri])
						: ""
				);
				setUri(data.uri);
				setCondition("Mint (M)");
				setConditionSleeve("Mint (M)");
				setComments("");
				setPublish(false);
				setStatus("For Sale");
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [id, token]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append("artist", artist);
			formData.append("album", album);
			formData.append("format", format);
			formData.append("color", color);
			formData.append("purchasePrice", purchasePrice);
			formData.append("publicPrice", publicPrice);
			formData.append("price", price);
			formData.append("quantity", quantity);
			formData.append("releaseId", release_id);
			formData.append("fournisseur", fournisseur);
			for (let i = 0; i < label.length; i++) {
				formData.append("label", label[i]);
			}
			for (let i = 0; i < genre.length; i++) {
				formData.append("genre", genre[i]);
			}
			for (let i = 0; i < style.length; i++) {
				formData.append("style", style[i]);
			}
			formData.append("year", year);
			formData.append("country", country);
			formData.append("estimatedWeight", estimatedWeight);
			formData.append("thumb", thumb);
			formData.append("images", images);
			if (more_images) {
				for (let i = 0; i < more_images.length; i++) {
					formData.append("moreImages", more_images[i]);
				}
			}
			for (let i = 0; i < tracklist.length; i++) {
				formData.append("tracklist", tracklist[i]);
			}
			if (video) {
				for (let i = 0; i < video.length; i++) {
					formData.append("video", video[i]);
				}
			}
			formData.append("uri", uri);
			formData.append("condition", condition);
			formData.append("conditionSleeve", condition_sleeve);
			formData.append("comments", comments);
			formData.append("publish", publish);
			formData.append("status", status);

			if (publish) {
				const publishData = new FormData();
				publishData.append("release_id", parseInt(release_id));
				publishData.append("condition", condition);
				publishData.append("price", parseFloat(price));
				publishData.append("status", status);
				publishData.append("comments", comments);
				publishData.append("sleeve_condition", condition_sleeve);

				const response = await axios.post(
					`http://localhost:3000/publish`,
					publishData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log(response.data);
			}

			// Après avoir récupéré les données et mis à jour l'état, effectuez la requête POST
			const response = await axios.post(
				`http://localhost:3000/product`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			navigate("/products");
			console.log(response.data);
		} catch (error) {
			console.log(error.response);
		}
	};

	return isLoading ? (
		<span>En cours de chargement...</span>
	) : (
		<div>
			<h1>Add</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="artist">Artist</label>
				<input
					type="text"
					name="artist"
					id="artist"
					value={artist}
					onChange={(event) => {
						setArtist(event.target.value);
					}}
				/>
				<label htmlFor="album">Album</label>
				<input
					type="text"
					name="album"
					id="album"
					value={album}
					onChange={(event) => {
						setAlbum(event.target.value);
					}}
				/>
				<label htmlFor="format">Format</label>
				<input
					type="text"
					name="format"
					id="format"
					value={format}
					onChange={(event) => {
						setFormat(event.target.value);
					}}
				/>
				<label htmlFor="color">Color</label>
				<input
					type="text"
					name="color"
					id="color"
					value={color}
					onChange={(event) => {
						setColor(event.target.value);
					}}
				/>
				<label htmlFor="puchase_price">Purchase Price</label>
				<input
					type="number"
					name="purchase_price"
					id="purchase_price"
					value={purchasePrice}
					onChange={(event) => {
						setPurchasePrice(event.target.value);
					}}
				/>
				<label htmlFor="public_price">Public Price</label>
				<input
					type="number"
					name="public_price"
					id="public_price"
					value={publicPrice}
					onChange={(event) => {
						setPublicPrice(event.target.value);
					}}
				/>
				<label htmlFor="price">Price Discogs</label>
				<input
					type="number"
					name="price"
					id="price"
					value={price}
					onChange={(event) => {
						setPrice(event.target.value);
					}}
				/>
				<label htmlFor="quantity">Quantity</label>
				<input
					type="number"
					name="quantity"
					id="quantity"
					value={quantity}
					onChange={(event) => {
						setQuantity(event.target.value);
					}}
				/>
				<label htmlFor="release_id">Release Id</label>
				<input
					type="text"
					name="release_id"
					id="release_id"
					value={release_id}
					onChange={(event) => {
						setReleaseId(event.target.value);
					}}
				/>
				<label htmlFor="fournisseur">Fournisseur</label>
				<input
					type="text"
					name="fournisseur"
					id="fournisseur"
					value={fournisseur}
					onChange={(event) => {
						setFournisseur(event.target.value);
					}}
				/>
				<label htmlFor="label"> Label</label>
				<input
					type="text"
					name="label"
					id="label"
					value={label}
					onChange={(event) => {
						const newLabel = event.target.value.split(",");
						setLabel(newLabel);
					}}
				/>
				<label htmlFor="genre">Genre</label>
				<input
					type="text"
					name="genre"
					id="genre"
					value={genre}
					onChange={(event) => {
						const newGenre = event.target.value.split(",");
						setGenre(newGenre);
					}}
				/>
				<label htmlFor="style">Style</label>
				<input
					type="text"
					name="style"
					id="style"
					value={style}
					onChange={(event) => {
						const newStyle = event.target.value.split(",");
						setStyle(newStyle);
					}}
				/>
				<label htmlFor="year">Year</label>
				<input
					type="text"
					name="year"
					id="year"
					value={year}
					onChange={(event) => {
						setYear(event.target.value);
					}}
				/>
				<label htmlFor="country">Country</label>
				<input
					type="text"
					name="country"
					id="country"
					value={country}
					onChange={(event) => {
						setCountry(event.target.value);
					}}
				/>
				<label htmlFor="estimated_weight">Estimated Weight</label>
				<input
					type="text"
					name="esimated_weight"
					id="estimated_weight"
					value={estimatedWeight}
					onChange={(event) => {
						setEstimatedWeight(event.target.value);
					}}
				/>
				<label htmlFor="thumb">Thumbnail</label>
				{data && data.thumb && <img src={thumb} alt="album" />}

				<label htmlFor="images">Images</label>
				{data &&
					data.images &&
					data.images.map((image) => (
						<img key={image.uri} src={image.uri} alt={image.type} />
					))}

				<label htmlFor="more_images">More Images</label>
				<input
					type="file"
					name="more_images"
					id="more_images"
					multiple
					onChange={(event) => {
						if (event.target.files) {
							setMoreImages(event.target.files);
						}
					}}
				/>

				<label htmlFor="tracklist">Tracklist</label>
				<textarea
					name="tracklist"
					id="tracklist"
					cols="25"
					rows="20"
					value={tracklist}
					onChange={(event) => {
						const newTracklist = event.target.value.split(",");
						setTracklist(newTracklist);
					}}
				/>
				<label htmlFor="video">Vidéo</label>
				<input
					type="text"
					name="video"
					id="video"
					value={video}
					onChange={(event) => {
						const newVideo = event.target.value.split(",");
						setVideo(newVideo);
					}}
				/>
				<label htmlFor="uri">Lien</label>
				<input
					type="text"
					name="uri"
					id="uri"
					value={uri}
					onChange={(event) => {
						setUri(event.target.value);
					}}
				/>
				<label htmlFor="condition">Condition</label>
				<select
					name="condition"
					id="condition"
					value={condition}
					onChange={(event) => {
						setCondition(event.target.value);
					}}>
					<option value="Mint (M)">Mint (M)</option>
					<option value="Near Mint (NM or M-)">Near Mint (NM or M-)</option>
					<option value="Very Good (VG+)">Very Good (VG+)</option>
					<option value="Very Good (VG)">Very Good (VG)</option>
					<option value="Good Plus (G+)">Good Plus (G+)</option>
					<option value="Good (G)">Good (G)</option>
					<option value="Fair (F)">Fair (F)</option>
					<option value="Poor (P)">Poor (P)</option>
				</select>
				<label htmlFor="condition_sleeve">Condition Sleeve</label>
				<select
					name="condition_sleeve"
					id="condition_sleeve"
					value={condition_sleeve}
					onChange={(event) => {
						setConditionSleeve(event.target.value);
					}}>
					<option value="Mint (M)">Mint (M)</option>
					<option value="Near Mint (NM or M-)">Near Mint (NM or M-)</option>
					<option value="Very Good (VG+)">Very Good (VG+)</option>
					<option value="Very Good (VG)">Very Good (VG)</option>
					<option value="Good Plus (G+)">Good Plus (G+)</option>
					<option value="Good (G)">Good (G)</option>
					<option value="Fair (F)">Fair (F)</option>
					<option value="Poor (P)">Poor (P)</option>
				</select>
				<label htmlFor="comments"></label>
				<textarea
					name="comments"
					id="comments"
					cols="30"
					rows="10"
					value={comments}
					onChange={(event) => {
						setComments(event.target.value);
					}}></textarea>
				<label htmlFor="status">Status</label>
				<input
					type="text"
					name="status"
					id="status"
					value={status}
					onChange={(event) => {
						setStatus(event.target.value);
					}}
				/>
				<label htmlFor="status">Publication Discogs</label>
				<input
					type="checkbox"
					name="publish"
					id="publish"
					checked={publish}
					onChange={(event) => {
						setPublish(event.target.checked);
					}}
				/>
				<button type="submit">Ajouter</button>
			</form>
		</div>
	);
};

export default AddProduct;
