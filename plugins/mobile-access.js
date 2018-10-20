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

	window.receiveCommandFromMobile = function(info) {
		const command = info.command;

		if (command == 'HOME') {
			redirect('/');
		} else if (command == 'CATEGORY') {
			redirect('/category');
		} else if (command == 'HOT') {
			redirect('/hot');
		} else if (command == 'SEARCH') {
			redirect('/search');
		} else if (command == 'PROFILE') {
			redirect('/user/profile');
		}
	}
}
