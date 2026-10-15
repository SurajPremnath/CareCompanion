"use client";

import {
  buttonContainer,
  primaryButton,
  secondaryButton,
} from "../styles";

interface ActionButtonsProps {

  saving: boolean;

  onSave: () => void;

  onBack: () => void;

}

export default function ActionButtons({

  saving,

  onSave,

  onBack

}: ActionButtonsProps) {

  return (

    <div style={buttonContainer}>

      <button
        type="button"
        disabled={saving}
        onClick={onSave}
        style={{
          ...primaryButton,
          flex: 1,
          opacity: saving ? 0.7 : 1
        }}
      >

        {saving
          ? "Saving..."
          : "💾 Save Reading"}

      </button>

<button
    type="button"
    disabled={saving}
    onClick={onBack}
    style={{
        ...secondaryButton,
        flex: 1,
        opacity: saving ? 0.7 : 1
    }}
>
    🏠 Back to Dashboard
</button>

    </div>

  );

}