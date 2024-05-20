<script lang=ts>
    import { onMount, onDestroy } from 'svelte';
    let fullTextContainer: HTMLDivElement;
  
    function showFullText() {
      fullTextContainer.style.visibility = 'visible';
    }
  
    function hideFullText() {
      fullTextContainer.style.visibility = 'hidden';
    }
  
    // Add event listeners on mount and clean up on destroy
    onMount(() => {
      document.addEventListener('mousemove', positionFullTextContainer);
      return () => {
        document.removeEventListener('mousemove', positionFullTextContainer);
      };
    });
  
    function positionFullTextContainer(event: MouseEvent) {
      const { clientX, clientY } = event;
      fullTextContainer.style.left = `${clientX}px`;
      fullTextContainer.style.top = `${clientY}px`;
    }
  </script>
  
  <style>
    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .full-text {
      position: fixed;
      visibility: hidden;
      background-color: white;
      border: 1px solid #ccc;
      padding: 5px;
      z-index: 1000;
    }
  </style>
  
  <div class="text" on:mouseover={showFullText} on:mouseout={hideFullText}>
    <slot></slot>
  </div>
  
  <div class="full-text" bind:this={fullTextContainer}>
    <slot></slot>
  </div>
  