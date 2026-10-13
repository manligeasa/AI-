import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

/**
 * Lottie 탭 아이콘. 부모가 bounce()를 부르면 한 번 통통 튄다.
 * 쉬는 동안에는 애니메이션의 첫 장면(제자리 모습)을 보여 준다.
 */
const BouncyTabIcon = forwardRef(function BouncyTabIcon({ source, size = 44, active }, ref) {
  const lottie = useRef(null);

  useImperativeHandle(ref, () => ({
    bounce: () => {
      lottie.current?.reset();
      lottie.current?.play(0);
    },
  }));

  return (
    <View style={[{ width: size, height: size }, !active && styles.inactive]}>
      <LottieView
        ref={lottie}
        source={source}
        autoPlay={false}
        loop={false}
        style={{ width: size, height: size }}
        webStyle={{ width: size, height: size }}
      />
    </View>
  );
});

export default BouncyTabIcon;

const styles = StyleSheet.create({
  inactive: { opacity: 0.4 },
});
