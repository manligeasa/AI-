import { Pressable, Text } from 'react-native';
import { useHint } from '../i18n/HintContext';

/**
 * 길게 누르면 모국어 힌트가 뜨는 한국어 글자.
 * - 글자가 그대로 번역 사전의 열쇠가 된다.
 * - 숫자가 섞인 글자는 hint에 틀('문제 {n} / {total}')을, params에 값을 넘긴다.
 * containerStyle: 바깥 누름 영역 모양 (가로 줄 안에서 늘어나야 할 때 등)
 */
export default function HintText({ hint, params, children, style, containerStyle, ...rest }) {
  const { show } = useHint();
  const key = hint ?? (typeof children === 'string' ? children : null);
  if (!key) return <Text style={style} {...rest}>{children}</Text>;
  return (
    <Pressable onLongPress={(e) => show(key, params, e)} delayLongPress={400} style={containerStyle} accessibilityHint="길게 누르면 모국어 힌트">
      <Text style={style} {...rest}>
        {children}
      </Text>
    </Pressable>
  );
}
