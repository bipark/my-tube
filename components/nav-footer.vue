<template>

  <v-content>
    <v-footer dark height="auto">
      <v-card flat tile class="justify-center" style="width: 100%">

        <v-container>
          <div class="text-xs-center">
            <span v-if="facebook">
              <a :href="facebook" target="_blank" class="mr-5">
                <img class="revert" src="@/assets/icons/facebook-f.svg" width="24" height="24"/>
              </a>
            </span>
            <span v-if="googleplus">
              <a :href="googleplus" target="_blank" class="mr-5">
                <img class="revert" src="@/assets/icons/google-plus-g.svg" width="24" height="24"/>
              </a>
            </span>
            <span v-if="pinterest">
              <a :href="pinterest" target="_blank" class="mr-5">
                <img class="revert" src="@/assets/icons/pinterest-p.svg" width="24" height="24"/>
              </a>
            </span>
            <span v-if="twitter">
              <a :href="twitter" target="_blank" class="mr-5">
                <img class="revert" src="@/assets/icons/twitter.svg" width="24" height="24"/>
              </a>
            </span>
            <span v-if="email">
              <a :href="'mailto:'+email">
                <img class="revert" src="@/assets/icons/email.svg" width="24" height="24"/>
              </a>
            </span>
          </div>

          <v-divider class="mt-3"/>

          <v-card-text class="footer-detail-text">
            <div>
              &copy;2018 <strong> {{companyName}} </strong> All Rights Reserved
            </div>
            <div>
              <nuxt-link to="/info/privacy" class="white--text">
                개인정보 취급방침
              </nuxt-link>
              ,
              <nuxt-link to="/info/operation" class="white--text">
                서비스 이용약관
              </nuxt-link>
            </div>
            <br/>
            <div>
              <a href="https://practical.kr/mitube" target="_blank">
                이 서비스는 오픈소스 my-tube 기반으로 운영되고 있습니다.
              </a>
            </div>

          </v-card-text>

        </v-container>

      </v-card>

    </v-footer>

  </v-content>



</template>

<script>
  export default {
  	data() {
  		return {
			  companyName:process.env.companyName,
			  facebook:process.env.footer_facebook,
			  googleplus:process.env.footer_googleplus,
			  pinterest:process.env.footer_pinterest,
			  twitter:process.env.footer_twitter,
			  email:process.env.footer_email,
      }
    }
  }
</script>

<style scoped>
</style>
