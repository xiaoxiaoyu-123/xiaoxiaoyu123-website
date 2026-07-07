/**
 * LRC 歌词解析器
 * 将 LRC 格式文本解析为 { time: number, text: string }[] 数组
 *
 * 支持格式:
 *   [00:12.00]第一句歌词
 *   [00:17.50]第二句歌词
 *   [01:02.00]第三句歌词
 *
 * @param {string} lrcText - LRC 格式的歌词文本
 * @returns {Array<{ time: number, text: string }>} 按时间排序的歌词数组
 */
export function parseLrc(lrcText) {
  if (!lrcText) return [];

  const lines = lrcText.split('\n');
  const result = [];

  // 匹配 [mm:ss.xx] 或 [mm:ss] 格式
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;
  // 匹配标签如 [ti:标题], [ar:歌手], [by:作者] 等
  const tagRegex = /^\[(ti|ar|al|by|offset|re|ve)\s*:.*\]$/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 跳过元数据标签
    if (tagRegex.test(trimmed)) continue;

    // 提取时间戳和文本
    const match = trimmed.match(timeRegex);
    if (!match) continue;

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    let millis = 0;
    if (match[3]) {
      millis = parseInt(match[3].padEnd(3, '0'), 10);
    }

    const time = minutes * 60 + seconds + millis / 1000;
    const text = trimmed.replace(timeRegex, '').trim();

    if (text) {
      result.push({ time, text });
    }
  }

  // 按时间排序
  result.sort((a, b) => a.time - b.time);

  return result;
}

/**
 * 将歌词数组转换为 LRC 文本（反向转换）
 * @param {Array<{ time: number, text: string }>} lyricsData
 * @returns {string} LRC 格式文本
 */
export function toLrcText(lyricsData) {
  if (!lyricsData || lyricsData.length === 0) return '';

  return lyricsData
    .map(({ time, text }) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      const centiseconds = Math.floor((time % 1) * 100);
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');
      const cs = String(centiseconds).padStart(2, '0');
      return `[${mm}:${ss}.${cs}]${text}`;
    })
    .join('\n');
}
