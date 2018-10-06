export default async function ({ app, store, redirect, route, isDev }) {

  const needauth = ["/user/profile"];
  const find = needauth.indexOf(route.path);
	const admin = route.path.indexOf('/admin');

  if (store.state.user) {

    const result = await app.$axios.$get("/api/user/get?uid="+store.state.user.uid);
    if (result.user){
	    store.commit("setUser", result.user);
    }

    if (admin >= 0 && store.state.user.scope == 'user') {
	    redirect("/");
    }

  } else {

    if (find > -1) {
	    app.router.push({ name: "login", params: { redirect: route.path }});
    }
    if (admin >= 0) {
	    app.router.push({ name: "login", params: { redirect: route.path }});
    }

  }

}
