<template>

  <div>
    <CurationListShort
      :curationList="curationList"
      :showmore="true"
    />

    <div v-if="curationList.length > 0">
      <div class="text-xs-center" @click="pageClick">
        <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
      </div>
    </div>

  </div>

</template>

<script>

	import CurationListShort from  '~/components/curation-list-short';

	export default {

		components: {
			CurationListShort
		},

  	props: ["ppage"],

  	data() {
		  return {
			  curationList: [],
        param: {
	        page: this.ppage,
	        limit: 10,
	        detail_limit: 6,
	        isshow: 1,
        },
			  pageCount: 1
		  }
    },

    created() {
   		this.getCurationList();
    },

  	methods: {
  		getCurationList() {

			  this.$axios.get("/api/curation/master", {params:this.param})
          .then((res)=>{
            this.curationList = res.data.curations;
		        this.pageCount = Math.ceil(res.data.count / this.param.limit);
          })
		  },

		  pageClick() {
			  this.$router.push('/page/'+this.param.page);
			  this.getCurationList();
		  },

	  }

  }
</script>