"use client";

export default function CareVRFooter() {
    return (
        <footer className="carevr-footer">
            <div className="carevr-footer-security">
                <div className="carevr-footer-icon">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                    >
                        <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />

                        <rect
                            x="9"
                            y="10"
                            width="6"
                            height="5"
                            rx="1"
                        />

                        <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" />
                    </svg>
                </div>

                <div>
                    <p className="carevr-footer-title">
                        Your health information is private and secure.
                    </p>

                    <p className="carevr-footer-text">
                        We use industry-standard security to keep your data safe.
                    </p>
                </div>
            </div>

            <style jsx>{`
                .carevr-footer {
                    margin-top: 18px;
                    padding: 18px 4px 6px;
                    border-top: 1px solid #eceef4;
                    width: 100%;
                    box-sizing: border-box;
                }

                .carevr-footer-security {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .carevr-footer-icon {
                    flex: 0 0 auto;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    background: #f5f7fa;
                    border-radius: 50%;
                }

                .carevr-footer-security p {
                    margin: 0;
                }

                .carevr-footer-title {
                    color: #4b5563;
                    font-size: 12px;
                    line-height: 1.4;
                    font-weight: 700;
                }

                .carevr-footer-text {
                    margin-top: 3px !important;
                    color: #8a94a8;
                    font-size: 11px;
                    line-height: 1.45;
                    font-weight: 400;
                }
            `}</style>
        </footer>
    );
}