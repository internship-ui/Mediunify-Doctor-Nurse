import { Platform, Alert } from 'react-native';

/**
 * Polyfills Alert.alert on web so multi-button alerts (like confirm/cancel)
 * execute button callbacks properly instead of being silently swallowed.
 */
export function setupWebAlertPolyfill() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const originalAlert = Alert.alert;

  Alert.alert = function (title, message, buttons, options) {
    if (!buttons || buttons.length <= 1) {
      const text = [title, message].filter(Boolean).join('\n\n');
      window.alert(text);
      if (buttons && buttons[0] && typeof buttons[0].onPress === 'function') {
        buttons[0].onPress();
      }
      return;
    }

    // Two buttons: typically Cancel and Confirm
    if (buttons.length === 2) {
      const cancelBtn = buttons.find((b) => b.style === 'cancel') || buttons[0];
      const confirmBtn = buttons.find((b) => b !== cancelBtn) || buttons[1];

      const text = [title, message].filter(Boolean).join('\n\n');
      const confirmed = window.confirm(text);

      if (confirmed) {
        if (confirmBtn && typeof confirmBtn.onPress === 'function') {
          confirmBtn.onPress();
        }
      } else {
        if (cancelBtn && typeof cancelBtn.onPress === 'function') {
          cancelBtn.onPress();
        }
      }
      return;
    }

    // 3 or more buttons: fallback to original alert
    originalAlert.call(Alert, title, message, buttons, options);
  };
}
