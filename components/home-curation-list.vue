<template>

  <div>
    <v-layout row wrap>
      <div v-for="row in curationList" :key="row.id" style="width: 100%">

        <v-layout row>
          <v-flex>
            <nuxt-link :to="'/curation/'+row.id">
              <div class="list_title ml-1">{{row.title}}</div>
            </nuxt-link>
          </v-flex>
          <v-flex>
            <nuxt-link :to="'/curation/'+row.id">
              <div class="view_more mr-1" v-if="row.details.length > 5">
                더보기
              </div>
            </nuxt-link>
          </v-flex>
        </v-layout>
        <v-divider class="item-list-divider"/>

        <ItemList
          :itemlist="row.details"
          :curation="row.id"
          class="mb-3"
        ></ItemList>

      </div>

    </v-layout>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </div>

</template>

<script>

	import ItemList from '~/components/item-list';

	export default {

		components: {
			ItemList
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