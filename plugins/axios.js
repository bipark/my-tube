export default async function ({ app, $axios, redirect, store }) {

  $axios.onRequest(config => {
    config.headers.common['Authorization'] = store.state.user ? store.state.user.uid : null;
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      //redirect('/400');
      console.log(error);
    }
  });

}
