<script>
	import { wiki } from '$lib/utilities/wiki';
    import { onMount } from 'svelte';
  
    let searchInput = '';
  
  
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const initialSearch = urlParams.get('q'); //TODO
      if (initialSearch) {
        searchInput = initialSearch;
        search();
      }
    });
  
    function search() {
      const results = []
      for (let [key, page] of wiki.entries()) {
        if (page.markdown.includes(searchInput)) {
            results.push(key)
        }
      }
      console.log(results);
      // You can do something with the results here, like updating a list to display them
    }
  </script>
  
  <h1>Search Page</h1>
  
  <input type="text" bind:value={searchInput} on:input={search} placeholder="Search...">
  <button on:click={search}>Search</button>
  <!-- TODO -->
  
  <style>
    input, button {
      margin: 5px;
    }
  </style>
  