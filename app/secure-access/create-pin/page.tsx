"use client";

import React, {
    Suspense,
    useEffect,
    useState,
    useRef,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import MobileHeader, {
    type MobileCareMode,
} from "@/Components/common/MobileHeader";

import CareVRFooter from "@/Components/common/CareVRFooter";

import CareVRDashboardHandoffAnimation from "@/Components/common/CareVRDashboardHandoffAnimation";

import { supabase } from "@/lib/supabase";


import {
    profileRepository,
} from "@/lib/repositories/profileRepository";

import { authService } from "@/lib/auth/authService";

/*
import {
    validateInvitedUserLogin,
} from "@/lib/invitations/invitedUserLoginValidation";
*/

import {
    consentRepository,
} from "@/lib/consent/repository/consentRepository";

import {
    resolveCareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";

import {
    carevrContextResolver,
} from "@/lib/auth/carevrContextResolver";


import {
    carevrAuthorizationHandoff,
} from "@/lib/authorization/carevrAuthorizationHandoff";


// ============================================================
// SECURE ACCESS ANIMATION â€” VISUAL ONLY
// ============================================================

const stages = [
    {
        key: "preparing",
        title: "Preparing your",
        accent: "CareVR experience",
        description: "Just a moment while we set things up for you.",
    },
    {
        key: "verifying",
        title: "Verifying",
        accent: "Your Access",
        description: "Checking your CareVR access and permissions...",
    },
    {
        key: "verified",
        title: "Access Verified",
        accent: "",
        description: "Your CareVR access has been confirmed.",
    },
    {
        key: "dashboard",
        title: "Opening",
        accent: "CareVR Dashboard",
        description: "Finalizing your secure access...",
    },
    {
        key: "welcome",
        title: "Welcome to",
        accent: "CareVR",
        description: "You're all set!",
    },
];


function PreparingIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="prepSky"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#dceaff" />
                    <stop offset="55%" stopColor="#e9dcff" />
                    <stop offset="100%" stopColor="#f8d9f2" />
                </linearGradient>

                <linearGradient
                    id="prepMountain"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#91b8ed" />
                    <stop offset="100%" stopColor="#a979d5" />
                </linearGradient>

                <linearGradient
                    id="prepHeart"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#ef6cb7" />
                    <stop offset="100%" stopColor="#aa55dc" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="76"
                fill="url(#prepSky)"
                opacity="0.72"
            />

            <path
                d="M18 119 Q44 92 67 111 Q91 76 111 103 Q135 79 162 116 V145 H18Z"
                fill="url(#prepMountain)"
                opacity="0.72"
            />

            <path
                d="M20 130 Q48 110 73 128 Q99 104 120 122 Q143 103 160 126 V151 H20Z"
                fill="#8ba9d9"
                opacity="0.42"
            />

            <path
                d="M91 108
                   C77 119 70 129 76 139
                   C82 148 102 150 116 144
                   C127 139 130 132 123 127
                   C117 123 105 125 96 129"
                fill="none"
                stroke="rgba(255,255,255,0.92)"
                strokeWidth="7"
                strokeLinecap="round"
            />

            <path
                d="M90 96
                   C82 88 69 91 69 102
                   C69 114 83 122 90 127
                   C97 122 111 114 111 102
                   C111 91 98 88 90 96Z"
                fill="url(#prepHeart)"
            />
        </svg>
    );
}

function VerifyingIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="shieldGlow">
                    <stop offset="0%" stopColor="#b98cff" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#7b6bea" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#6759dd" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                    id="shieldGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#6c8df2" />
                    <stop offset="52%" stopColor="#7558df" />
                    <stop offset="100%" stopColor="#a83fd2" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="72"
                fill="url(#shieldGlow)"
            />

            <circle
                cx="90"
                cy="90"
                r="54"
                fill="#d8d1ff"
                opacity="0.48"
            />

            <path
                d="M90 36 L130 51 V79
                   C130 106 114 127 90 139
                   C66 127 50 106 50 79 V51Z"
                fill="url(#shieldGradient)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="3"
            />

            <rect
                x="69"
                y="78"
                width="42"
                height="35"
                rx="7"
                fill="rgba(255,255,255,0.22)"
            />

            <path
                d="M78 78 V68
                   C78 51 102 51 102 68 V78"
                fill="none"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
            />

            <circle
                cx="90"
                cy="94"
                r="5"
                fill="white"
            />

            <circle cx="31" cy="70" r="4" fill="#9e76ef" />
            <circle cx="146" cy="59" r="3" fill="#b85ce0" />
            <circle cx="143" cy="119" r="4" fill="#6f8df1" />
            <circle cx="40" cy="123" r="3" fill="#8a72e8" />
        </svg>
    );
}

function VerifiedIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="verifiedGlow">
                    <stop offset="0%" stopColor="#64f1d8" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#48d9d2" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#48d9d2" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                    id="verifiedCircle"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#58e7ca" />
                    <stop offset="100%" stopColor="#20c9c9" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="75"
                fill="url(#verifiedGlow)"
            />

            <circle
                cx="90"
                cy="90"
                r="49"
                fill="url(#verifiedCircle)"
            />

            <circle
                cx="90"
                cy="90"
                r="42"
                fill="rgba(255,255,255,0.14)"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2"
            />

            <path
                d="M66 91 L82 107 L116 72"
                fill="none"
                stroke="white"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle cx="34" cy="72" r="4" fill="#54d6d2" />
            <circle cx="45" cy="47" r="3" fill="#6d9af1" />
            <circle cx="140" cy="51" r="4" fill="#58d8ce" />
            <circle cx="151" cy="79" r="3" fill="#77e6cf" />
            <circle cx="145" cy="125" r="4" fill="#5f9ae9" />
            <circle cx="48" cy="130" r="3" fill="#66d8d0" />
        </svg>
    );
}

function ContextIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="contextGlow">
                    <stop offset="0%" stopColor="#9d83ff" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#9d83ff" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                    id="layerOne"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#8a9cf4" />
                    <stop offset="100%" stopColor="#6f69dd" />
                </linearGradient>

                <linearGradient
                    id="layerTwo"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#9374ec" />
                    <stop offset="100%" stopColor="#7454d2" />
                </linearGradient>

                <linearGradient
                    id="layerThree"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#a876eb" />
                    <stop offset="100%" stopColor="#6c55ce" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="75"
                fill="url(#contextGlow)"
            />

            <g transform="translate(0 4)">
                <path
                    d="M47 77 L91 53 L137 77 L91 102Z"
                    fill="url(#layerOne)"
                    opacity="0.68"
                />
                <path
                    d="M47 77 V92 L91 117 L137 92 V77 L91 102Z"
                    fill="#7580df"
                    opacity="0.62"
                />
            </g>

            <g transform="translate(0 -8)">
                <path
                    d="M47 77 L91 53 L137 77 L91 102Z"
                    fill="url(#layerTwo)"
                    opacity="0.86"
                />
                <path
                    d="M47 77 V92 L91 117 L137 92 V77 L91 102Z"
                    fill="#6d5dd0"
                    opacity="0.78"
                />
            </g>

            <g transform="translate(0 -20)">
                <path
                    d="M47 77 L91 53 L137 77 L91 102Z"
                    fill="url(#layerThree)"
                />
                <path
                    d="M47 77 V92 L91 117 L137 92 V77 L91 102Z"
                    fill="#684bc2"
                />
            </g>

            <circle cx="37" cy="73" r="3" fill="#a678ef" />
            <circle cx="143" cy="72" r="4" fill="#8a77e8" />
            <circle cx="131" cy="42" r="3" fill="#c27bea" />
        </svg>
    );
}

function DashboardIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="rocketGlow">
                    <stop offset="0%" stopColor="#b08cff" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#b08cff" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                    id="rocketBody"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#8d8df5" />
                    <stop offset="55%" stopColor="#7658df" />
                    <stop offset="100%" stopColor="#b052d5" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="76"
                fill="url(#rocketGlow)"
            />

            <g transform="rotate(35 90 90)">
                <path
                    d="M90 42
                       C111 49 123 69 119 93
                       L111 122
                       L82 111
                       L71 82
                       C70 63 78 48 90 42Z"
                    fill="url(#rocketBody)"
                    stroke="rgba(255,255,255,0.82)"
                    strokeWidth="3"
                />

                <circle
                    cx="96"
                    cy="70"
                    r="9"
                    fill="rgba(255,255,255,0.86)"
                />

                <path
                    d="M78 107 L62 121 L77 119 L70 135 L92 113Z"
                    fill="#5c72dc"
                />

                <path
                    d="M105 116
                       C111 130 105 139 94 146
                       C95 136 91 130 84 126"
                    fill="none"
                    stroke="#cf72ea"
                    strokeWidth="9"
                    strokeLinecap="round"
                />
            </g>

            <circle cx="38" cy="58" r="4" fill="#8d83ef" />
            <circle cx="143" cy="50" r="3" fill="#b06de5" />
            <circle cx="143" cy="125" r="4" fill="#6f8de8" />
            <circle cx="46" cy="130" r="3" fill="#b275e4" />
        </svg>
    );
}

function WelcomeIcon() {
    return (
        <svg
            viewBox="0 0 180 180"
            className="care-icon"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="welcomeGlow">
                    <stop offset="0%" stopColor="#d88cff" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#b875ed" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#b875ed" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                    id="welcomeHeart"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#f15ca9" />
                    <stop offset="50%" stopColor="#cc4fd3" />
                    <stop offset="100%" stopColor="#9259df" />
                </linearGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="75"
                fill="url(#welcomeGlow)"
            />

            <path
                d="M90 119
                   C82 112 52 94 52 70
                   C52 54 63 46 75 46
                   C83 46 88 50 90 56
                   C92 50 97 46 105 46
                   C117 46 128 54 128 70
                   C128 94 98 112 90 119Z"
                fill="url(#welcomeHeart)"
            />

            <path
                d="M90 62
                   C87 54 80 51 74 52"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="4"
                strokeLinecap="round"
            />

            <circle cx="42" cy="77" r="3" fill="#a979eb" />
            <circle cx="137" cy="67" r="4" fill="#cf67dc" />
            <circle cx="133" cy="116" r="3" fill="#8d8be9" />
            <circle cx="50" cy="121" r="4" fill="#b978e8" />
        </svg>
    );
}

function StageIcon({ type }: { type: string }) {
    switch (type) {
        case "preparing":
            return <PreparingIcon />;
        case "verifying":
            return <VerifyingIcon />;
        case "verified":
            return <VerifiedIcon />;
        case "context":
            return <ContextIcon />;
        case "dashboard":
            return <DashboardIcon />;
        case "welcome":
            return <WelcomeIcon />;
        default:
            return null;
    }
}


// ============================================================
// function CreatePinContent()
// ============================================================


function CreatePinContent() {
    const router = useRouter();

const searchParams =
    useSearchParams();

const consentAccepted =
    searchParams.get(
        "consentAccepted"
    ) === "true";

const [pin, setPin] = useState("");
const [confirmPin, setConfirmPin] = useState("");
const [showPin, setShowPin] = useState(false);
const [showConfirmPin, setShowConfirmPin] = useState(false);
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);
const [userName, setUserName] = useState("");

const pinInputRef = useRef<HTMLInputElement>(null);

const [invitationContextReady, setInvitationContextReady] =
    useState(false);

const [showDashboardHandoff, setShowDashboardHandoff] =
    useState(false);

const [dashboardHandoffReady, setDashboardHandoffReady] =
    useState(false);

const [dashboardAnimationComplete, setDashboardAnimationComplete] =
    useState(false);

let invitedRole: string | null = null;
let familyId: string | null = null;

const invitedRoleRef =
    useRef<string | null>(null);

const familyIdRef =
    useRef<string | null>(null);

const authenticatedUserRef =
    useRef<{
        id: string;
    } | null>(null);


    useEffect(() => {
        pinInputRef.current?.focus();
    }, []);

useEffect(() => {
    if (!dashboardAnimationComplete) {
        return;
    }

    router.replace("/dashboard");
}, [
    dashboardAnimationComplete,
    router,
]);

/*
useEffect(() => {
    if (!consentAccepted) {
        return;
    }

    const timers = stages.map((_, index) =>
        window.setTimeout(() => {
            setAnimationVisibleCount(index + 1);
        }, index * 850)
    );

    return () => {
        timers.forEach((timer) =>
            window.clearTimeout(timer)
        );
    };
}, [consentAccepted]);
*/

useEffect(() => {
    let cancelled = false;

    const loadProfileName = async () => {
        try {
            const profile =
                await profileRepository
                    .getCurrentProfile();

            if (cancelled) {
                return;
            }

            setUserName(
                profile?.fullName?.trim() || ""
            );
        } catch (error) {
            console.error(
                "Unable to load profile name for Create PIN header.",
                error
            );
        }
    };

    void loadProfileName();

    return () => {
        cancelled = true;
    };
}, []);

const registrationContext =
    searchParams.get(
        "registrationContext"
    );

useEffect(() => {

    let cancelled = false;

    const loadCareVRContext = async () => {

        try {

const user =
    await authService.getCurrentUser();

if (!user?.id) {
    return;
}

authenticatedUserRef.current = {
    id: user.id,
};

            /*
             * =====================================================
             * PRODUCT
             *
             * Founder -> New Primary
             *
             * The Primary CareVR access record is the source of
             * the Primary context.
             * =====================================================
             */

            if (
                registrationContext ===
                "PRODUCT"
            ) {

                const {
                    data: access,
                    error: accessError,
                } =
                    await supabase
                        .from(
                            "carevr_access"
                        )
                        .select(
                            "access_type, family_id"
                        )
                        .eq(
                            "user_id",
                            user.id
                        )
                        .eq(
                            "access_type",
                            "PRIMARY"
                        )
                        .eq(
                            "access_status",
                            "ACTIVE"
                        )
                        .maybeSingle();

                if (cancelled) {
                    return;
                }

                if (accessError) {
                    throw new Error(
                        accessError.message
                    );
                }

                if (!access) {
                    throw new Error(
                        "Primary CareVR access is unavailable."
                    );
                }

                invitedRoleRef.current =
                    "PRIMARY";

                familyIdRef.current =
                    access.family_id;

                setInvitationContextReady(
                    true
                );

                return;
            }


            /*
             * =====================================================
             * INVITATION
             *
             * Primary -> Family Invitee
             *
             * Continue using the existing accepted
             * CareVR invitation context.
             * =====================================================
             */

            if (
                registrationContext ===
                "INVITATION"
            ) {

                const {
                    data: invitation,
                    error: invitationError,
                } =
                    await supabase
                        .from(
                            "carevr_invitation"
                        )
                        .select(
                            "role, family_id"
                        )
                        .eq(
                            "invited_user_id",
                            user.id
                        )
                        .eq(
                            "status",
                            "ACCEPTED"
                        )
                        .order(
                            "accepted_at",
                            {
                                ascending: false,
                            }
                        )
                        .limit(1)
                        .maybeSingle();

                if (cancelled) {
                    return;
                }

                if (invitationError) {
                    throw new Error(
                        invitationError.message
                    );
                }

                if (!invitation) {
                    throw new Error(
                        "CareVR invitation context is unavailable."
                    );
                }

                invitedRoleRef.current =
                    invitation.role;

                familyIdRef.current =
                    invitation.family_id;

                setInvitationContextReady(
                    true
                );

                return;
            }


            /*
             * CONVERTED should not normally reach Create PIN.
             *
             * Invitee -> Primary reuses the existing PIN.
             * If it ever reaches this page accidentally, do not
             * silently manufacture a new context.
             */

            if (
                registrationContext ===
                "CONVERTED"
            ) {

                throw new Error(
                    "Existing CareVR access must be used for this profile transition."
                );

            }


            throw new Error(
                "CareVR registration context is unavailable."
            );

        }
        catch (error) {

            if (cancelled) {
                return;
            }

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to load CareVR access context."
            );

        }

    };

    void loadCareVRContext();

    return () => {
        cancelled = true;
    };

}, [
    registrationContext,
]);

useEffect(() => {
    if (!consentAccepted) {
        return;
    }

    let cancelled = false;

const continueAfterConsent = async () => {
    if (saving) return;

    setSaving(true);

    setDashboardHandoffReady(false);
    setDashboardAnimationComplete(false);
    setShowDashboardHandoff(true);

    try {

const user =
    await authService.getCurrentUser();

if (!user?.id) {
    throw new Error(
        "Unable to determine the current user."
    );
}

if (cancelled) {
    return;
}




            /*
             * validateInvitedUserLogin() has already done
             * its job earlier in the authentication flow.
             *
             * Do not re-check invitation status here.
             * Do not require carevrAuthorizationHandoff
             * to exist in memory here.
             *
             * At this point:
             *   - the user is authenticated
             *   - consentAccepted is true
             *   - the existing CareVR context resolver
             *     determines the active context
             */

            const availableContexts =
                await carevrContextResolver
                    .getAvailableContexts(
                        user.id
                    );


            const selectedContext =
                availableContexts.contexts[0];

            if (!selectedContext) {
                throw new Error(
                    "Unable to resolve the active CareVR context."
                );
            }

            const activeAccess =
                availableContexts.activeAccessRecords.find(
                    (access) =>
                        access.id ===
                        selectedContext.accessId
                );

            if (!activeAccess) {
                throw new Error(
                    "Unable to resolve the active CareVR access."
                );
            }

            await resolveCareVRDashboardHandoff(
                    user.id,
                    selectedContext.loginRole,
                    activeAccess
                );

setDashboardHandoffReady(true);

if (cancelled) {
    return;
}

return;

} catch (error) {
    if (cancelled) {
        return;
    }

    setShowDashboardHandoff(false);
    setDashboardHandoffReady(false);

    setError(
        error instanceof Error
            ? error.message
            : "Unable to continue to CareVR Dashboard."
    );
        } finally {
            if (!cancelled) {
                setSaving(false);
            }
        }
    };

    void continueAfterConsent();

    return () => {
        cancelled = true;
    };
}, [consentAccepted]);


    const handlePinChange = (
        value: string,
        setter: (value: string) => void
    ) => {
        const digitsOnly =
            value.replace(/\D/g, "").slice(0, 6);

        setter(digitsOnly);
        setError("");
    };


    const handleSave = async () => {
        setError("");

        if (pin.length !== 6) {
            setError(
                "Please enter a 6-digit PIN."
            );
            return;
        }

        if (confirmPin.length !== 6) {
            setError(
                "Please confirm your 6-digit PIN."
            );
            return;
        }

        if (pin !== confirmPin) {
            setError(
                "The PINs do not match."
            );
            return;
        }

        if (saving) {
            return;
        }

if (!invitationContextReady) {
    setError(
        "Please wait while your CareVR access is being prepared."
    );
    return;
}


        setSaving(true);
setDashboardHandoffReady(false);
setDashboardAnimationComplete(false);

        try {
            const response = await fetch(
                "/api/security/create-pin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        pin,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ||
                    "Unable to save your PIN."
                );
            }


const user =
    authenticatedUserRef.current;

if (!user?.id) {
    throw new Error(
        "Authenticated user context is unavailable."
    );
}


        /*
         * Invitation context was retrieved earlier
         * and stored during this Create PIN flow.
         *
         * Do NOT call validateInvitedUserLogin().
         */

        const invitedRole =
            invitedRoleRef.current;

        const familyId =
            familyIdRef.current;

        if (!invitedRole || !familyId) {
            throw new Error(
                "CareVR invitation context is unavailable."
            );
        }


        /*
         * Establish the authorization handoff required
         * by the Consent page.
         */

        carevrAuthorizationHandoff.set({
            userId:
                user.id,

            carevrRole:
                invitedRole,

            familyId:
                familyId,

            patientId:
                null,

            consentStage:
                "POST_LOGIN",

            governanceId:
                null,

            governanceVersion:
                null,
        });

        /*
         * Determine whether current consent has already
         * been completed.
         */

        const hasAcceptedConsent =
            await consentRepository
                .hasAcceptedCurrentConsent();


if (!hasAcceptedConsent) {

    if (registrationContext === null) {

        throw new Error(
            "CareVR registration context is unavailable."
        );

    }

    router.replace(
        `/consent?registrationContext=${encodeURIComponent(
            registrationContext
        )}`
    );

    return;
}


        /*
         * Consent is already complete.
         *
         * Only now resolve the existing CareVR context
         * and dashboard handoff.
         */


        const availableContexts =
            await carevrContextResolver
                .getAvailableContexts(
                    user.id
                );

        const selectedContext =
            availableContexts.contexts[0];

        if (!selectedContext) {
            throw new Error(
                "Unable to resolve the active CareVR context."
            );
        }

        const activeAccess =
            availableContexts.activeAccessRecords.find(
                (access) =>
                    access.id ===
                    selectedContext.accessId
            );

        if (!activeAccess) {
            throw new Error(
                "Unable to resolve the active CareVR access."
            );
        }

setShowDashboardHandoff(true);

await resolveCareVRDashboardHandoff(
    user.id,
    selectedContext.loginRole,
    activeAccess
);

setDashboardHandoffReady(true);

return;

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save your PIN."
            );
        } finally {
            setSaving(false);
        }
    };

if (showDashboardHandoff) {
    return (
        <main className="pin-page">
            <CareVRDashboardHandoffAnimation
                readyToContinue={dashboardHandoffReady}
                onComplete={() => {
                    setDashboardAnimationComplete(true);
                }}
            />
        </main>
    );
}

    return (
        <main className="create-pin-page">

            {/* ============================
                EXISTING CAREVR HEADER
            ============================ */}

<MobileHeader
    careMode="SELF"
    onCareModeChange={() => {}}
    userName={userName}

    showCareModeToggle={false}
    showSelfToggle={false}
    showFamilyToggle={false}

    showHomeButton={true}
    onHomeClick={() =>
        router.replace("/login")
    }

    accountMenuOpen={false}
    onAccountMenuToggle={() => {}}

    consentGranted={false}
    canAddPatient={false}

    onAddPatient={() => {}}
    onCareVRJourney={() => {}}
    onHelp={() => {}}

    onLogout={async () => {
        await authService.logout();
        router.replace("/login");
    }}
/>

            {/* ============================
                MAIN CONTENT
            ============================ */}

            <div className="create-pin-shell">

                <section
                    className="create-pin-card"
                    aria-labelledby="create-pin-title"
                >

                    <div
                        className="security-icon"
                        aria-hidden="true"
                    >
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="3"
                                y="11"
                                width="18"
                                height="10"
                                rx="2"
                            />

                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                            <circle
                                cx="12"
                                cy="16"
                                r="1"
                            />
                        </svg>
                    </div>

                    <div className="eyebrow">
                        SECURE ACCESS SETUP
                    </div>

                    <h1 id="create-pin-title">
                        Create Your CareVR PIN
                    </h1>

                    <p className="intro">
                        Create a 6-digit PIN to protect
                        your CareVR account and keep your
                        health information secure across
                        your devices.
                    </p>

                    <div className="form">

                        <div className="field">

                            <label htmlFor="carevr-pin">
                                Create PIN
                            </label>

<div className="pin-input-wrapper">
    <input
        ref={pinInputRef}
        id="carevr-pin"
        type={showPin ? "text" : "password"}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="new-password"
        maxLength={6}
        value={pin}
        onChange={(event) =>
            handlePinChange(
                event.target.value,
                setPin
            )
        }
        disabled={saving}
        aria-label="Create 6-digit CareVR PIN"
    />

    <button
        type="button"
        className="pin-visibility-button"
        onClick={() =>
            setShowPin(
                current => !current
            )
        }
        disabled={saving}
        aria-label={
            showPin
                ? "Hide PIN"
                : "Show PIN"
        }
        title={
            showPin
                ? "Hide PIN"
                : "Show PIN"
        }
    >
        {showPin ? (
    <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M4 4l16 16" />
    </svg>
) : (
    <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
    </svg>
)}
    </button>
</div>

                        </div>

                        <div className="field">

                            <label htmlFor="carevr-confirm-pin">
                                Confirm PIN
                            </label>

<div className="pin-input-wrapper">
    <input
        id="carevr-confirm-pin"
        type={
            showConfirmPin
                ? "text"
                : "password"
        }
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="new-password"
        maxLength={6}
        value={confirmPin}
        onChange={(event) =>
            handlePinChange(
                event.target.value,
                setConfirmPin
            )
        }
        disabled={saving}
        aria-label="Confirm 6-digit CareVR PIN"
    />

    <button
        type="button"
        className="pin-visibility-button"
        onClick={() =>
            setShowConfirmPin(
                current => !current
            )
        }
        disabled={saving}
        aria-label={
            showConfirmPin
                ? "Hide PIN"
                : "Show PIN"
        }
        title={
            showConfirmPin
                ? "Hide PIN"
                : "Show PIN"
        }
    >
        {showConfirmPin ? (
    <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M4 4l16 16" />
    </svg>
) : (
    <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
    </svg>
)}
    </button>
</div>

                        </div>

                    </div>

                    {error && (
                        <div
                            className="error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        className="create-button"
                        onClick={handleSave}
                        disabled={
                            saving ||
                            pin.length !== 6 ||
                            confirmPin.length !== 6
                        }
                    >
                        <span>
                            {saving
                                ? "Creating PIN..."
                                : "Create PIN"}
                        </span>

                        {!saving && (
                            <span
                                aria-hidden="true"
                                className="button-arrow"
                            >
                                →
                            </span>
                        )}
                    </button>

                    <div className="security-note">

                        <div
                            className="note-icon"
                            aria-hidden="true"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3l8 4v5c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V7l8-4z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>

                        <div>
                            <strong>
                                Your information remains protected.
                            </strong>

                            <p>
                                Your PIN is securely protected
                                and works across your trusted
                                CareVR devices.
                            </p>
                        </div>

                    </div>

                </section>

            </div>

            <footer className="page-footer">

                <div className="footer-tagline">
                    Care Today. A Healthier Tomorrow.
                </div>

                <div className="footer-values">
                    <span>SIMPLE</span>
                    <span>|</span>
                    <span>SECURE</span>
                    <span>|</span>
                    <span>TOGETHER</span>
                </div>

            </footer>


            <style jsx>{`

                .create-pin-page {
                    min-height: 100dvh;
                    display: flex;
                    flex-direction: column;
                    background:
                        radial-gradient(
                            circle at 10% 20%,
                            rgba(111, 67, 245, 0.08),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 90% 70%,
                            rgba(230, 25, 126, 0.06),
                            transparent 28%
                        ),
                        #f8f9fc;
                    color: #15203d;
                }

                .create-pin-shell {
                    width: 100%;
                    flex: 1 1 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 34px 20px 30px;
                    box-sizing: border-box;
                }

                .create-pin-card {
                    width: min(
                        100%,
                        500px
                    );
                    box-sizing: border-box;
                    padding: 38px 40px 34px;
                    border: 1px solid
                        rgba(31, 41, 71, 0.07);
                    border-radius: 24px;
                    background: #ffffff;
                    box-shadow:
                        0 18px 55px
                        rgba(24, 20, 64, 0.10);
                    text-align: center;
                }

                .security-icon {
                    width: 62px;
                    height: 62px;
                    margin: 0 auto 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: #6638d6;
                    background:
                        linear-gradient(
                            135deg,
                            #f1edff,
                            #e8e2ff
                        );
                }

                .eyebrow {
                    margin-bottom: 9px;
                    color: #7043d8;
                    font-size: 11px;
                    line-height: 1.2;
                    letter-spacing: 1.2px;
                    font-weight: 800;
                }

                h1 {
                    margin: 0;
                    color: #15203d;
                    font-size: 31px;
                    line-height: 1.18;
                    letter-spacing: -0.5px;
                    font-weight: 760;
                }

                .intro {
                    max-width: 400px;
                    margin: 13px auto 28px;
                    color: #667087;
                    font-size: 14px;
                    line-height: 1.55;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 17px;
                    text-align: left;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }

                label {
                    color: #293552;
                    font-size: 13px;
                    line-height: 1.3;
                    font-weight: 700;
                }

                .pin-input-wrapper {
                    position: relative;
                    width: 100%;
                }

                .pin-visibility-button {
                    position: absolute;
                    top: 50%;
                    right: 12px;
                    transform: translateY(-50%);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    border: 0;
                    background: transparent;
                    color: #68738a;
                    font-size: 17px;
                    line-height: 1;
                    cursor: pointer;
                }

                .pin-visibility-button:hover {
                    color: #7043d8;
                }

                .pin-visibility-button:focus-visible {
                    outline: 2px solid #7043d8;
                    outline-offset: 2px;
                    border-radius: 6px;
                }

                .pin-visibility-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pin-input-wrapper input {
                    width: 100%;
                    height: 54px;
                    box-sizing: border-box;
                    border: 1px solid #d9ddea;
                    border-radius: 12px;
                    background: #fbfcff;
                    color: #18234a;
                    padding: 0 52px 0 18px;
                    font-size: 23px;
                    line-height: 1;
                    letter-spacing: 9px;
                    text-align: center;
                    outline: none;
                    transition:
                        border-color 0.16s ease,
                        box-shadow 0.16s ease,
                        background 0.16s ease;
                }

                input:focus {
                    border-color: #7043d8;
                    background: #ffffff;
                    box-shadow:
                        0 0 0 4px
                        rgba(112, 67, 216, 0.10);
                }

                input:disabled {
                    opacity: 0.65;
                }

                .error {
                    margin-top: 16px;
                    padding: 11px 13px;
                    border: 1px solid #f2caca;
                    border-radius: 10px;
                    background: #fff5f5;
                    color: #a62c2c;
                    font-size: 13px;
                    line-height: 1.45;
                    text-align: left;
                }

                .create-button {
                    width: 100%;
                    min-height: 54px;
                    margin-top: 24px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border: 0;
                    border-radius: 13px;
                    background:
                        linear-gradient(
                            135deg,
                            #6337d2,
                            #7545df
                        );
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: 750;
                    cursor: pointer;
                    box-shadow:
                        0 10px 24px
                        rgba(99, 55, 210, 0.20);
                    transition:
                        transform 0.15s ease,
                        box-shadow 0.15s ease,
                        opacity 0.15s ease;
                }

                .create-button:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow:
                        0 13px 28px
                        rgba(99, 55, 210, 0.25);
                }

                .create-button:disabled {
                    opacity: 0.48;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .button-arrow {
                    font-size: 20px;
                    line-height: 1;
                }

                .security-note {
                    margin-top: 20px;
                    padding: 13px 14px;
                    display: flex;
                    align-items: flex-start;
                    gap: 11px;
                    border-radius: 12px;
                    background: #f5f8fd;
                    text-align: left;
                }

                .note-icon {
                    flex: 0 0 auto;
                    color: #416ed8;
                    margin-top: 1px;
                }

                .security-note strong {
                    display: block;
                    color: #27334f;
                    font-size: 12.5px;
                    line-height: 1.4;
                }

                .security-note p {
                    margin: 3px 0 0;
                    color: #69748a;
                    font-size: 11.5px;
                    line-height: 1.45;
                }

                .page-footer {
                    padding:
                        0 20px 22px;
                    text-align: center;
                }

                .footer-tagline {
                    margin-bottom: 8px;
                    color: #8a91a3;
                    font-size: 12px;
                    font-weight: 500;
                }

                .footer-values {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #6d42d4;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1.6px;
                }

                @media (max-width: 600px) {

                    .create-pin-shell {
                        align-items: flex-start;
                        padding:
                            22px
                            14px
                            24px;
                    }

                    .create-pin-card {
                        padding:
                            30px
                            20px
                            24px;
                        border-radius: 20px;
                    }

                    h1 {
                        font-size: 27px;
                    }

                    .intro {
                        font-size: 13.5px;
                        margin-bottom: 24px;
                    }

.pin-input-wrapper input {
    height: 52px;
    font-size: 22px;
    letter-spacing: 8px;
}

                    .create-button {
                        min-height: 52px;
                    }

                    .page-footer {
                        padding-bottom: 16px;
                    }
                }

            `}</style>

            {/* Animation page styles.
                Kept global intentionally because the animation
                markup is rendered through the consentAccepted
                conditional return.
            */}
            

        </main>
    );
}

export default function CreatePin() {
    return (
        <Suspense fallback={null}>
            <CreatePinContent />
        </Suspense>
    );
}
