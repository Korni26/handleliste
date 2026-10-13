"use client";

import { FormEvent, useState } from "react";
import type { ShoppingListDefinition, ShoppingProduct } from "@/app/Utils/shoppingLists";
import styles from "./ListSelector.module.css";

type ListSelectorProps = {
  lists: ShoppingListDefinition[];
  products: ShoppingProduct[];
  activeListId: string;
  isBusy: boolean;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function ListSelector({
  lists,
  products,
  activeListId,
  isBusy,
  onSelect,
  onCreate,
  onDelete,
}: ListSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const active = lists.find((list) => list.id === activeListId);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setError("Skriv inn et listenavn.");
      return;
    }
    if (lists.some((list) => list.name.toLocaleLowerCase("nb") === name.toLocaleLowerCase("nb"))) {
      setError("En liste med dette navnet finnes allerede.");
      return;
    }
    setError("");
    try {
      await onCreate(name);
      setNewName("");
      setIsCreating(false);
    } catch {
      setError("Kunne ikke opprette listen. Prøv igjen.");
    }
  };

  return (
    <section className={styles.section} aria-label="Velg handleliste">
      <div className={styles.top}>
        <h2>Mine lister</h2>
        <button
          type="button"
          className={styles.add}
          disabled={isBusy}
          onClick={() => {
            setIsCreating((current) => !current);
            setError("");
          }}
        >
          {isCreating ? "Avbryt" : "+ Ny liste"}
        </button>
      </div>
      <div className={styles.tabs} role="group" aria-label="Handlelister">
        {lists.map((list) => {
          const remaining = products.filter((product) => product.listId === list.id && !product.isPurchased).length;
          return (
            <button
              type="button"
              key={list.id}
              className={list.id === activeListId ? styles.active : styles.tab}
              aria-pressed={list.id === activeListId}
              onClick={() => onSelect(list.id)}
            >
              <span>{list.name}</span>
              <span className={styles.count} aria-label={`${remaining} igjen`}>{remaining}</span>
            </button>
          );
        })}
      </div>
      {isCreating && (
        <form className={styles.createForm} onSubmit={submit}>
          <label htmlFor="new-list-name">Navn på ny liste</label>
          <div className={styles.createRow}>
            <input
              id="new-list-name"
              type="text"
              maxLength={32}
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="F.eks. Ferie"
              disabled={isBusy}
              autoFocus
            />
            <button type="submit" disabled={isBusy || !newName.trim()}>
              {isBusy ? "Lagrer..." : "Opprett"}
            </button>
          </div>
        </form>
      )}
      {active && !active.isDefault && (
        <button
          type="button"
          className={styles.deleteList}
          disabled={isBusy}
          onClick={() => { void onDelete(); }}
        >
          Slett listen «{active.name}»
        </button>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
