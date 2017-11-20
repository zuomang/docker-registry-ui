<template>
  <div class="row">
    <div v-for="(registry, key) in registrys" :key="key" class="col-md-4 view-registry">
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
          <button type="submit" class="btn btn-danger btn-sm" v-on:click="deleteRegistry(key)">delete</button>
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
</style>


<script>
export default {
  name: 'default',
  data: function() {
    return {
    }
  },
  computed: {
    registrys() {
      return this.$store.state.registry.registrys;
    }
  },
  methods: {
    deleteRegistry: function(key) {
      axios.delete('/api/registrys/' + key).then((response) => {
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
    }
  }
}
</script>

