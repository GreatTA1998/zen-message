import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useKeyboardInset() {
  const [keyboard, setKeyboard] = useState(0);
  const { bottom: safeBottom } = useSafeAreaInsets();
  useEffect(() => {
    if (Platform.OS === 'web') {
      const update = () => {
        const viewport = window.visualViewport;
        setKeyboard(viewport ? Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop)) : 0);
      };
      update();
      window.visualViewport?.addEventListener('resize', update);
      window.visualViewport?.addEventListener('scroll', update);
      return () => {
        window.visualViewport?.removeEventListener('resize', update);
        window.visualViewport?.removeEventListener('scroll', update);
      };
    }
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (event) => setKeyboard(Math.max(0, Math.round(event?.endCoordinates?.height ?? 0))));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboard(0));
    return () => { show.remove(); hide.remove(); };
  }, []);
  return Platform.OS === 'web' || !keyboard ? keyboard : Math.max(0, keyboard - safeBottom);
}