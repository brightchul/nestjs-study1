# Chapter 10 권한 확인을 위한 가드 : JWT 인증/인가

애플리케이션은 사용자의 권한을 확인하기 위해 이증과 인가를 수행해야 한다. 

## 인증 (authentication)
- 인증은 요청자가 자신이 누구인지 증명하는 과정이다. 
- 최근에는 매 요청하다 헤더에 JWT 토큰을 보내고 토큰을 통해 요청자가 라우터에 접근 가능한 올바른 유저인지 확인하는 방식을 사용한다. 
- 인증은 미들웨어를 이용하여 구현할 수 있는 좋은 사례이다.
- 에러코드 401 Unauthorized


## 인가(authorization)
- 인가는 인증을 통과한 우저가 요청한 기능을 사용할 권한이 있는지를 판별하는 것을 말한다. 
- permission, role, access control list(ACL) 같은 개념을 사용하여 유저가 가지ㅏ고 있는 속성으로 리소스 사용을 허용할지 판별한다.
- 인가는 가드를 이용하여 구현할수 있는 좋은 사례이다. 
- 에러코드 403 Fobidden


### 인가를 왜 가드를 통해야 할까요?
미들웨어는 실행 콘텍스트에 접근할수 없다. 즉 다음 어떤 핸들러가 실행될지 알수가 없다. 이에 반해 가드는 실행 컨텍스트 인스턴스에 접근할 수 잇어 다으 ㅁ실행될 작업을 정확히 알고 있다.


## 세션 기반 인증

- 세션은 로그인에 성공한 유저가 서비스를 사용하는 동안 저장하고 있는 유저 정소이다.
- 서버는 세션을 생성하고나서 세션을 데이터베이스에 저장하고 이후 사용자의 요청에 포함된 세션 정보가 세션 DB에 저장되어 있는지 확인한다. 
- 브라우저에는 데이터를 저장할수 있는 세션 스토리지, 로컬 스토리지, 쿠키가 있다. 


### 단점
- 악의적인 공격자가 브라우저에 저장된 데이터를 탈취할 수 있다.
- 이를 방지하기 위해 HTTPS 암호화 및 세션 유효기간을 정해두고 이후 재로그인 유도한다. 
- 세션은 서버내 메모리를 활용하곤 하는데 트래픽이 몰리면 세션 확인 때문에 DB 부하 및 메모리 부족
    - Redis 등을 활용해 좀더 빠르게 처리하도록 하는 방법 사용
- 여러 도메인으로 서비스가 나뉘어 있는 경우 CORS 문제로 인해 도메인 간 세션을 공유하는 처리가 번거롭다. 

## 토큰 기반 인증

- 토큰은 사용자가 로그인했을 때 서버에서 토큰을 생성해서 전달하고 따로 저장소에 저장하지 않는 방식
- 로그인 이후 클라이언트의 토큰 검증만 수행, JWT를 많이 사용함
- 세션과 달리 상태 관리 필요가 없어 어느 도메인의 서비스로 보내더라도 같은 인증을 수행할 수 있다.

## jWT (json web token)

> JWT는 두 당사자 사이에 이전될 수 있는 클레임을 나타내는 간결하고 URL에서 안전한 방법이다. JWT에 포함된 클레임은 JSON으로 인코딩되어 JSON 웹서명 (JWS)의 페이로드 또는 JSON 웹 암호화(JWE) 의 일반 텍스트로 사용된다. 클레임을 디지털 방식으로 서명하거나 메세지 인증 코드로 암호화 해서 무결성을 보호한다.

- JWT는 헤더, 페이로드, 시그니처 3가지 요소를 가지며 `.` 으로 구분된다. 
- 헤더와 페이로드는 각각 base64로 인코딩되어 있다. 
- JSON 문자열을 데이터베이스나 프로그래밍 언어에서 지원하지 않는 경우도 있어 base64 인코딩 필요
