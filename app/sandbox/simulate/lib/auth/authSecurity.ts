export type AuthSecurityState = {
  captchaToken: string | null;
};

export const authSecurity = {
  createState(): AuthSecurityState {
    return {
      captchaToken: null,
    };
  },

  setCaptchaToken(
    state: AuthSecurityState,
    token: string
  ): AuthSecurityState {
    return {
      ...state,
      captchaToken: token,
    };
  },

  clearCaptchaToken(
    state: AuthSecurityState
  ): AuthSecurityState {
    return {
      ...state,
      captchaToken: null,
    };
  },

  requireCaptchaToken(
    token: string | null
  ): string {
    if (!token) {
      throw new Error(
        "Please complete the security verification."
      );
    }

    return token;
  },
};
