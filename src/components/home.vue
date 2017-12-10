<template>
  <div class="row">
    <div v-for="(registry, key) in registrys" :key="key" class="col-md-4 view-registry" v-on:click="location(registry)">
      <div class="card">
        <div class="card-header card-header-primary">{{ registry.name }}</div>
        <div class="card-block">
          <table class="table">
            <tbody>
              <tr>
                <th scope="row">name</th>
                <td>{{ registry.name }}</td>
              </tr>
              <tr>
                <th scope="row">url</th>
                <td>{{ registry.url }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer btn-pair">
          <button type="submit" class="btn btn-danger btn-sm" v-on:click.stop="deleteRegistry(key)">delete</button>
          <button type="button" class="btn btn-primary btn-sm">edit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.single {
  display: inline;
}

.view-registry {
  margin-bottom: 10px;
}

.card-block table {
  word-break: break-all;
  word-wrap: break-word;
}
</style>


<script>
export default {
  name: 'home',
  data: function() {
    return {
    }
  },
  computed: {
    registrys(key) {
      return this.$store.state.registry.registrys;
    }
  },
  methods: {
    deleteRegistry(key) {
      axios.delete(`/api/registrys/${key}`).then((response) => {
        this.$store.commit('registry/delete', key);
        $('#info').addClass('alert-success').html("Success delete registry").toggleClass('fade');
        setTimeout(function() {
          $('#info').removeClass('alert-success').toggleClass('fade');
        }, 5000);
      }).catch((err) => {
        $('#info').addClass('alert-danger').html(err.response.data.message).toggleClass('fade');
        setTimeout(function() {
          $('#info').removeClass('alert-danger').toggleClass('fade');
        }, 5000);
      });
    },
    location(registry) {
      // update breadcrumb
      const base = this.$store.state.breadcrumb.data[this.$store.state.breadcrumb.data.length - 1];
      const end = registry.name.toLowerCase().replace(' ', '-');
      const path = base.path[base.path.length - 1] === '/' ? `${base.path}${end}` : `${base.path}/${end}`;
      this.$store.commit('breadcrumb/add', {
        name: registry.name,
        path: path
      });
      this.$router.push(path);
    }
  },
  created: function() {
    this.$store.commit('breadcrumb/init')
  }
}
</script>

