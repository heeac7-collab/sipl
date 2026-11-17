# 시플 웹앱 (웹 1차)

5060 테마여행 모집·신청 웹앱. Next.js + Supabase, 휴대폰 홈 화면에 앱처럼 설치 가능(PWA).

## 실행
npm install
npm run dev   # http://localhost:3000

Supabase 키가 없으면 예시 데이터로 도는 데모 모드예요. 관리자: /admin (데모 비밀번호 demo)

## Supabase 연결
1. supabase.com 가입 → 새 프로젝트
2. SQL Editor 에 supabase/schema.sql 실행
3. .env.example 을 .env.local 로 복사해 키와 ADMIN_PASSWORD 입력
4. 카카오 로그인: Supabase > Authentication > Providers > Kakao 에 카카오 개발자 앱 키 입력

## 화면
/ 메인 · /trips 목록 · /trips/[id] 상세·신청 · /login 카카오 로그인 · /admin 관리자(명단, 여행 등록, 재참여자 수)
