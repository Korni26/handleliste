import { ChangeEvent, useState } from "react";
import styles from "./Product.module.css";
import { useGetApiData } from "@/app/Hooks/useGetApiData";
import { ProductExtension } from "../ProductExtension/ProductExtension";

type ProductProps = {
  product: Product;
  handlePurchaseChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (productId: string) => void;
};

const Product = ({
  product,
  handlePurchaseChange,
  handleDelete,
}: ProductProps) => {
  const [isProductExtended, setIsProductExtended] = useState(false);
  const [productSearchResult, setProductSearchResult] = useState<
    ApiProductInfo[]
  >([]);

  const handleProductExtended = async () => {
    setIsProductExtended((prevState) => !prevState);
    if (productSearchResult.length === 0) {
      const apiData = await useGetApiData(product.name);
      setProductSearchResult(apiData.data);
    }
  };

  return (
    <li
      key={product.id}
      className={`${styles.product} ${
        isProductExtended && styles.product_extended
      } `}
    >
      <div className={styles.product_name}>
        <input
          type="checkbox"
          className={styles.checkbox}
          defaultChecked={product.isPurchased}
          id={product.id}
          onChange={(e) => handlePurchaseChange(e)}
        />
        {product.name}
      </div>
      <div className={styles.buttons}>
        <button
          className={`${
            isProductExtended ? styles.upwards_arrow : styles.downwards_arrow
          }`}
          onClick={handleProductExtended}
        >
          &#10140;
        </button>
        <button onClick={() => handleDelete(product.id)}>&#9932;</button>
      </div>
      {isProductExtended && (
        <ProductExtension productSearchResult={productSearchResult} />
      )}
    </li>
  );
};

export { Product };
