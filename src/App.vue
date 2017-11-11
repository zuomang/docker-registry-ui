<template>
  <div>
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
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#myModal">add</a>
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
    <div>
      <p>定位的基本思想很简单，它允许你定义元素框相对于其正常位置应该出现的位置，或者相对于父元素、另一个元素甚至浏览器窗口本身的位置。显然，这个功能非常强大，也很让人吃惊。要知道，用户代理对 CSS2 中定位的支持远胜于对其它方面的支持，对此不应感到奇怪</p>
    </div>
    <div class="modal" id="myModal" tabindex="-1" role="dialog">
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
              <div class="modal-button">
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

  .modal-button button {
    margin: 0px 10px 0px 10px;
  }

  #info {
    position: absolute;
    right: 10px;
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
      }).catch((err) => {
        $('#info').addClass('alert-danger').html(err.response.data.message).toggleClass('fade');
        setTimeout(function() {
          $('#info').removeClass('alert-danger').toggleClass('fade');
        }, 5000);
        this.newRegistry.url = this.newRegistry.name = "";
      });

      $('#myModal').modal('hide');
    }
  }
}
</script>