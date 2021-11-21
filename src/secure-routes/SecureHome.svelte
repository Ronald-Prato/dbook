<script>
  import { onMount } from 'svelte';
  import { user } from '../gun';
  import Home from '../pages/Home.svelte'
  import {navigate} from 'svelte-routing'

  let canShow = false;

  onMount(() => {
    if (!user.is) {
      navigate('/');
      return;
    }

    canShow = true
  })
</script>

<main>
  {#if canShow}
    <Home />
  {/if}
</main>