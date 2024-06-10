<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Field {
    title: string;
    field: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    validation?: string;
    min?: number;
    max?: number;
    options?: number[]; // Added options for radio buttons
  }

  export let fields: Field[] = [];
  export let data: { [key: string]: any } = {};

  const dispatch = createEventDispatcher();

  const tempValues: { [key: string]: any } = {};

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  };

  const handleInputChange = (field: Field, event: Event) => {
    const input = event.target as HTMLInputElement;
    setNestedValue(tempValues, field.field, input.value);
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const dataObj: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      setNestedValue(dataObj, key, value);
    });
    dispatch("submit", dataObj);
  };
</script>

<form on:submit={handleSubmit}>
  {#each fields as field, index}
    {#if field.type === "radio"}
      <div>
        <label>{field.title}</label>
        {#each field.options as option}
          <div>
            <input
              type="radio"
              name={field.field}
              value={option}
              required={field.required}
              checked={getNestedValue(data, field.field) == option}
            />
            <label>{option}</label>
          </div>
        {/each}
      </div>
    {:else if field.type === "textarea"}
      <div>
        <label>{field.title}</label>
        <textarea
          name={field.field}
          placeholder={field.placeholder}
          required={field.required}
          value={getNestedValue(data, field.field)}
          on:input={handleInputChange.bind(null, field)}
        ></textarea>
      </div>
    {:else}
      <div>
        <label>{field.title}</label>
        <input
          type={field.type}
          name={field.field}
          placeholder={field.placeholder}
          required={field.required}
          pattern={field.validation || null}
          min={field.min || null}
          max={field.max || null}
          value={getNestedValue(data, field.field)}
          on:input={handleInputChange.bind(null, field)}
        />
      </div>
    {/if}
  {/each}
  <button type="submit">Submit</button>
</form>
