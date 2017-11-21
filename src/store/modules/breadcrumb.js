const state = {
    data: []
}

const mutations = {
    init(state) {
        state.data = [];
        state.data.push({path: "/", name: "Home"});
    },
    add(state, path) {
        state.data.push(path);
    },
    del(state, index) {
        state.data = state.data.slice(0, index + 1);
    }
}

export default {
    namespaced: true,
    state,
    mutations
}