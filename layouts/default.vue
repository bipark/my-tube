<template>

  <v-app id="inspire">

    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" width=250 fixed app>

      <MenuNormal/>
      <div v-if="user && user.scope == 'admin'">
        <MenuAdmin/>
      </div>

    </v-navigation-drawer>

    <v-toolbar clipped-left :color="$store.state.bcolor" dark dense app fixed>

      <v-toolbar-side-icon
        class="mr-4"
        @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>
      <nuxt-link to="/">
        <v-toolbar-title class="mr-5">
          <div class="toolbar-title">{{mainTitle}}</div>
          <div class="toolbar-small-title">{{subTitle}}</div>
        </v-toolbar-title>
      </nuxt-link>

      <form action="/search" method="get" class="hidden-sm-and-down" style="width:50%">
        <v-text-field flat solo-inverted hide-details
          prepend-inner-icon="search" label="Search" class="hidden-sm-and-down"
          v-model="searchText" name="query"
        ></v-text-field>
      </form>

      <v-spacer></v-spacer>

      <v-btn icon @click="menuRouter('/apps')" class="hidden-sm-and-down">
        <v-icon>apps</v-icon>
      </v-btn>

      <MenuNotice/>
      <MenuUser/>

    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>

    <div v-if="$store.state.app">
      <v-btn fixed dark fab small bottom right :color="$store.state.bcolor" @click.native="goBack">
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
      <div class="mb-5"></div>
    </div>
    <div v-else>
      <NavFooter/>
    </div>

  </v-app>
</template>


<script>

  import NavFooter from '~/components/nav-footer';
  import MenuNormal from '~/components/nav-menu-normal';
  import MenuAdmin from '~/components/nav-menu-admin';
  import MenuUser from '~/components/nav-menu-user';
  import MenuNotice from '~/components/nav-menu-notice';


  export default {
    components: {
      NavFooter,
      MenuNormal,
      MenuAdmin,
      MenuUser,
      MenuNotice,
    },

		data() {
      return {
        drawer: false,
        menu: true,
        searchText: null,
        mainTitle: process.env.mainTitle,
        subTitle: process.env.subTitle,
      }
    },

	  computed: {
		  user() {
		  	if (this.$store.state.user){
				  return this.$store.state.user
        }
		  },

		  platform () {
		  	if (this.$localStorage){
				  return this.$localStorage.get('platform') === 'mobile' ? true : false;
        } else {
		  		return false;
        }
		  }
	  },

	  mounted() {
		  if (this.$vuetify.breakpoint.width > 768 ) {
        this.drawer = true;
		  }
	  },

    methods: {

      menuRouter(to) {
        if (to == "facebook") {
          window.open("https://www.facebook.com/cfvdocom");
        } else {
          this.$router.push(to);
        }
      },

      goBack() {
	      this.$router.go(-1);
      }

    }
  }
</script>

<style>
</style>
