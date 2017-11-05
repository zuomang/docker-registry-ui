<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <a class="navbar-brand" href="#">Docker Registry UI</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="clusterlist" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">cluster</a>
            <div class="dropdown-menu" aria-labelledby="clusterlist">
              <a class="dropdown-item" href="#">list</a>
              <a class="dropdown-item" href="#">add</a>
            </div>
          </li>
      </ul>
      <form class="form-inline mt-2 mt-md-0">
        <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
</template>

<style>
  body {
    min-height: 75rem;
    padding-top: 4.5rem;
  }
</style>

<script>
export default {
  name: 'app',
}
</script>