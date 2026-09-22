/** 단어 끝 글자에 받침이 있는지 확인한다. */
export function hasBatchim(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  if (code < 0 || code > 11171) return false
  return code % 28 !== 0
}

/** 받침에 맞는 조사를 붙인다. 예) josa('말투', '이', '가') → '말투가' */
export function josa(word, withBatchim, withoutBatchim) {
  return word + (hasBatchim(word) ? withBatchim : withoutBatchim)
}

/** 목록을 "A, B와 C" 형태로 잇는다. */
export function joinWithAnd(words) {
  if (words.length <= 1) return words.join('')
  const head = words.slice(0, -1)
  const last = words[words.length - 1]
  return `${head.slice(0, -1).map((w) => `${w}, `).join('')}${josa(head[head.length - 1], '과', '와')} ${last}`
}
