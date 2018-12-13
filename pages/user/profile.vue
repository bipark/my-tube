<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <div class="text-xs-center mb-4 mt-2">
      <v-avatar size="100px" class="mb-2">
        <img :src="user.picture">
      </v-avatar>

      <div>{{user && user.name}}</div>
      <div>{{user && user.uid}}</div>
    </div>

    <v-tabs centered color="grey lighten-5" icons-and-text class="mb-4">
      <v-tabs-slider :color="$store.state.bcolor"></v-tabs-slider>

      <v-tab v-for="(item, i) in items" :key="i">
        {{ item.title }}
        <v-icon>{{ item.icon }}</v-icon>
      </v-tab>

      <v-tab-item :key="1">
        <v-card flat>
          <v-card-text>
            <History/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="2">
        <v-card flat>
          <v-card-text>
            <Bookmark/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="3">
        <v-card flat>
          <v-card-text>
            <Like/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="4">
        <v-card flat>
          <v-card-text>
            <UserSettings/>
          </v-card-text>
        </v-card>
      </v-tab-item>


    </v-tabs>

    <AdSense/>
  </component>

</template>

<script>

  import History from '~/components/history';
  import Bookmark from '~/components/bookmark';
  import Like from '~/components/like';
  import AdSense from '~/components/ad-sense';
  import UserSettings from '~/components/user-settings';


  export default {

    components: {
      History,
      Bookmark,
      Like,
      AdSense,
      UserSettings,
    },

	  computed: {
		  user() {
			  return this.$store.state.user
		  }
	  },


	  data() {
    	return {
    		items: [
			    {title: "최근본", icon:"history", name:"tab-1"},
			    {title: "북마크", icon:"bookmark_border", name:"tab-2"},
			    {title: "좋아요", icon:"favorite_border", name:"tab-3"},
			    {title: "설정", icon:"settings", name:"tab-4"},
        ]
      }
    }

  }
</script>
