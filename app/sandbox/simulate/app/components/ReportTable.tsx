"use client";

import React from "react";

export interface ReportTableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
}

interface ReportTableProps<T> {
  columns: ReportTableColumn<T>[];
  data: T[];
}

export default function ReportTable<T>({
  columns,
  data,
}: ReportTableProps<T>) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        marginBottom: "32px",
      }}
    >
      <thead>
        <tr
          style={{
            borderBottom: "2px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          {columns.map((column) => (
            <th
              key={column.title}
              style={{
                width: column.width,
                padding: "16px",
                textAlign: column.align ?? "left",
                fontWeight: 700,
                color: "#111827",
                fontSize: "15px",
              }}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{
              borderBottom: "1px solid #e5e7eb",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {columns.map((column) => (
              <td
                key={column.title}
                style={{
                  padding: "16px",
                  textAlign: column.align ?? "left",
                  verticalAlign: "middle",
                }}
              >
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}