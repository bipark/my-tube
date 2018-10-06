<template>

  <v-menu>
    <v-btn fab small slot="activator" :color="$store.state.bcolor" dark outline>
      신고
    </v-btn>
    <v-list dense>
      <v-list-tile v-for="(item, index) in items" :key="index" @click="postReport(item)">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>

</template>

<script>

  export default {

    props: {
      "item_id": {
        type: [String, Number],
        default: null
      }
    },

    data: () => ({
      items: [
        { title: '동영상이 플레이 되지 않습니다.' },
        { title: '저작권에 문제가 있습니다.' },
        { title: '불쾌한 동영상 입니다.' },
        { title: '누드 혹은 음란물입니다.' }
      ]
    }),

    methods : {
      postReport(item) {

        if (!this.$store.state.user) {
	        this.$router.push({ name: "login", params: { redirect: this.$route.path }});
          return;
        }

        if (confirm("선택한 내용으로 신고할까요? \n\n"+item.title)) {
          const postparams = {
            "item_id": this.item_id,
            "reason": item.title
          };

          this.$axios.$post("/api/video/report", {params:postparams})
            .then((result)=>{
              alert("신고되었습니다. 빨리 처리 하겠습니다.")
            });
        }

      }
    }
  }

</script>
