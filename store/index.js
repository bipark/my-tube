import Vue from 'vue';
import Vuex from 'vuex';

const store = () => new Vuex.Store({

  state: {
    bcolor: "black",
    bgcolor: "black lighten-1",
    user: null,
	  autoplay: true,
    mobile: false,
	  app: false,
  },

  getters: {
    activeUser: (state, getters) => {
      return state.user;
    },
	  platform: (state, getters) => {
      return state.platform;
    }
  },

  mutations: {
    setUser (state, payload) {
      state.user = payload;
	    this.$cookies.set("authuser", payload, {
		    path: "/",
		    maxAge: 60 * 60 * 24
	    });
    },
    setPlatform (state, payload) {
      state.mobile = payload;
    },
    setColor (state, payload) {
      state.bcolor = payload.bcolor;
      state.bgcolor = payload.bgcolor;
    },
	  setApp (state, payload) {
    	state.app = payload;
	  }
  },

  actions: {
	  nuxtServerInit ({ commit }, { req }) {

		  if (this.$cookies) {
			  const user = this.$cookies.get("authuser");
			  if (user) {
				  commit("setUser", user);
			  } else {
				  commit("setUser", null);
			  }
		  }

		  if (process.env.B_COLOR && process.env.BG_COLOR) {
	      commit("setColor", {
	        bcolor:process.env.B_COLOR,
          bgcolor:process.env.BG_COLOR
	      })
      }
	  },

	  nuxtClientInit({ commit }, context) {
		  if (Vue.prototype.$vuetify.breakpoint.width < 768 ) {
		  	this.state.mobile = true;
		  }
	  },

	  logOut({ commit }) {
		  commit("setUser", null);
	  },

  },

});

export default store
