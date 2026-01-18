import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProduct = async () => {
      try {
        setLoading(true);
        setLoading2(true);

        const res = await fetch(
          `https://fakestoreapi.com/products/${id}`,
          { signal }
        );
        const data = await res.json();
        setProduct(data);
        setLoading(false);

        const res2 = await fetch(
          `https://fakestoreapi.com/products/category/${data.category}`,
          { signal }
        );
        const data2 = await res2.json();
        setSimilarProducts(data2);
        setLoading2(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    };

    getProduct();
    return () => controller.abort();
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-2">
      <Skeleton height={400} />
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.title} height="400" />
        </div>
        <div className="col-md-6">
          <h1>{product.title}</h1>
          <h3>${product.price}</h3>
          <p>{product.description}</p>
          <button
            className="btn btn-dark"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? <Loading /> : <ShowProduct />}

      <h2 className="text-center my-4">You may also like</h2>
      <Marquee pauseOnHover speed={50}>
        {loading2
          ? <Skeleton height={300} width={200} />
          : similarProducts.map((item) => (
              <div key={item.id} className="card mx-3">
                <img src={item.image} alt={item.title} height={200} />
                <Link to={`/product/${item.id}`} className="btn btn-dark">
                  Buy Now
                </Link>
              </div>
            ))}
      </Marquee>
    </>
  );
};

export default Product;
