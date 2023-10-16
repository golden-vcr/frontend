<script lang="ts">
  import NavContent from './NavContent.svelte'

  export let showAdminLinks: boolean

  let isMenuOpen = false
  const toggleMenu = () => { isMenuOpen = !isMenuOpen }
  const closeMenu = () => { isMenuOpen = false }
</script>

<header>
  <nav>
    <NavContent onClick={closeMenu} {showAdminLinks} />
  </nav>
  <div class="menu-toggle">
    <button on:click={toggleMenu}>
      {'\u2630'}
    </button>
  </div>
{#if isMenuOpen}
  <div class="menu">
    <div
      tabindex="0"
      role="button"
      class="menu-close-bar"
      on:click={closeMenu}
      on:keypress={closeMenu}
    >
      {'\u2716'}
    </div>
    <div class="menu-content">
      <NavContent onClick={closeMenu} {showAdminLinks} isVertical />
    </div>
  </div>
{/if}
</header>

<style>
  header, nav {
    display: flex;
    align-items: center;
  }
  nav {
    flex: 1;
    padding: 0.5rem 1rem;
    padding-left: 0.5rem;
  }
  :global(nav a) {
    color: white;
  }
  :global(nav a):hover {
    color: #dedede;
  }
  :global(.pages a) {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
  }
  :global(.pages a):hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  .menu-toggle {
    display: none;
  }
  .menu-toggle button {
    line-height: 1;
    font-size: 1.25rem;
    padding: 0.6em 0.8em;
    margin: 0.25rem;
  }
  .menu {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column;
  }
  .menu-close-bar {
    flex: 0 0 56px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    padding-right: 1rem;
  }
  .menu-close-bar, .menu-content {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .menu-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }
  :global(.menu-content .pages) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  :global(.menu-content .pages a) {
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.05);
  }
  :global(.menu-content a) {
    color: white;
  }
  @media only screen and (max-width: 420px) {
    nav {
      display: none;
    }
    .menu-toggle, .menu {
      display: flex;
    }
  }
</style>
