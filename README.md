# 안전빵 - Vercel 배포 가이드

**완전 무료**로 5~10분 안에 진짜 작동하는 안전빵 사이트를 만듭니다.

## ✨ 주요 기능

- 🍞 **네이버 플레이스 분석** - 식당·카페·병원·미용실 등 모든 장소
- 🆕 **블로그 리뷰 깊은 분석** - 광고 자동 필터링 + 진짜 후기만 인사이트
- 📸 **이미지 캡처 분석** - 야놀자·여기어때 등 모든 사이트 (OpenAI Vision)
- 💚 **직관적 점수 시스템** - 100점=가장 안전, 0점=가장 위험 (이모지 라벨)
- 📊 **속성별 점수** - 맛/위생/응대/가성비/분위기
- 🎯 **개인 시나리오** - 내 상황에 맞춘 손실 시뮬레이션
- 📁 **담아두기 + 비교** - 여러 곳 동시 비교 분석

## 📦 이 폴더 안에 있는 것

```
safebbang-vercel/
├── api/
│   ├── analyze-naver.js    ← 네이버 플레이스 분석 (Apify + OpenAI)
│   ├── analyze-image.js    ← 이미지 분석 (OpenAI Vision)
│   ├── analyze-blog.js     ← 🆕 블로그 리뷰 깊은 분석 (광고 필터링)
│   ├── compare.js          ← 비교 분석
│   └── scenario.js         ← 개인 시나리오
├── public/
│   ├── index.html          ← 안전빵 메인 페이지
│   ├── app.js              ← React 앱 (CDN으로 작동)
│   ├── manifest.json       ← PWA (홈화면 추가)
│   ├── favicon.png         ← 빵 파비콘
│   └── logo/               ← 빵 로고 (6가지 사이즈)
├── vercel.json
└── package.json
```

---

## 🚀 배포 단계 (5~10분)

### 준비물 체크리스트
- [ ] GitHub 계정 (없으면 1분만에 만들기: https://github.com/signup)
- [ ] Vercel 계정 (GitHub로 연동, 1분)
- [ ] Apify 토큰 (이미 발급받으셨죠? 아니면 https://console.apify.com)
- [ ] OpenAI 키 (이미 발급받으셨죠? 아니면 https://platform.openai.com)

---

### 1단계: GitHub에 코드 올리기

#### 방법 A: GitHub 웹사이트에서 (가장 쉬움)

1. https://github.com 로그인
2. 우측 상단 **"+"** → **"New repository"**
3. Repository name: `safebbang` (아무 이름 OK)
4. **Public** 선택 (Private도 가능)
5. **"Create repository"** 클릭
6. **"uploading an existing file"** 링크 클릭
7. 이 폴더의 모든 파일을 **드래그해서 업로드**
   - `api` 폴더, `public` 폴더, `vercel.json`, `package.json`, `.gitignore` 모두
   - `.env`는 절대 올리지 마세요! (.gitignore에 자동 제외됨)
8. **"Commit changes"** 클릭

#### 방법 B: 터미널에서 (개발자라면)

```bash
cd safebbang-vercel
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/safebbang.git
git push -u origin main
```

---

### 2단계: Vercel에 연결하기

1. https://vercel.com 접속
2. **"Sign Up"** 클릭 → **"Continue with GitHub"** 선택
3. GitHub 승인
4. 대시보드에서 **"Add New..."** → **"Project"**
5. 방금 만든 `safebbang` 저장소 찾아서 **"Import"**

---

### 3단계: 환경변수 입력 (가장 중요!)

Import 화면에서 **"Environment Variables"** 섹션 펼치기.

다음 2개를 **꼭** 입력하세요:

| Key | Value |
|---|---|
| `APIFY_TOKEN` | `apify_api_...` (본인 토큰) |
| `OPENAI_API_KEY` | `sk-...` (본인 키) |

각각 입력 후 **"Add"** 버튼 클릭.

✅ 두 개 다 추가되면 **"Deploy"** 클릭.

---

### 4단계: 배포 완료 (2~3분 기다리기)

Vercel이 자동으로 빌드 + 배포합니다.

완료되면 화면에 URL이 뜹니다:
```
🎉 https://safebbang-xxxxx.vercel.app
```

이 URL이 **진짜 작동하는 안전빵 사이트**입니다!

---

## ✅ 작동 테스트

1. 위 URL로 접속
2. **"네이버 플레이스 링크로 분석"** 클릭
3. 테스트용 URL 붙여넣기:
   ```
   https://pcmap.place.naver.com/restaurant/1085956231/review/visitor
   ```
4. **"손해 위험 분석 시작"** 클릭
5. 30~60초 후 결과 표시되면 성공! 🎉

---

## 🐛 문제 해결

### "서버 설정 오류: API 키 미설정"
→ Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables** 확인
→ `APIFY_TOKEN`과 `OPENAI_API_KEY` 둘 다 있는지
→ 추가 후 **"Redeploy"** 필수

### "Apify 크레딧 부족"
→ Apify는 매월 1일 $5 자동 충전됨
→ 또는 https://console.apify.com 에서 충전

### "AI 분석 실패"
→ OpenAI 키가 유효한지, 잔액 있는지 확인
→ https://platform.openai.com/usage

### "네이버 플레이스 ID를 찾을 수 없습니다"
→ 지원 URL 형식:
   - `https://pcmap.place.naver.com/restaurant/1085956231/review/visitor`
   - `https://m.place.naver.com/restaurant/1085956231`
   - `https://map.naver.com/p/entry/place/1085956231`
   - 단축 URL `naver.me/xxx`는 미지원 (펼친 URL 사용)

---

## 💰 비용 정리

| 항목 | 비용 |
|---|---|
| Vercel 호스팅 | **무료** (월 100GB 트래픽까지) |
| Apify 크롤링 | **무료** (월 $5 크레딧 자동 지급, 500번 분석) |
| OpenAI 분석 | 최초 충전 $5 (5,000번 분석) |
| 도메인 | **무료** (`.vercel.app` 서브도메인) |

**실질 비용**: OpenAI $5 한 번만.

---

## 🌐 커스텀 도메인 (선택)

`safebbang.com` 같은 자체 도메인 원하면:
1. 도메인 구매 (가비아, 후이즈, Namecheap 등) - 연 1~2만원
2. Vercel 대시보드 → **Settings** → **Domains** → 도메인 추가
3. Vercel이 자동으로 DNS 설정 안내

---

## 📱 모바일에서 사용

배포된 URL을 모바일 브라우저에서 열고:
- **iOS Safari**: 공유 버튼 → "홈 화면에 추가"
- **안드로이드 크롬**: 메뉴 → "홈 화면에 추가"

→ 앱처럼 작동합니다 (PWA).

---

## 🔧 코드 수정 후 재배포

GitHub에 푸시하면 Vercel이 **자동으로 재배포**합니다.
- 환경변수만 바꿨다면 Vercel에서 "Redeploy" 클릭

---

## ⚠️ 보안 주의사항

- `.env` 파일은 **절대** GitHub에 올리지 마세요 (이미 `.gitignore`에 들어있음)
- API 키는 Vercel 환경변수에만 저장
- 공개 URL이라 누구나 접속 가능 → 사용량 모니터링 필요
- 과도한 사용 방지 위해 나중에 rate limiting 추가 권장

---

## 🎯 다음 단계

배포 잘 됐다면:
1. **친구·지인에게 공유**해서 피드백 받기
2. **사용 데이터 수집** (어떤 URL 많이 분석되는지)
3. **GA/Plausible** 같은 무료 분석 도구 붙이기
4. **사장님 B2B 페이지** 추가 (수익 모델)
