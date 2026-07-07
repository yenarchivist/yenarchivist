# yenarchivist

예나의 개인 아카이브 — 띵구, 예나리티, GitHub, 레퍼런스 관리

## 세팅 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env.local
```
`.env.local` 파일 열어서 값 확인 (이미 채워져 있음)

### 3. Appwrite Table Permissions 설정
Appwrite 콘솔 → Databases → assets → assets 테이블 → Settings → Permissions
→ "Any" 추가 → Read, Create, Update, Delete 체크

### 4. 로컬 실행
```bash
npm run dev
```
→ http://localhost:3000

### 5. Vercel 배포
1. GitHub에 push
2. vercel.com → Import project
3. Environment Variables에 .env.local 내용 추가
4. Deploy!

## 데이터 규칙 (2026-07 리디자인)

카드/라이트박스는 `lib/normalize.js`가 Appwrite 문서를 아래 스키마로 변환해서 사용:
```
{ id, no, title, date, tags: [], images: [], prompt, threadsUrl }
```

- **여러 장 이미지**: `image_url` 필드에 URL을 **한 줄에 하나씩**(또는 쉼표 구분) 넣으면
  `images[]`로 파싱됨. Cloudflare R2 등 공개 URL이면 그대로 렌더링됨.
- **Threads 링크**: `threads_url` 속성이 있으면 사용. 없으면 `notes` 안의
  threads.net/threads.com 링크를 자동 추출. 입력 폼의 Threads 필드를 쓰려면
  Appwrite 콘솔에서 assets 컬렉션에 `threads_url` (string) 속성 추가 필요
  (빈 값은 저장 시 자동 제거되므로 속성이 없어도 기존 저장은 안 깨짐).
- **좋아요/비교**: 좋아요는 브라우저 localStorage에 저장(개인용), 비교 목록은 세션 한정.
- **섹션 컬러**: DINGU = Blossom Blush(#F4A7B9/#C46A82), YENARITY = Sky Mist(#A7D8F0).
  토큰은 `app/globals.css`의 `:root` / `[data-project=...]` 참고.

## 폴더 구조
```
app/
  page.jsx      메인 페이지
  layout.jsx    레이아웃
  globals.css   스타일
components/
  AssetCard.jsx 카드 컴포넌트
  AddModal.jsx  추가/수정 모달
lib/
  appwrite.js   Appwrite 클라이언트
```
