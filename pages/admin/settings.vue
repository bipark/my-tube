<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h1>관리자 설정</h1>

    <v-data-table
      :items="settings"
      class="elevation-1 mt-4"
      hide-actions
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td>
          <div v-if="props.item.type == 'switch'">
            <v-switch v-model="props.item.value"></v-switch>
          </div>
          <div v-else-if="props.item.type == 'text'">
            <v-text-field :value=props.item.value></v-text-field>
          </div>
        </td>
      </template>
    </v-data-table>

  </component>

</template>

<script>
	export default {

		async asyncData({app, params, store, query}) {

			return {
				settings: [
					{"key":"servicename", "title":"서비스 이름", "type": "text", "value": "cfVdo.com"},
					{"key":"showad", "title":"광고 보이기", "type": "switch", "value": true}
        ],
			}
		},


	}
</script>
<style>
</style>