<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Unit {
    name: string;
    toBase: (value: number) => number;
    fromBase: (value: number) => number;
  }

  export let systems: Unit[];
  let baseUnit = systems[0]
  let otherUnits = systems.slice(1);

  let sampleValues: number[] = [1, 5, 10, 15, 20, 30, 50, 100, 1000];
  let convertedValues: number[][] = [];
  let inputValue: number = 1;
  let inputConvertedValues: number[] = [];

  function convertSampleValues() {
    convertedValues = sampleValues.map((value) => [
      value,
      ...otherUnits.map((unit) => unit.fromBase(baseUnit.toBase(value))),
    ]);
  }

  function convertInputValue() {
    inputConvertedValues = [
      inputValue,
      ...otherUnits.map((unit) => unit.fromBase(baseUnit.toBase(inputValue))),
    ];
  }

  onMount(() => {
    convertSampleValues()
    convertInputValue()
  });
</script>

<style lang="scss">
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
    <tr>
      <td><input type="number" bind:value={inputValue} on:input={convertInputValue} /></td>
      {#each inputConvertedValues.slice(1) as cell}
        <td>{cell}</td>
      {/each}
    </tr>
    {#each convertedValues as row}
      <tr>
        {#each row as cell}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
