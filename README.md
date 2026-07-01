# 동빈한의원 홈페이지 (Eleventy 버전)

기존 정적 HTML(9개 진료과목 페이지 + 홈페이지)을 **11ty(Eleventy)** 기반으로 리팩터링한 버전입니다.
`dongbin-homepage-main.zip`(현재 호스팅 중인 디자인)을 기본 디자인으로 삼고,
`dongbin-homepage.zip`에만 있던 4개 진료과목(만성기침·역류성식도염·생리통·안면신경마비)을 데이터로 추가했습니다.

## 왜 11ty로 바꿨나요?

기존 방식은 진료과목이 하나 늘어날 때마다:
1. 새 HTML 파일을 만들고
2. **기존 9~10개 파일 전부**에서 상단 드롭다운 메뉴(`진료과목`)를 일일이 손으로 추가해야 했습니다.

11ty 버전에서는 `src/_data/treatments.json`에 항목 하나만 추가하면:
- 새 진료과목 상세 페이지(`/새슬러그.html`)가 자동 생성되고
- **모든 페이지의 드롭다운 메뉴에도 자동으로 반영**됩니다.

## 폴더 구조

```
├── eleventy.config.js        # 11ty 설정 (입출력 폴더, 정적 파일 복사 규칙)
├── package.json
└── src/
    ├── _data/
    │   ├── site.json          # 전화번호·주소·블로그 링크 등 한의원 공통 정보
    │   └── treatments.json    # 진료과목 9개 (제목, 증상, 원인, 치료법 등 전체 콘텐츠)
    ├── _includes/
    │   ├── layouts/
    │   │   ├── base.njk        # 모든 페이지의 공통 뼈대 (head, header, footer, script)
    │   │   └── treatment.njk   # 진료과목 상세 페이지 레이아웃 (hero/카드/사이드/관련링크)
    │   └── partials/
    │       ├── header.njk      # 상단 네비게이션 (드롭다운 메뉴를 treatments.json에서 자동 생성)
    │       ├── footer.njk
    │       └── menu-script.njk # 모바일 메뉴 토글 스크립트
    ├── index.njk               # 홈페이지 (히어로/진료과목 그리드/한의원 소개/오시는 길)
    ├── treatment.njk           # 진료과목 데이터로 disc.html, cervical.html 등을 자동 생성 (pagination)
    ├── style.css               # 기존 main 버전 CSS 그대로 사용
    ├── images/                 # 기존 이미지 전체 (main 기준 + 신규 이미지 1개 여분 포함)
    ├── robots.txt
    ├── CNAME
    └── naver1076906c0b632364085ffe8df9383a15.html
```

## 새 진료과목을 추가하는 방법

`src/_data/treatments.json` 배열 맨 끝에 아래와 같은 객체를 하나 추가하고 저장하면 끝입니다.

```json
{
  "slug": "새주소",                         // 결과물: /새주소.html
  "order": 10,
  "navLabel": "메뉴에 표시될 이름",
  "heroClass": "spine",                    // spine / elbow / shoulder / neck 중 선택 (없으면 기본 그라데이션)
  "eyebrow": "영문 소제목",
  "pageTitle": "브라우저 탭 제목 | 동빈한의원",
  "metaDescription": "검색엔진에 노출될 요약 설명",
  "ogImage": "images/dongbin_LOGO.svg",
  "heroTitle": "페이지 상단 큰 제목",
  "heroDesc": "페이지 상단 부제목",
  "cards": [
    { "heading": "이런 증상이 있으신가요?", "html": "<ul class=\"check-list\"><li>...</li></ul>" },
    { "heading": "원인", "html": "<p>...</p>" },
    { "heading": "동빈한의원 치료", "html": "<p>...</p>" }
  ],
  "sideLabel": "연산토곡 통증클리닉",
  "sideDesc": "한 줄 설명",
  "relatedTitle": "다른 척추·관절 질환 보기",
  "relatedDesc": "설명",
  "homeCard": { "title": "홈 화면 카드 제목", "desc": "홈 화면 카드 설명" }
}
```

`cards`의 `html` 값은 기존 페이지들처럼 `<strong>`, `<ul class="check-list">`,
`<div class="mo-infobox">` 등 원하는 HTML을 그대로 넣을 수 있습니다 (그대로 렌더링됩니다).

## 로컬에서 실행하기

```bash
npm install
npm start        # http://localhost:8080 에서 미리보기 (파일 변경 시 자동 새로고침)
npm run build     # _site/ 폴더에 최종 정적 파일 생성 (배포용)
```

## 배포

`npm run build` 후 생성되는 `_site/` 폴더의 내용을 그대로 GitHub Pages(또는 기존 호스팅)에 올리면 됩니다.
URL 구조(`/disc.html`, `/cervical.html` 등)는 기존과 완전히 동일하게 유지되므로,
네이버/구글에 색인된 기존 링크나 CNAME(`dongbin.co.kr`) 설정에 영향이 없습니다.

## 참고 사항 (확인이 필요할 수 있는 부분)

- `src/_data/site.json`의 `baseUrl`은 기존 HTML의 canonical/OG 태그에 있던 값
  (`https://dori-dol.github.io/dongbin-homepage`)을 그대로 유지했습니다. 다만 `CNAME` 파일은
  `dongbin.co.kr`로 설정되어 있어, 실제 서비스 도메인과 SEO 태그의 도메인이 다를 수 있습니다.
  실제 도메인이 `dongbin.co.kr`이 맞다면 `site.json`의 `baseUrl`을 수정해 주세요.
- 새로 늘어난 4개 진료과목(만성기침/역류성식도염/생리통/안면신경마비) 페이지는 아직 `style.css`에
  전용 hero 배경 클래스가 없어(기존 `foot` 페이지와 동일하게) 기본 그라데이션 배경을 사용합니다.
  전용 색상을 원하시면 `style.css`의 `.detail-hero.spine / .elbow / .neck` 규칙 근처에
  `.detail-hero.gerd`, `.detail-hero.cramps` 등을 추가해드릴 수 있습니다.
- 홈페이지의 "회복 단계별 안내" 이미지는 기존 main 버전 이미지(`when_recovery.png`)를 그대로 사용했습니다.
  새 버전 zip에 있던 `언제나을까요.jpg`는 `src/images/`에 함께 포함해 두었으니, 교체를 원하시면
  `src/index.njk`에서 이미지 경로만 바꾸면 됩니다.
