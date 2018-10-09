export default async function ({ app, store, redirect }) {

	window.goNavigate = function(address) {
		redirect('/'+address);
	}

	window.mobile_registerDevice = function(info) {
		if (store.state.user) {
			const param = {
				os: info.os,
				name: info.name,
				token: info.token,
				uid: store.state.user.uid
			};
			app.$axios.post("/api/user/regist/device", param);
		}
	}

}
