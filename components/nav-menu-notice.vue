<template>

    <div class="text-xs-center">
      <v-menu bottom left>
        <v-btn icon slot="activator">
          <v-icon>notifications</v-icon>
        </v-btn>

        <v-card dense>
          <v-toolbar :color="$store.state.bgcolor" flat dark dense>
            <v-toolbar-title>공지사항</v-toolbar-title>
          </v-toolbar>

          <v-list two-line dense>
            <template v-for="(item, index) in notices">
              <v-list-tile :key="item.id">
                <nuxt-link :to="'/notice/'+item.id">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.description.substring(1, 60)"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </nuxt-link>
              </v-list-tile>
              <v-divider v-if="index + 1 < notices.length" :key="index"></v-divider>
            </template>
          </v-list>
        </v-card>

      </v-menu>
    </div>

</template>

<script>
	export default {

    data() {
			return {
        notices: []
      }
    },

    mounted() {
    	this.getNotices();
    },

    methods: {

    	getNotices() {
		    const param = {
			    page: 1,
			    limit: 3,
			    all: false
		    };

		    this.$axios.get("/api/notice/list", {params:param})
          .then((result)=>{
            this.notices = result.data.notices;
          });
      }

    }
	}
</script>
