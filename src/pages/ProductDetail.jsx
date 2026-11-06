import { Link, useNavigate, useParams } from "react-router";
import { fetchProduct } from "../api/productsApi";
import { useFetch } from "../hooks/useFetch";
import { selectAddItem, useCartStore } from "../store/cartStore";

export default function ProductDetail() {
  // id always comes from the URL as a string, e.g. "3" not 3
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(selectAddItem);

  // id is a dependency, so going from /products/3 to /products/4
  // aborts the old request and loads the new product
  const { loading, error, data: product } = useFetch(
    (signal) => fetchProduct(id, signal),
    [id]
  );

  // convert before doing math, otherwise "3" + 1 would be "31"
  const numericId = Number(id);
  const hasNumericId = Number.isInteger(numericId) && numericId > 0;

  function goBack() {
    navigate("/products");
  }

  let content;
  if (loading) {
    content = <p>Loading product...</p>;
  } else if (error) {
    const notFound = error.status === 404 || error.status === 400;
    content = (
      <div>
        <h1>{notFound ? "Product not found" : "Something went wrong"}</h1>
        <p className="error">
          {notFound
            ? `There is no product with id "${id}".`
            : `Could not load the product: ${error.message}`}
        </p>
      </div>
    );
  } else {
    content = (
      <article className="detail">
        <img src={product.thumbnail} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p className="muted">{product.category}</p>
          <p>{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <button type="button" onClick={() => addItem(product)}>
            Add to cart
          </button>
        </div>
      </article>
    );
  }

  return (
    <section>
      <div className="detail-nav">
        <button type="button" onClick={goBack}>
          &larr; Back to products
        </button>
        {hasNumericId && (
          <span className="detail-pager">
            {numericId > 1 && (
              <Link to={`/products/${numericId - 1}`}>Previous product</Link>
            )}
            <Link to={`/products/${numericId + 1}`}>Next product</Link>
          </span>
        )}
      </div>
      {content}
    </section>
  );
}
