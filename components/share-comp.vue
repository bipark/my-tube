<template>

  <div v-if="share">

    <social-sharing :url="share_url+share.id"
                    :title="share.title"
                    :description="share.note"
                    :hashtags="share.tags"
                    inline-template>

      <div>
        <network network="facebook">
          <v-btn fab small :color="$store.state.bgcolor">
            <img  class="revert" src="@/assets/icons/facebook-f.svg" width="20" height="20"/>
          </v-btn>
        </network>

        <network network="googleplus">
          <v-btn fab small :color="$store.state.bgcolor">
            <img  class="revert" src="@/assets/icons/google-plus-g.svg" width="20" height="20"/>
          </v-btn>
        </network>

        <network network="pinterest">
          <v-btn fab small :color="$store.state.bgcolor">
            <img  class="revert" src="@/assets/icons/pinterest-p.svg" width="20" height="20"/>
          </v-btn>
        </network>

        <network network="twitter">
          <v-btn fab small :color="$store.state.bgcolor">
            <img  class="revert" src="@/assets/icons/twitter.svg" width="20" height="20"/>
          </v-btn>
        </network>

        <network network="line">
          <v-btn fab small :color="$store.state.bgcolor">
            <img  class="revert" src="@/assets/icons/line.svg" width="20" height="20"/>
          </v-btn>
        </network>

      </div>

    </social-sharing>

  </div>


</template>

<script>


  export default {
    props: {
      "meta": {
        type: Object,
        default: null
      },
      "from": {
        type: String,
        default: null
      }
    },

    data() {
      if (this.from == "item" ){
        return {
          share: this.meta,
          share_url: "https://cfvdo.com/item/"
        }
      } else {
        return {
          share: {
            id: this.meta.master.id,
            title: this.meta.master.title,
            note: this.meta.master.description,
            tags: this.meta.detail.tags,
          },
          share_url: "https://cfvdo.com/curation/"
        }
      }
    },

    mounted() {
    },

    methods: {
    }

  }
</script>

<style>
</style>
