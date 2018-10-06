<template>

  <v-list dense>
    <v-divider></v-divider>
    <template v-for="item in items2">
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
      items2: [
        // { icon: "equalizer", text: "관리자 홈",  to:"/admin" },
	      { icon: "notifications", text: "공지사항",  to:"/admin/notice" },
	      { icon: "people", text: "회원관리",  to:"/admin/user" },
        { icon: "assignment", text: "메인픽",  to:"/admin/pick" },
        { icon: "ondemand_video", text: "비디오 관리",  to:"/admin/video" },
        { icon: "list", text: "큐레이션 관리", to:"/admin/curation" },
	      { icon: "report", text: "신고목록", to:"/admin/report" },
	      { icon: "comment", text: "댓글목록", to:"/admin/comments" },
	      { icon: "receipt", text: "사용자 의견 목록", to:"/admin/contact" },
	      // { icon: "settings", text: "관리자 설정", to:"/admin/settings" },
        // { icon: "help", text: "도움말", to:"/help" },
        // { icon: "phonelink", text: "앱 다운로드", to:"/apps" }
      ]
    }),

  }
</script>
