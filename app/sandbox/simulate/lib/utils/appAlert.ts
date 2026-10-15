export const AppAlert = {
  success(message: string): void {
    window.alert(`✅ ${message}`);
  },

  error(message: string): void {
    window.alert(`❌ ${message}`);
  },

  warning(message: string): void {
    window.alert(`⚠️ ${message}`);
  },

  info(message: string): void {
    window.alert(message);
  },

  confirm(message: string): boolean {
    return window.confirm(message);
  },
};