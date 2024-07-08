
<script lang="ts">
    // Import necessary Svelte and TypeScript components
    import { onMount } from 'svelte';
    import type { SvelteComponent } from 'svelte';
    
    // Define prop types
    interface Unit {
      name: string;
      toBase: (value: number) => number;
      fromBase: (value: number) => number;
    }
  
    export let systems: Unit[];
    let baseUnit = systems[0]
    let otherUnits = systems.slice(1);
  
    let sampleValues: number[] = [1, 5, 10, 15, 20, 30, 50, 100, 1000];
  
    // Array to store converted values
    let convertedValues: number[][] = [];
  
    // Function to convert sample values
    function convertSampleValues() {
      convertedValues = sampleValues.map((value) => [
        value,
        ...otherUnits.map((unit) => unit.fromBase(baseUnit.toBase(value))),
      ]);
    }
  
    // Convert sample values on component mount
    onMount(() => {
      convertSampleValues();
    });
  </script>
  
  <style lang="scss">
    /* SCSS styles */
    .unit-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
  
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: center;
      }
  
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
    }
  </style>
  
  <table class="unit-table">
    <thead>
      <tr>
        <th>{ baseUnit.name }</th>
        {#each otherUnits as unit}
          <th>{ unit.name }</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each convertedValues as row}
        <tr>
          {#each row as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  