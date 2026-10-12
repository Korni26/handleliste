import styles from "./Product.module.css";

type ProductProps = {
  product: Product;
  disabled?: boolean;
  handlePurchaseChange: (productId: string, purchased: boolean) => void;
  handleDelete: (productId: string) => void;
};

const Product = ({ product, disabled = false, handlePurchaseChange, handleDelete }: ProductProps) => (
  <li className={styles.product}>
    <div className={styles.product_name}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={!!product.isPurchased}
        id={product.id}
        disabled={disabled}
        onChange={(event) => handlePurchaseChange(product.id, event.target.checked)}
      />
      <label htmlFor={product.id}>{product.name}</label>
    </div>
    <div className={styles.buttons}>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Slett ${product.name}`}
        onClick={() => handleDelete(product.id)}
      >
        &#9932;
      </button>
    </div>
  </li>
);

export { Product };
