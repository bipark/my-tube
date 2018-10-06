export default async function ({ app, store, redirect }) {

	window.aw_mobile_handleSNSLogin = function(params) {
		store.state.setUser(params);
	}

	window.goNavigate = function(address) {
		redirect('/'+address);
	}

}
