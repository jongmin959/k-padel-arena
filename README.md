# K-PADEL ARENA V2

K-PADEL ARENA의 예약·매칭·대회·랭킹·클럽·관리자 플랫폼 초기 V2입니다.

## 포함 기능
- 실시간 코트 예약 UI
- 회원가입 / 로그인 UI
- 카카오 OAuth 진입 및 callback API
- 경기 참가자 모집
- 4명 자동 매칭
- 경기 결과 입력 및 승/패·포인트 반영
- 개인 랭킹 / 레벨
- 클럽별 회원 관리
- 대회 생성 / 참가 신청
- Toss Payments 연동 API 진입점
- 관리자 예약 / 매출 통계
- 브라우저 알림 권한
- K-PADEL ARENA 브랜딩
- 모바일 반응형 UI
- Upstash Redis 기반 공유 저장소 API

## 로컬 실행
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Netlify 자동 배포
1. 이 프로젝트를 GitHub repository에 push합니다.
2. Netlify에서 **Add new project → Import an existing project → GitHub**를 선택합니다.
3. repository를 선택합니다.
4. Build command는 `npm run build`, publish directory는 Next.js 자동 감지를 사용합니다.
5. Netlify의 Site configuration → Environment variables에 `.env.local.example`의 값을 등록합니다.
6. GitHub의 main 브랜치에 push할 때마다 Netlify가 자동으로 build/deploy합니다.

`netlify.toml`이 포함되어 있어 Node 22와 Next.js용 Netlify plugin을 사용합니다.

## 환경변수
필수 저장소:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

카카오:
- `KAKAO_REST_API_KEY`
- `KAKAO_REDIRECT_URI` — Netlify 운영 주소 기준 `/api/auth/kakao/callback`

Toss Payments:
- `TOSS_SECRET_KEY`
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`

Web Push:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

## 중요
현재 버전은 **서비스 UI/기능 흐름과 외부 서비스 연결 지점이 포함된 V2 프로토타입**입니다.
실제 상용 서비스 전환 시에는 반드시 다음을 서버 측에서 강화해야 합니다.

- 이메일/비밀번호의 실제 인증 및 비밀번호 해시
- 세션/JWT 또는 Auth.js 기반 인증
- 관리자 권한 서버 검증
- 예약 생성 시 DB 원자적 중복검사/트랜잭션
- Toss 결제 승인 및 webhook 검증
- 카카오 OAuth state/세션 검증
- Web Push subscription 저장 및 발송 서버
- 개인정보/약관/환불정책

브라우저에서만 상태를 변경하는 방식으로는 실서비스 보안을 보장할 수 없습니다.
