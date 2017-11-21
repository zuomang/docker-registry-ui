<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <router-link class="navbar-brand" to="/">Docker Registry UI</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="clusterlist" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">cluster</a>
              <div class="dropdown-menu" aria-labelledby="clusterlist">
                <router-link class="dropdown-item" to="/">list</router-link>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#addRegistryModal">add</a>
              </div>
            </li>
        </ul>
        <form class="form-inline mt-2 mt-md-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div class="alert fade" role="alert" id="info">
    </div>
    <div class="container">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" v-for="(item, index) in breadcrumb" :key="item.name" v-bind:class="{ active: index == breadcrumb.length - 1 }">
            <p v-if="index == breadcrumb.length - 1">{{ item.name }}</p>
            <!-- router-link 需要使用@click绑定事件 -->
            <router-link v-bind:to="item.path" @click.native="location(index)" v-else>{{ item.name }}</router-link>
          </li>
        </ol>
      </nav>
      <router-view></router-view>
    </div>
    <div class="modal" id="addRegistryModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">add registry</h5>
          </div>
          <div class="modal-body">
            <form method="post" action="">
              <div class="form-group row">
                <label class="col-md-2 col-form-label" for="name">Name</label>
                <div class="col-md-10">
                  <input class="form-control" name="name" type="text" id="name" v-model="newRegistry.name">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-2 col-form-label" for="url">Url</label>
                <div class="col-md-10">
                  <input class="form-control" name="url" type="text" id="url" v-model="newRegistry.url">
                </div>
              </div>
              <div class="btn-pair">
                <button type="submit" class="btn btn-danger" v-on:click="submitRegister">submit</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  body {
    min-height: 75rem;
    padding-top: 4.5rem;
  }
  .modal-button {
    width: auto;
    margin-left: auto;
    margin-right: auto;
    display: table;
  }

  .btn-pair {
    text-align: center;
  }

  .btn-pair button {
    margin: 0px 10px 0px 10px;
  }

  .modal-button button {
    margin: 0px 10px 0px 10px;
  }

  #info {
    position: absolute;
    right: 10px;
    z-index: 100;
  }

  .breadcrumb-item p {
    display: inline;
  }
</style>

<script>
export default {
  name: 'app',
  data: function() {
    return {
      newRegistry: {
        url: "",
        name: ""
      }
    }
  },
  computed: {
    breadcrumb() {
      return this.$store.state.breadcrumb.data;
    }
  },
  methods: {
    submitRegister: function(event) {
      event.preventDefault();
      axios.post(
        '/api/registrys',
        this.newRegistry,
      ).then((response) => {
        $('#info').addClass('alert-success').html("Success add registry").toggleClass('fade');
        setTimeout(function() {
          $('#info').removeClass('alert-success').toggleClass('fade');
        }, 5000);
        this.newRegistry.url = this.newRegistry.name = "";
        this.$store.commit('registry/add', response.data.message);
      }).catch((err) => {
        $('#info').addClass('alert-danger').html(err.response.data.message).toggleClass('fade');
        setTimeout(function() {
          $('#info').removeClass('alert-danger').toggleClass('fade');
        }, 5000);
        this.newRegistry.url = this.newRegistry.name = "";
      });

      $('#addRegistryModal').modal('hide');
    },
    location: function(index) {
      this.$store.commit('breadcrumb/del', index);
    }
  }
}
</script>