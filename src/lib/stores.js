import { writable } from 'svelte/store';

// Initializing the writable store with default values
export const dataStore = writable({
  users: [],
  brands: [],
  products: [],
  reviews: [],
  columns: [],
  forms: [],
  loading: true,
});

// Function to fetch JSON data from a given URL
const fetchJsonData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
  }
  return await response.json();
};

// Function to fetch all component data based on the configuration
const fetchComponentData = async (components, baseUrl) => {
  const componentPromises = components.map(async (component) => {
    const data = await fetchJsonData(baseUrl + component.data);
    return { id: component.id, data };
  });

  const componentsData = await Promise.all(componentPromises);

  return componentsData.reduce((acc, component) => {
    acc[component.id] = component.data;
    return acc;
  }, {});
};

// Function to fetch additional data (columns and forms)
const fetchAdditionalData = async () => {
  const [columns, forms, charts] = await Promise.all([
    fetchJsonData("/data/columns.json"),
    fetchJsonData("/data/forms.json"),
    fetchJsonData("/data/charts.json"),
  ]);

  return { columns, forms, charts };
};

// Main function to load all data and update the store
export const loadData = async () => {
  try {
    // Fetch the configuration file
    const config = await fetchJsonData("/data/config.json");
    const baseUrl = '/data/';

    // Fetch component data and additional data concurrently
    const [componentData, additionalData] = await Promise.all([
      fetchComponentData(config.components, baseUrl),
      fetchAdditionalData(),
    ]);

    // Update the data store with the fetched data
    dataStore.set({
      ...componentData,
      ...additionalData,
      loading: false,
    });
  } catch (error) {
    console.error("Error loading data:", error.message);
    dataStore.set({ loading: false });
  }
};
