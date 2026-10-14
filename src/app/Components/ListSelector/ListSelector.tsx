"use client";

import { type FormEvent, useState } from "react";
import { LEGACY_LIST_ID, type ShoppingListDefinition, type ShoppingProduct } from "@/app/Utils/shoppingLists";
import styles from "./ListSelector.module.css";

type ListSelectorProps = {
  lists: ShoppingListDefinition[];
  products: ShoppingProduct[];
  activeListId: string;
  isBusy: boolean;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function ListSelector({
  lists,
  products,
  activeListId,
  isBusy,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: ListSelectorProps) {
  const [mode, setMode] = useState<"none" | "create" | "rename">("none");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const active = lists.find((list) => list.id === activeListId);
  const canEdit = !!active && active.id !== LEGACY_LIST_ID;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setError("Skriv inn et listenavn.");
      return;
    }
    if (lists.some((list) =>
      list.id !== (mode === "rename" ? activeListId : "") &&
      list.name.toLocaleLowerCase("nb") === name.toLocaleLowerCase("nb")
    )) {
      setError("En liste med dette navnet finnes allerede.");
      return;
    }

    setError("");
    try {
      if (mode === "rename") {
        await onRename(name);
      } else {
        await onCreate(name);
      }
      setNewName("");
      setMode("none");
    } catch {
      setError(mode === "rename" ? "Kunne ikke endre listenavnet." : "Kunne ikke opprette listen. Prøv igjen.");
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
            setMode((current) => current === "create" ? "none" : "create");
            setNewName("");
            setError("");
          }}
        >
          {mode === "create" ? "Avbryt" : "+ Ny liste"}
        </button>
      </div>
      <div className={styles.tabs} role="group" aria-label="Handlelister">
        {lists.map((list) => {
          const remaining = products.filter((product) => product.listId === list.id && !product.isPurchased).length;
          return (
            <button
              type="button"
              key={list.id}
              disabled={isBusy}
              className={list.id === activeListId ? styles.active : styles.tab}
              aria-pressed={list.id === activeListId}
              onClick={() => {
                onSelect(list.id);
                setMode("none");
                setError("");
              }}
            >
              <span>{list.name}</span>
              <span className={styles.count} aria-label={`${remaining} igjen`}>{remaining}</span>
            </button>
          );
        })}
      </div>
      {mode !== "none" && (
        <form className={styles.createForm} onSubmit={submit}>
          <label htmlFor="new-list-name">{mode === "rename" ? "Endre listenavn" : "Navn på ny liste"}</label>
          <div className={styles.createRow}>
            <input
              id="new-list-name"
              type="text"
              maxLength={32}
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder={mode === "rename" ? "Nytt listenavn" : "F.eks. Dagligvarer"}
              disabled={isBusy}
              autoFocus
            />
            <button type="submit" disabled={isBusy || !newName.trim()}>
              {isBusy ? "Lagrer..." : mode === "rename" ? "Lagre" : "Opprett"}
            </button>
          </div>
        </form>
      )}
      {canEdit && (
        <div className={styles.listActions}>
          <button
            type="button"
            className={styles.renameList}
            disabled={isBusy}
            onClick={() => {
              setMode((current) => current === "rename" ? "none" : "rename");
              setNewName(active.name);
              setError("");
            }}
          >
            Gi «{active.name}» nytt navn
          </button>
          <button
            type="button"
            className={styles.deleteList}
            disabled={isBusy}
            onClick={() => { void onDelete(); }}
          >
            Slett listen «{active.name}»
          </button>
        </div>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
