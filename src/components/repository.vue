<template>
  <div>
    <div class="card max" style="width: 100%">
      <div class="card-header">
        <h4>all tag</h4>
        <ul>
          <li>before delete tag, you need <a href="https://docs.docker.com/registry/configuration/#delete">enable delete feature</a></li>
          <li>after delete tag, you need <a href="https://docs.docker.com/registry/garbage-collection/">run grabage collect</a></li>
        </ul>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">tag</th>
              <th scope="col">created time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tag, index) in tags" :key="index" scope="row">
              <td>{{ tag.tag }}</td>
              <td>{{ tag.createdTime }}</td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-end">
            <li class="page-item" v-bind:class="{ disabled: previousDisable }" v-on:click.stop="toPrevious">
              <a class="page-link" href="#" tabindex="-1">Previous</a>
            </li>
            <li class="page-item" v-bind:class="{ disabled: nextDisable }" v-on:click.stop="toNext">
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
const md5 = require('md5');

export default {
  name: 'repository',
  data: function() {
    return {
      baseURL: '/api/registrys/' + md5(this.$route.params.name) + '/repos/' + encodeURIComponent(this.$route.params.repo),
      previousURL: "",
      currentURL: "",
      nextURL: '/api/registrys/' + md5(this.$route.params.name) + '/repos/' + encodeURIComponent(this.$route.params.repo),
      history: [],
      tags: [],
      previousDisable: true,
      nextDisable: true
    }
  },
  created: function() {
    if (this.nextURL) {
      axios.get(this.nextURL).then((response) => {
        this.previousURL = this.nextURL;
        this.previousDisable = this.baseURL == this.previousURL ? true : false;

        this.currentURL = this.nextURL;
        this.history.push(this.nextURL);

        if (response.data.message.nextUrl) {
          // 当存在下一页时
          this.nextURL = response.data.message.nextUrl;
          this.nextDisable = false;
        } else {
          this.nextDisable = true;
        }
        this.tags = response.data.message.tags;
      }).catch((err) => {
        $('#info').addClass('alert-danger').html(err.response.data.message).toggleClass('fade');
        setTimeout(function() {
          $('#info').removeClass('alert-danger').toggleClass('fade');
        }, 5000);
      });
      document.documentElement.scrollTop = 0;
    }
  },
  methods: {
    toNext: function() {
      if (!this.nextDisable) {
        axios.get(this.nextURL).then((response) => {

          // 设置上一页URL
          this.previousURL = this.currentURL;
          this.previousDisable = false;

          // 重置当前页URL
          this.currentURL = this.nextURL;
          // push 当前页URL到list中
          this.history.push(this.currentURL);

          // 设置下一页
          if (response.data.message.nextUrl) {
            this.nextURL = response.data.message.nextUrl;
            this.nextDisable = false;
          } else {
            this.nextDisable = true;
          }
          // 设置当前页的data
          this.tags = response.data.message.tags;
        }).catch((err) => {
          $('#info').addClass('alert-danger').html(err.response.data.message).toggleClass('fade');
          setTimeout(function() {
            $('#info').removeClass('alert-danger').toggleClass('fade');
          }, 5000);
        });
        document.documentElement.scrollTop = 0;
      }
    },
    toPrevious: function() {
      if (!this.previousDisable) {
        axios.get(this.previousURL).then((response) => {
          this.history.pop();

          // 设置下一页为当前URL
          this.nextURL = this.currentURL;
          this.nextDisable = false;
          // 重置当前页面
          this.currentURL = this.previousURL;

          // 设置上一页的URL
          // this.previousURL = this.history[index];
          if (this.history.length > 1) {
            this.previousURL = this.history[this.history.length - 2];
            this.previousDisable = false;
          } else {
            this.previousURL = this.baseURL;
            this.previousDisable = true;
          }

          // 设置当前页的data
          this.tags = response.data.message.tags;
        }).catch((err) => {
          $('#info').addClass('alert-danger').html(err.response.data.message).toggleClass('fade');
          setTimeout(function() {
            $('#info').removeClass('alert-danger').toggleClass('fade');
          }, 5000);
        });
        document.documentElement.scrollTop = 0;
      }
    }
  }
}
</script>

