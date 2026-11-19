# 동빈한의원 홈페이지 (Eleventy)

- `npm install` → `npm start`(미리보기) / `npm run build`(→ `_site/`)
- 증상 추가·수정: `src/_data/treatments.json` (group 값은 `groups.json`의 id)
- 진료시간·전화·예약 링크: `src/_data/site.json`
- 배포: `.github/workflows/deploy.yml` (GitHub Pages, `src/CNAME` 포함)
- 한약 섹션: `treatments.json`의 `herbal`(root, baseLine, base[기본방 이름], patterns[name, desc, add 2개])에서 자동 생성 (질환 페이지 `#herbal`, 공통 `herbal.html`)
- 병명 태그: `targets` 배열 / 건보 첩약 표시: `insurance: true` / 주의 문구: `alert`(현재 뇌혈관질환 후유증만) / 추가 안내 한 줄: `note`
- 공통 한약 페이지 문구: `src/herbal.njk`, 시각화 틀: `src/_includes/partials/herbal-viz.njk`
