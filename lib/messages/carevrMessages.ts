export const carevrMessages = {
  registration: {
    primaryCompleted: {
      type: "success",
      title: "Welcome to CareVR Care Family! 💙",
      message:
        "Your Care Family is ready to begin its journey with CareVR. We're here to make caring for yourself and your loved ones simpler, more connected, and more informed.",
      footer:
        "We look forward to serving you and your family.",
    },
  },

  patient: {
    registrationCompleted: {
      type: "success",
      title: "Patient Added Successfully",
      message:
        "The patient has been successfully added to your Care Family.",
    },
  },

  alerts: {
    error: {
      type: "error",
      title: "Something went wrong",
      message:
        "We were unable to complete your request. Please try again.",
    },

    warning: {
      type: "warning",
      title: "Please check your information",
      message:
        "Please review the information provided and try again.",
    },

    info: {
      type: "info",
      title: "Information",
      message: "",
    },
  },
} as const;
