"use client";

import { useDeleteProduct } from "@/app/Hooks/useDeleteProduct";
import styles from "./ShoppingList.module.css";
import { useUpdateProduct } from "@/app/Hooks/useUpdateProduct";
import { ChangeEvent, useEffect, useState } from "react";
import { Product } from "../Product/Product";

type ShoppingListProps = {
  initialProducts: Product[];
  deleteProduct: (productId: string) => void;
};

const ShoppingList = ({
  initialProducts,
  deleteProduct,
}: ShoppingListProps) => {
  const [isSorted, setIsSorted] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAllProductsPurchased, setIsAllProductsPurchased] = useState(false);

  useEffect(() => {
    setIsAllProductsPurchased(products.every((product) => product.isPurchased));
  }, [products]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = (productId: string) => {
    useDeleteProduct(productId);
    deleteProduct(productId);
  };

  const handleSortChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSorted(e.target.checked);
  };

  const handlePurchaseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const productId = e.target.id;
    const productPurchasedValue = e.target.checked;

    useUpdateProduct(productId, productPurchasedValue);

    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, isPurchased: productPurchasedValue }
        : product
    );

    setProducts(updatedProducts);
  };

  const sortedPurchasedProducts = [...products].sort((a, b) => {
    if (a.isPurchased === b.isPurchased) return 0;

    return a.isPurchased === true ? 1 : -1;
  });

  return (
    <div
      className={`${styles.shopping_list} ${
        isAllProductsPurchased &&
        products.length > 0 &&
        styles.all_products_purchased
      }`}
    >
      <div className={styles.list_title}>
        <h1>Handleliste</h1>
        <div className={styles.sort}>
          <input onChange={handleSortChange} id="sort" type="checkbox" />
          <label htmlFor="sort">Sorter</label>
        </div>
      </div>
      <ul>
        {(isSorted ? sortedPurchasedProducts : products).map((product) => (
          <Product
            key={product.id}
            product={product}
            handlePurchaseChange={handlePurchaseChange}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export { ShoppingList };
