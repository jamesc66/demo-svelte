import { writable } from 'svelte/store';

export const dataStore = writable({
  users: [],
  brands: [],
  products: [],
  reviews: [],
  columns: [],
  loading: true,
});

export const loadData = async () => {
  const usersRes = await fetch("/data/users.json");
  const brandsRes = await fetch("/data/brands.json");
  const productsRes = await fetch("/data/products.json");
  const reviewsRes = await fetch("/data/reviews.json");
  const columnsRes = await fetch("/data/columns.json");
  
  const users = await usersRes.json();
  const brands = await brandsRes.json();
  const products = await productsRes.json();
  const reviews = await reviewsRes.json();
  const columns = await columnsRes.json();

  dataStore.set({
    users,
    brands,
    products,
    reviews,
    columns,
    loading: false,
  });
};
