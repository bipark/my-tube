export default async function ({ app, store, redirect }) {

	window.goNavigate = function(address) {
		redirect('/'+address);
	}

	window.mobile_registerDevice = function(info) {
		const param = {
			os: info.os,
			name: info.name,
			token: info.token
		};
		app.$axios.post("/api/device/regist", param);

	}

	window.mobile_handlePush = function() {
		// console.log("======================================")
	}
}
