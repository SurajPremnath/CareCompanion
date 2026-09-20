"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Turnstile,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";

export interface PasskeyCaptchaHandle {
  getToken: () => Promise<string>;
}

const PasskeyCaptcha = forwardRef<
  PasskeyCaptchaHandle,
  object
>(function PasskeyCaptcha(_props, ref) {
  const turnstileRef =
    useRef<TurnstileInstance>(null);

  useImperativeHandle(
    ref,
    () => ({
      getToken: async () => {
        const turnstile =
          turnstileRef.current;

        if (!turnstile) {
          throw new Error(
            "Passkey security verification is not ready."
          );
        }

        turnstile.execute();

        try {
          const token =
            await turnstile.getResponsePromise();

          if (!token) {
            throw new Error(
              "Unable to complete Passkey security verification."
            );
          }

          return token;
        } finally {
          turnstile.reset();
        }
      },
    }),
    []
  );

  return (
<Turnstile
  ref={turnstileRef}
  siteKey={
    process.env
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
  }
  options={{
    size: "invisible",
    execution: "execute",
    appearance: "execute",
    responseField: false,
  }}
/>
  );
});

PasskeyCaptcha.displayName =
  "PasskeyCaptcha";

export default PasskeyCaptcha;