# 마이튜브 (My-Tube)

* 마이튜브(My-Tube)는 오픈소스 기반의 동영상 큐레이션 서비스와 큐레이션 관리를 위한 백오피스 프로젝트가 포함된 서비스 솔루션입니다.
* 이 프로젝트를 사용하여 사용자의 취향에 대응 할 수 있는 유튜브 기반의 동영상 큐레이션 서비스를 구축 & 운영 할 수 있습니다.
* 이 프로젝트는 오픈소스 소프트웨어 입니다. 아래 라이선스 항목을 참조 하시기 바랍니다.


![](https://s3.ap-northeast-2.amazonaws.com/rtlink/v1-front.jpg)

[ CF 동영상 큐레이션 서비스 cfvdo.com 운영화면 ([https://cfvdo.com](https://cfvdo.com)) ]

## 기능
* 메인픽 - 스페셜 피쳐링
* 카테고리별 조회
* 인기 큐레이션
* 인기 동영상
* 최근 업로드
* 동영상 및 큐레이션 검색 기능
* 개인별 프로필 - 좋아요 / 북마크 / 뷰히스토리
* 동영상 플레이어
* 카테고리별 연속 플레이 기능
* 불량 동영상 신고 기능
* 회원 가입
* 소셜공유 - 페이스북, 구글+, 트위터, 핀터레스트
* 댓글
* 북마크 / 라이크 
* 회원 반응에 변동되는 순위 시스템
* 반응형 스타일을 지원 - 모바일 페이지를 별도로 만들 필요가 없습니다.
* 구글 SEO(Search Engine Optimazation)에 최적화 되어 있습니다.
* 구글 구조화된 데이터(Structured Data)를 지원합니다. - VideoObject(마크업: schema.org)
* SSR(Server Side Rendering)을 지원 하는 구조
* 사용자 문의
* 공지사항
* 개인정보 취급방침 / 서비스 이용약관
* 로그인 / 회원가입

## 관리자 기능  
* 유튜브 비디오를 링크만으로 자동으로 등록 할 수 있습니다. - 유튜브 동영상 상세 데이터를 API 연동으로 가지고와서 DB에 저장합니다.
* 카테고리별로 큐레이션을 생성하고 생성된 큐레이션에 동영상을 추가 할 수 있습니다.  
* 스페셜 Pick 관리 
* 회원 목록을 조회 하고 삭제 할 수 있습니다.
* 신고목록 관리
* 관리자 공지사항
* 사용자 문의 목록 / 처리
* 사용자 댓글 관리
* 추가 예정 기능 - 트랜딩 Report, User Activity


## 마이튜브 기반으로 운영중인 페이지  
아래 링크에서 이 프로젝트를 이용하여 만들어진 동영상 큐레이션 서비스의 데모를 볼 수 있습니다.

* CF동영상 큐레이션 서비스 cfvdo.com - [https://cfvdo.com](https://cfvdo.com)

## Development Dependencies
이 프로젝트는 아래의 개발 도구들의 도움을 받아서 개발 되었습니다.

* Vue.js - [https://vuejs.org/](https://vuejs.org/)
* Nuxt.js - [https://ko.nuxtjs.org/](https://ko.nuxtjs.org/)
* Vuetify.js - [https://vuetifyjs.com/ko/](https://vuetifyjs.com/ko/)
* Other - Packages.json 참조 


## .env 파일 만들기
* 프로젝트를 빌드하고 실행 하기 위해서 **꼭** .env 파일을 생성하고 아래의 정보를 입력해서 제공 해야 정상적인 실행이 가능 합니다.
* .env 파일은 프로젝트 root 에 아래의 필드의 항목을 모두 채우고 빌드와 실행을 시작해야 합니다.

* 아래 링크에서 구글 Api Key, 구글 에널리틱스 & 애드센스 키를 만들 수 있습니다.
* 구글 Api Key 생성 - https://developers.google.com/youtube/v3/getting-started?hl=ko
* Google Analytics - [https://analytics.google.com](https://analytics.google.com)
* Google Adsense - [https://www.google.com/adsense](https://www.google.com/adsense)

``` bash
// 프로젝트 루트 폴더에 .env 파일을 만들어서 아래의 정보를 입력합니다 
DB_HOST= 데이터베이스 IP 주소( ex: localhost)
DB_PORT= MySQL PORT( ex:3306 )
DB_USERID= MySQL ID ( ex: root )
DB_PASSWORD= MySQL 패스워드 ( ex:password )
DB_DATABASE= MySQL 데이터베이스 명칭
API_SERVER=http://localhost:3999
GOOGLE_API_KEY= 구글 API Key
GOOGLE_ANALYTICS_KEY= 구글 애낼리틱스 키
GOOGLE_ADSENSE_KEY= 구글 광고 키

// 아래 패이지 메타정보 및 운영 관련 정보 입력
META_TITLE=CFVDO - TV CF 큐레이션(World of Commercial Films)
META_SUBJECT=Commercial Films
META_DESCRIPTION=CFVDO - TV CF 큐레이션(World of Commercial Films)
META_KEYWORD=Commercial, Films
META_AUTHOR=cfvdo.com
META_OG_DESCRIPTION=CFVDO.COM은 마이튜브 기반으로 운영중인 CF 동영상 큐레이션 서비스입니다.
META_OG_TYPE=website
META_OG_URL=https://cfvdo.com
META_OG_IMAGE=https://cfvdo.com/profile.png
META_OG_FB_APP_ID=129093294626522
MAIN_TITLE=cfvdo.com
SUB_TITLE=세상의 모든 광고동영상
COMPANY_NAME=practical.kr
FOOTER_FACEBOOK=https://www.facebook.com/cfvdocom
FOOTER_EMAIL=info@practical.kr
SHOW_AD=false
SHOW_BORDER=false
B_COLOR=red
BG_COLOR=red lighten-1
```


## 설치방법

``` bash
# 프로젝트를 설정하기 전에 DB-SCHEMA.md 파일을 참조하여 MySQL 데이터베이스를 생성하고 아래 순서로 설치를 시작 합니다.

# 이 프로젝트를 Git을 이용하여 Clone 하거나 다운로드 합니다.
$ git clone https://github.com/bipark/mitube-web-client.git

# 디펜던시를 먼저 설치합니다
$ npm install

# 개발환경에서는 아래와 같이 프로젝트를 실행 할 수 있습니다.
$ npm run dev

# 프로덕션을 위해서 빌드 & 실행을 다음 명령으로 실행 할 수 있습니다.
$ npm run build
$ npm start

# 스태틱한 런타임 환경을 구축 하려면 아래 명령어로 실행 할 수 있습니다.
$ npm run generate
```



## 개발자
* 이 프로젝트는 (주)프랙티컬 [https://practical.kr](http://practical.kr) 에서 만들고 있습니다.
* 현재는 박병일(rtlink.park@gmail.com)이 개발하고 있습니다. 컨트리뷰션 환영합니다. 

## 마이튜브 기반으로 운영중인 페이지
* CF 동영상 큐레이션 서비스 - [https://cfvdo.com](https://cfvdo.com)
* 소프트웨어 개발 강의 동영상 서비스 - [https://sepdong.com](https://sepdong.com)


## 라이선스 
* 본 소프트웨어의 라이선스는 MIT 라이선스 입니다.
* 본 소프트웨어의 사용에는 아무런 제약 사항이 없습니다만 사용중에 발생할 수 있는 문제에 대한 책임 역시 개발자에게 있지 않습니다.
* 본 소프트웨어 사용에 필요한 도움을 얻기 위해서는 별도의 사용 계약을 맺을 수 있습니다. 본 항목과 관련한 자세한 정보는 [http://practical.kr/mitube](http://practical.kr/mitube)에서 확인 할 수 있습니다.
* 본 소프트웨어의 사용 계약은 아래 내용과 같습니다. 동의 하시면 사용 가능 합니다. 

> The MIT License (MIT) Copyright (c) 2018, Practical inc.
>
>이 소프트웨어의 복제본과 관련된 문서화 파일(“소프트웨어”)을 획득하는 사람은 누구라도 소프트웨어를 별다른 제한 없이 무상으로 사용할 수 있는 권한을 부여 받는다. 여기에는 소프트웨어의 복제본을 무제한으로 사용, 복제, 수정, 병합, 공표, 배포, 서브라이선스 설정 및 판매할 수 있는 권리와 이상의 행위를 소프트웨어를 제공받은 다른 수취인들에게 허용할 수 있는 권리가 포함되며, 다음과 같은 조건을 충족시키는 것을 전제로 한다. 
>
>위와 같은 저작권 안내 문구와 본 허용 문구가 소프트웨어의 모든 복제본 및 중요 부분에 포함되어야 한다. 
>
>이 소프트웨어는 상품성, 특정 목적 적합성, 그리고 비침해에 대한 보증을 포함한 어떠한 형태의 보증도 명시적이나 묵시적으로 설정되지 않은 “있는 그대로의” 상태로 제공된다. 소프트웨어를 개발한 프로그래머나 저작권자는 어떠한 경우에도 소프트웨어나 소프트웨어의 사용 등의 행위와 관련하여 일어나는 어떤 요구사항이나 손해 및 기타 책임에 대해 계약상, 불법행위 또는 기타 이유로 인한 책임을 지지 않는다. 
