<template>

  <v-layout row wrap>
    <v-flex xs6 sm4 lg2 xl2 v-for="item in itemlist" :key="item.id">
      <v-card style="margin: 2px">
        <nuxt-link :to="'/admin/item/'+item.id">
          <div class="img-container">
            <img class="img-st"
                 :src="item.thumb_medium"
                 :alt="item.title"
            />
            <div v-if="duration(item.duration)">
              <div class="bottom-right">{{duration(item.duration)}}</div>
            </div>
          </div>
        </nuxt-link>
      </v-card>
      <v-icon small @click="deleteFromCurationDetail(item.pid)">delete</v-icon>
      <small>{{item.id}}</small>
    </v-flex>
  </v-layout>

</template>

<script>
  export default {

    props: {
      "itemlist": Array,
    },

	  methods: {

		  duration(duration) {
			  if (duration) {
				  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
				  var hours = 0, minutes = 0, seconds = 0, totalseconds;

				  if (reptms.test(duration)) {
					  var matches = reptms.exec(duration);
					  if (matches[1]) hours = Number(matches[1]);
					  if (matches[2]) minutes = Number(matches[2]);
					  if (matches[3]) seconds = Number(matches[3]);
					  totalseconds = hours * 3600  + minutes * 60 + seconds;
					  if (hours > 0) {
						  return this.$moment.utc(totalseconds*1000).format('HH:mm:ss');
					  } else {
						  return this.$moment.utc(totalseconds*1000).format('mm:ss');
					  }
				  } else {
					  return null;
				  }
			  } else {
				  return null;
			  }
		  },


		  deleteFromCurationDetail(id) {
        var r = confirm("선택한 비디오를 큐레이션에서 삭제 하겠습니까?");
        if (r == true) {

          const postparams = {
            "id": id
          };

          this.$axios.$post("/api/curation/detail/delete", {params:postparams})
            .then((result)=>{
              if (result.err) {
                if (result.err.sqlMessage) {
                  alert(result.err.sqlMessage);
                } else {
                  alert(result.err);
                }
              } else {
                this.$root.$emit('ReloadCurationList', null);
              }
            });

        }
      },
    }

  }
</script>

<style>
</style>
