# NODE-SERVER 


`노드` `Rest API` with `Express` + `Mongo DB` with `Mongoose` 공부를 위한
게시판 토이 프로젝트
### 개발기록
## 개요
 - 사용자 인증 구현
   - 패스워드 암호화 저장
   - JWT를 이용한 토큰 생성 후 전달 + 클라이언트 헤더를 통해 토큰을 확인 후 인증
   - oauth2 사용 고려 

 - 게시판 동작 구현
   - 게시판 전체 조회, 글 작성, 수정, 삭제 기능 구현
   - 인증된 사용자만 작성, 수정, 삭제 가능
   - 댓글 조회, 작성, 삭제 기능 구현

 - http request
   - POSTMAN 을 통해 요청과 응답을 확인하자
   - API 구현이 완성되면 React를 이용해 게시판 front를 구성하자

## 개발 일지
### #1 : 사용자 인증 구현
미리 만들어 놓은 사용자 인증을 더욱 깔끔한 구조로 수정하는 작업을 한다.

현재 사용자 인증은 다음과 같이 이루어진다.

    1. 사용자 등록 (POST : /api/register)
        1) body에서 ID와 password를 확인
        2) Mongo DB 의 users 컬렉션을 조회해 동일한 ID가 있는지 확인
        3) 동일한 ID가 없는 경우
            - 첫 번째 유저라면 관리자 설정
            - 패스워드 암호화하고 users 컬렉션에 저장
            - 성공 응답과 함께 성공 메시지 전송
        4) 동일한 ID가 있다면 실패 응답와 함께 실패 메시지 전송

    2. 로그인 (POST : /api/login)
        1) body에서 ID와 password를 받음
        2) users 컬렉션에서 ID 조회하고 없다면 상태 응답 409와 함께 실패 메시지 전송
        3) ID가 있다면 해당 다큐먼트의 password 확인
            - 맞았을 경우 토큰 생성하고 바디에 포함시켜 상태 200 전달
            - 틀렸을 경우 오류 응답 

    3. 토큰 인증 절차 (미들웨어)
        1) header의 x-access-token 정보를 확인
        2) 해당 토큰을 verify후 디코딩
        3) 토큰이 유효한다면 디코딩된 정보를 성공 응답과 함께 전송
        4) 토큰이 잘못되었거나 만기되었다면 오류 응답
### #2 : 게시글 CRUD 작성
    1. 게시글 등록 (POST : /api/post)
        1) 토큰 인증 절차를 선행해야 함 (미들웨어 등록)
        2) 토큰에 기록된 ObjectId를 Post Model에 붙여서 등록
        3) 응답메시지에 post_id 전달

    2. 게시글 전체 조회 (GET : /api/post)
        1) 모든 게시글 조회
        2) populate를 이용해 게시글과 User를 연결함

    3. 게시글 수정 (PUT : /api/post/postid)
        1) url에서 post_id를 확인
        2) post_id를 조회해 해당 document의 title, content 수정
        3) nModified가 1이라면 성공 응답, 그 외엔 실패 응답

    4. 게시글 삭제 (DELETE : /api/post/postid)
        1) url에서 postid 확인 후 해당 document 삭제
        2) deletedCount가 1이라면 성공 응답, 그 외엔 실패 응답

### #3 : 댓글 CRD 작성
    1. 댓글 등록 (POST : /api/comment/postid)
        1) 토큰 정보의 user id 확인
        2) postid를 통해 post의 object id를 조회하고 comment 모델에 입력
        3) request body 정보를 모델에 입력, 컬렉션에 저장

    2. 특정 게시글의 댓글 조회 (GET : /api/comment/postid) 
        1) postid를 통해 post의 object id를 조회
        2) post object id와 매칭되는 정보 조회
        3) 조회하면서 populate({path:'author', select : 'userId'}) 사용
        4) 조회된 정보 전송

    3. 댓글 삭제 (DELETE : /api/comment/commentid)
        1) url의 commentid에 해당하는 comment 삭제
## 고민

#### # 토큰 인증 절차를 어디에 두어야 최소한의 인증으로 세션을 유지시킬 수 있을까


#### # 사용자와 게시글을 연결하는 가장 좋은 구조는 무엇일까
 - user가 post의 ref를 기억하는 방법 
   - user 별로 post 목록을 보여줄 때 유용할 것 같다.
 - **post가 user의 ref를 기억하는 방법** `채택`
   - post를 생성하는 작업이 간편할 듯 하다.
   - 특정 user의 모든 post를 찾는 작업을 한다면 느릴 수 있을것 같다.
     - 해당 user의 ObjectId를 통해 검색. -> `post.find({_id:user._id})`
> 결론 : 현재 특정 user의 post를 조회하는 기능을 구현할 예정이 없기 때문에 post에 user의 ref를 연결한다. 추후 data 조회 속도를 비교해 봐야겠다.

#### # 게시글의 구분을 위한 방법
 - ObjectId를 사용하는 방법 
    - ObjectId를 요청에 포함시켜야 하기 때문에 프론트엔드에서 관리하기 어려울 것이라 생각됨.
 - **따로 넘버링을 해서 기록하는 방법** `채택`
    - 유일한 ObjectId가 있는데 따로 숫자를 기록한다는 것은 낭비가 아닐까?  

> 결론 : API 사용의 편의성을 높이기 위해 포스트 넘버를 사용하기로 결정.

#### # Model의 statics method를 화살표 함수로 작성했을 때 this를 사용하면 오류가 난다.
```
Post.statics.findAllPosts = () => {
    return this.find({}).populate('author');
}
// 현재 Post는 Schema 형태로 Model이 되기 전 단계이다.
// schema 에는 find 라는 메소드가 없기 때문에 사용할 수 없다.
```
> 결론 : 화살표 함수가 아닌 익명 함수를 통해 런타임에 this가 결정되도록 한다.


#### # User와 Post 삭제 관련
 - Post는 User를 참조하고, Comment는 Post를 참조한다.
 - User 삭제시 Post를 삭제? Post 삭제시 Comment 삭제?
 - 삭제하지 않아도 문제는 없겠지만, 예외처리를 확실하게 해야할 것 같다.