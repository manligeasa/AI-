/**
 * 빌드 결과(dist)를 HTML 파일 하나로 묶는다.
 * 서버 없이 한 파일만 올려도 되는 곳(claude.ai 아티팩트 등)에 공유할 때 쓴다.
 * 사용: npm run build:artifact → dist-artifact/ai-question-coach.html
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'

const assets = readdirSync('dist/assets')
const read = (ext) => assets.filter((f) => f.endsWith(ext)).map((f) => readFileSync(`dist/assets/${f}`, 'utf8')).join('\n')

const css = read('.css')
// 스크립트 안의 </script 문자열이 HTML 태그를 닫지 않도록 막는다
const js = read('.js').replace(/<\/script/gi, '<\\/script')

const html = `<title>AI 질문 코치</title>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`

mkdirSync('dist-artifact', { recursive: true })
writeFileSync('dist-artifact/ai-question-coach.html', html)
console.log(`dist-artifact/ai-question-coach.html (${Math.round(html.length / 1024)} KB)`)
