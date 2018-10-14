<template>

  <v-layout row wrap>
    <div v-for="row in curationList" :key="row.id" style="width: 100%">

      <v-layout row>
        <v-flex>
          <nuxt-link :to="'/curation/'+row.id">
            <div class="list_title ml-1">{{row.title}}</div>
          </nuxt-link>
        </v-flex>
        <div v-if="showmore">
          <v-flex style="min-width: 50px">
            <nuxt-link :to="'/curation/'+row.id">
              <div class="view_more mr-1" v-if="row.details.length > 5">
                더보기
              </div>
            </nuxt-link>
          </v-flex>
        </div>
      </v-layout>
      <v-divider class="item-list-divider"/>

      <ItemList
        :itemlist="row.details"
        :curation="row.id"
        class="mb-3"
      ></ItemList>

    </div>

  </v-layout>


</template>

<script>

	import ItemList from '~/components/item-list';

	export default {
  	props: ["curationList", "showmore"],

		components: {
			ItemList
		},

		data () {
  		return {

      }
    },


  }

</script>