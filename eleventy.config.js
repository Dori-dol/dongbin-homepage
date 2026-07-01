module.exports = function (eleventyConfig) {
  // 정적 자원은 그대로 복사 (이미지, 스타일시트, 사이트 인증/설정 파일)
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy(
    "src/naver1076906c0b632364085ffe8df9383a15.html"
  );
  eleventyConfig.ignores.add(
    "src/naver1076906c0b632364085ffe8df9383a15.html"
  );

  // 진료과목이 늘어나도 파일 변경을 즉시 반영하도록 워치 대상에 데이터 폴더 포함
  eleventyConfig.addWatchTarget("src/_data");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
