// src/routes/+layout.js
/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
  const res = await fetch('/config.json');
  if (!res.ok) {
    throw new Error(`Failed to fetch data from /config.json: ${res.statusText}`);
  }
  const config = await res.json();
  return {
    config
  };
}
