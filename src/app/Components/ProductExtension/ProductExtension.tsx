import { ChangeEvent } from "react";
import styles from "./ProductExtension.module.css";

type ProductExtensionProps = {
  productSearchResult: ApiProductInfo[];
  chosenProduct: ApiProductInfo | undefined
  setChosenProduct: (product: ApiProductInfo ) => void
};

const ProductExtension = ({ productSearchResult, chosenProduct, setChosenProduct }: ProductExtensionProps) => {

  const hadnleSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const chosenProduct = productSearchResult.find(
      (product: ApiProductInfo) => product.id === Number(e.target.value)
    );
    if (chosenProduct) {
      setChosenProduct(chosenProduct)
    }
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

      {chosenProduct && (
        <>
          <h3>{chosenProduct.name}</h3>
          <p>
            {chosenProduct.store.name} - {""}
            {chosenProduct.current_price} kr
          </p>
        </>
      )}
    </div>
  );
};

export { ProductExtension };
