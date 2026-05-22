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
