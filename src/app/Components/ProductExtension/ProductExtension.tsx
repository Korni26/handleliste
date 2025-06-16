import { ChangeEvent, useState } from "react";
import styles from "./ProductExtension.module.css";

type ProductExtensionProps = {
  productSearchResult: ApiProductInfo[];
};

const ProductExtension = ({ productSearchResult }: ProductExtensionProps) => {
  const [productDescription, setProductDescription] =
    useState<ApiProductInfo>();

  const hadnleSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const chosenProduct = productSearchResult.find(
      (product: ApiProductInfo) => product.id === Number(e.target.value)
    );
    console.log(chosenProduct);
    setProductDescription(chosenProduct);
  };

  return (
    <div className={styles.product_extension}>
      <select name="" id="" onChange={(e) => hadnleSelectChange(e)}>
        <option value="">Velg et produkt</option>
        {productSearchResult &&
          productSearchResult.map((product: ApiProductInfo) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
      </select>

      {productDescription && (
        <>
          <h3>{productDescription.name}</h3>
          <p>
            {productDescription.store.name} - {""}
            {productDescription.current_price} kr
          </p>
        </>
      )}
    </div>
  );
};

export { ProductExtension };
