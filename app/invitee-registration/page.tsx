"use client";

import {
    Suspense,
    useEffect,
    useState,
} from "react";

import {
    useSearchParams,
} from "next/navigation";

type Invitation = {
    id: string;
    email: string;
    role: string;
    familyId: string | null;
    governanceId: string | null;
    expiresAt: string;
};

function InviteeRegistrationContent() {

    const searchParams =
        useSearchParams();

    const token =
        searchParams.get("token");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        invitation,
        setInvitation,
    ] =
        useState<Invitation | null>(
            null
        );

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    useEffect(() => {

        let cancelled = false;

        async function validateInvitation() {

            if (!token) {

                if (!cancelled) {
                    setError(
                        "This invitation link is invalid."
                    );
                    setLoading(false);
                }

                return;
            }

            try {

                const response =
                    await fetch(
                        "/api/invitee-registration/validate",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                token,
                            }),
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ??
                        "Unable to validate the invitation."
                    );
                }

                if (!result.valid) {
                    throw new Error(
                        result.message ??
                        "This invitation link is invalid."
                    );
                }

                if (!cancelled) {
                    setInvitation(
                        result.invitation
                    );
                }

            }
            catch (err) {

                if (!cancelled) {

                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to validate the invitation."
                    );
                }

            }
            finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        }

        void validateInvitation();

        return () => {
            cancelled = true;
        };

    }, [token]);

const handleCreateAccount =
    async () => {

        setError("");

        if (!token) {
            setError(
                "This invitation link is invalid."
            );
            return;
        }

        if (!invitation) {
            setError(
                "Invitation information is missing."
            );
            return;
        }

        if (!password) {
            setError(
                "Please enter a password."
            );
            return;
        }

        if (
            password.length < 8
        ) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (
            password !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        setSubmitting(true);

        try {

            const response =
                await fetch(
                    "/api/invitee-registration/create-account",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            token,
                            password,
                            confirmPassword,
                        }),
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Unable to create the account."
                );
            }

            if (!result.success) {
                throw new Error(
                    result.message ??
                    "Unable to create the account."
                );
            }

            setPassword("");
            setConfirmPassword("");

            alert(
                "Your CareVR account has been created successfully."
            );

        }
        catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create the account."
            );

        }
        finally {

            setSubmitting(false);
        }
    };

    if (loading) {

        return (
            <main>
                <h1>
                    CareVR Invitee Registration
                </h1>

                <p>
                    Validating your invitation...
                </p>
            </main>
        );
    }

    if (error && !invitation) {

        return (
            <main>
                <h1>
                    CareVR Invitee Registration
                </h1>

                <p role="alert">
                    {error}
                </p>
            </main>
        );
    }

    if (!invitation) {
        return null;
    }

    return (
        <main>

            <h1>
                CareVR Invitee Registration
            </h1>

            <p>
                You have been invited to
                CareVR.
            </p>

            <div>
                <p>
                    <strong>
                        Email
                    </strong>
                </p>

                <p>
                    {invitation.email}
                </p>
            </div>

            <div>
                <p>
                    <strong>
                        Role
                    </strong>
                </p>

                <p>
                    {invitation.role}
                </p>
            </div>

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            <div>
                <label
                    htmlFor="password"
                >
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(
                            event.target.value
                        )
                    }
                    autoComplete="new-password"
                    disabled={submitting}
                />
            </div>

            <div>
                <label
                    htmlFor="confirm-password"
                >
                    Confirm Password
                </label>

                <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(
                            event.target.value
                        )
                    }
                    autoComplete="new-password"
                    disabled={submitting}
                />
            </div>

            <button
                type="button"
                onClick={() =>
                    void handleCreateAccount()
                }
                disabled={submitting}
            >
                {submitting
                    ? "Creating Account..."
                    : "Create Account"}
            </button>

        </main>
    );
}

export default function InviteeRegistrationPage() {

    return (
        <Suspense
            fallback={
                <main>
                    <h1>
                        CareVR Invitee Registration
                    </h1>

                    <p>
                        Loading invitation...
                    </p>
                </main>
            }
        >
            <InviteeRegistrationContent />
        </Suspense>
    );
}