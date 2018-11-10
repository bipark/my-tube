<template>

  <v-list dense>

    <template v-for="item in items">
      <v-list-tile :key="item.to" :to="item.to">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.text }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>

  </v-list>

</template>

<script>
  export default {

    data: () => ({
      items: [
        { icon: "home", text: "홈", to:"/" },
        { icon: "list", text: "카테고리", to:"/category" },
        { icon: "whatshot", text: "인기 큐레이션", to:"/hot" },
        { icon: "video_library", text: "최근 인기 동영상", to:"/hotcf" },
        { icon: "fiber_new", text: "최근 업로드", to:"/recent" },
        { icon: "search", text: "검색", to:"/search" },
	      { icon: "person", text: "프로필", to:"/user/profile" },
	      { icon: "apps", text: "모바일앱", to:"/apps" },
      ]
    }),

    mounted() {
    },

    methods: {
    }

  }
</script>
