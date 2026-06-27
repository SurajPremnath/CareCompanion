"use client";

import {
  cardStyle,
  inputStyle,
  labelStyle,
  sectionTitle,
} from "../styles";

type TemperatureUnit = "F" | "C";

interface TemperatureCardProps {

  temperature: string;

  temperatureUnit: TemperatureUnit;

  disabled?: boolean;

  onTemperatureChange: (
    value: string
  ) => void;

  onTemperatureUnitChange: (
    value: TemperatureUnit
  ) => void;

}

export default function TemperatureCard({

  temperature,

  temperatureUnit,

  disabled = false,

  onTemperatureChange,

  onTemperatureUnitChange

}: TemperatureCardProps) {

  return (

    <section style={cardStyle}>

      <h3 style={sectionTitle}>
        🌡 Temperature
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          alignItems: "end"
        }}
      >

        <div>

          <label style={labelStyle}>
            Temperature *
          </label>

          <input
            type="number"
            step="0.1"
            placeholder="Enter Temperature"
            value={temperature}
            disabled={disabled}
            onChange={(e) =>
              onTemperatureChange(
                e.target.value
              )
            }
            style={inputStyle}
          />

        </div>

        <div>

          <label style={labelStyle}>
            Unit
          </label>

          <select
            value={temperatureUnit}
            disabled={disabled}
            onChange={(e) =>
              onTemperatureUnitChange(
                e.target.value as TemperatureUnit
              )
            }
            style={inputStyle}
          >

            <option value="F">
              °F
            </option>

            <option value="C">
              °C
            </option>

          </select>

        </div>

      </div>

    </section>

  );

}