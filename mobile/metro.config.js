// 웹앱(../src)의 규칙 엔진을 그대로 가져다 쓰기 위해 상위 src 폴더도 Metro가 읽게 한다.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '../src')];

module.exports = config;
