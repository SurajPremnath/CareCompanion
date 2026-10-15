
"use client";

type AssessmentPdfPreparingOverlayProps = {
  stage: string;
};

export default function AssessmentPdfPreparingOverlay({
  stage,
}: AssessmentPdfPreparingOverlayProps) {
  const stages = [
    "Capturing your assessment report...",
    "Building your PDF...",
    "Preparing your download...",
  ];

  const activeStage = Math.max(0, stages.indexOf(stage));

  return (
    <div
      className="assessment-pdf-overlay"
      role="status"
      aria-live="polite"
      aria-label={stage}
    >
      <div className="assessment-pdf-card">
        <div className="document-animation" aria-hidden="true">
          <div className="document-sheet">
            <span />
            <span />
            <span />
            <div className="document-check">✓</div>
          </div>
        </div>

        <h2>Preparing your assessment PDF</h2>

        <p className="stage-message">{stage}</p>

        <div className="stage-list">
          {stages.map((item, index) => (
            <div className="stage-row" key={item}>
              <span
                className={`stage-indicator ${
                  index < activeStage
                    ? "complete"
                    : index === activeStage
                      ? "active"
                      : ""
                }`}
              >
                {index < activeStage ? "✓" : index + 1}
              </span>
              <span
                className={
                  index === activeStage ? "stage-current" : ""
                }
              >
                {item.replace("...", "")}
              </span>
            </div>
          ))}
        </div>

        <div className="progress-track" aria-hidden="true">
          <div className="progress-shimmer" />
        </div>

        <p className="please-wait">
          Please keep this page open while your report is prepared.
        </p>
      </div>

      <style jsx>{`
        .assessment-pdf-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.48);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        .assessment-pdf-card {
          width: 100%;
          max-width: 420px;
          box-sizing: border-box;
          padding: 32px 28px;
          border: 1px solid #e3e8f3;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
          color: #172554;
          text-align: center;
          animation: card-enter 280ms ease-out both;
        }

        .document-animation {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          margin: 0 auto 20px;
          border-radius: 22px;
          background: #eef2ff;
          animation: document-float 2.2s ease-in-out infinite;
        }

        .document-sheet {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 34px;
          height: 43px;
          padding: 10px 7px;
          box-sizing: border-box;
          border: 2px solid #5365a7;
          border-radius: 5px;
          background: #ffffff;
        }

        .document-sheet > span {
          display: block;
          height: 3px;
          border-radius: 3px;
          background: #b8c4e8;
        }

        .document-sheet > span:last-of-type {
          width: 65%;
        }

        .document-check {
          position: absolute;
          right: -13px;
          bottom: -9px;
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          background: #16856b;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
        }

        h2 {
          margin: 0;
          color: #172554;
          font-size: 21px;
          line-height: 1.35;
          font-weight: 750;
        }

        .stage-message {
          min-height: 24px;
          margin: 10px 0 24px;
          color: #596b91;
          font-size: 14px;
        }

        .stage-list {
          display: grid;
          gap: 14px;
          margin: 0 auto 24px;
          max-width: 300px;
          text-align: left;
        }

        .stage-row {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #8490a8;
          font-size: 13px;
        }

        .stage-indicator {
          display: grid;
          flex: 0 0 25px;
          place-items: center;
          width: 25px;
          height: 25px;
          box-sizing: border-box;
          border: 1px solid #d8deea;
          border-radius: 50%;
          background: #ffffff;
          font-size: 11px;
          font-weight: 700;
        }

        .stage-indicator.active {
          border-color: #5365a7;
          background: #eef2ff;
          color: #354a91;
          animation: indicator-pulse 1.4s ease-in-out infinite;
        }

        .stage-indicator.complete {
          border-color: #16856b;
          background: #16856b;
          color: #ffffff;
        }

        .stage-current {
          color: #263a70;
          font-weight: 700;
        }

        .progress-track {
          overflow: hidden;
          height: 5px;
          border-radius: 10px;
          background: #e9edf7;
        }

        .progress-shimmer {
          width: 42%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #5365a7,
            #8b9ce0,
            #5365a7
          );
          animation: progress-slide 1.5s ease-in-out infinite;
        }

        .please-wait {
          margin: 17px 0 0;
          color: #77839a;
          font-size: 12px;
          line-height: 1.5;
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes document-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes indicator-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(83, 101, 167, 0.2);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(83, 101, 167, 0.04);
          }
        }

        @keyframes progress-slide {
          from {
            transform: translateX(-110%);
          }
          to {
            transform: translateX(250%);
          }
        }

        @media (max-width: 480px) {
          .assessment-pdf-card {
            padding: 28px 20px;
          }

          h2 {
            font-size: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .assessment-pdf-card,
          .document-animation,
          .stage-indicator.active,
          .progress-shimmer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
