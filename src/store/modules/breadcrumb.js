const state = {
  data: [],
};

const mutations = {
  init(s) {
    s.data.splice(0);
    s.data.push({ path: '/', name: 'Home' });
  },
  add(s, path) {
    s.data.push(path);
  },
  del(s, index) {
    s.data.splice(index);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
