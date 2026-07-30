/**
 * ============================================================
 * CareVR PDF Theme
 * ============================================================
 *
 * Centralised styling for all PDF reports.
 *
 * No drawing logic should exist in this file.
 */

export const PdfTheme = {

    page: {

        width: 595,

        height: 842,

        margin: 40,

        contentWidth: 515

    },

    spacing: {

        xs: 4,

        sm: 8,

        md: 12,

        lg: 16,

        xl: 24,

        xxl: 32

    },

header: {

    titleGap: 28,

    subtitleGap: 18,

    dividerGap: 16,

    contentTopOffset: 90,

    pageBreakMargin: 140

},

card: {

    radius: 14,

    padding: 16,

    borderWidth: 1,

    gap: 14,

    minHeight: 150,

    headerTopOffset: 92,

    titleLeftOffset: 42,

    titleTopOffset: 10,

    badgeRightOffset: 90,

    badgeTopOffset: 6,

    metricsBottomOffset: 16

},

metricCard: {

    width: 105,

    height: 72,

    radius: 10,

    gap: 10,

    accentWidth: 4,

    titlePaddingTop: 16,

    valuePaddingBottom: 20

},

    icon: {

        outerCircle: 54,

        innerCircle: 38,

        size: 28

    },

    badge: {

        radius: 8,

        paddingX: 10,

        paddingY: 5

    },

typography: {

    reportTitle:22,

    reportSubtitle:16,

    sectionTitle:16,

    body:10,

    metricValue:16,

    metricLabel:8,

    badge:9,

    footer:8

},

    colors: {

        white: "#FFFFFF",

        black: "#111827",

        border: "#E5E7EB",

        divider: "#E2E8F0",

        subtitle: "#64748B",

        background: "#F8FAFC",

        blue: "#2563EB",

        blueLight: "#EFF6FF",

        red: "#EF4444",

        redLight: "#FEF2F2",

        green: "#16A34A",

        greenLight: "#F0FDF4",

        orange: "#F97316",

        orangeLight: "#FFF7ED",

        purple: "#9333EA",

        purpleLight: "#FAF5FF"

    }

} as const;

export type PdfThemeType = typeof PdfTheme;