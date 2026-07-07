import { useState, useEffect, useMemo } from 'react';
import { parseLrc } from '../utils/lrcParser';

/**
 * 歌词同步 hook
 *
 * 用法:
 *   const { currentLineIndex, lyricsData } = useLyrics(lyricsSource, currentTime);
 *
 * @param {Array<{time:number, text:string}> | string} source - 歌词数据数组 或 LRC 文本字符串
 * @param {number} currentTime - 音频当前播放秒数
 * @returns {{ currentLineIndex: number, lyricsData: Array<{time:number, text:string}> }}
 */
export function useLyrics(source, currentTime) {
  // 解析歌词数据：支持数组或 LRC 文本
  const lyricsData = useMemo(() => {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (typeof source === 'string') return parseLrc(source);
    return [];
  }, [source]);

  // 计算当前行索引
  const currentLineIndex = useMemo(() => {
    if (!lyricsData.length || typeof currentTime !== 'number') return 0;

    // 从后往前找，找到最后一个 time <= currentTime 的行
    for (let i = lyricsData.length - 1; i >= 0; i--) {
      if (currentTime >= lyricsData[i].time) {
        return i;
      }
    }
    return 0;
  }, [lyricsData, currentTime]);

  return { currentLineIndex, lyricsData };
}
