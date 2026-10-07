"use client";

// نمودار ساده با SVG.
// روز قدیمی سمت راست است تا با خواندن راست‌به‌چپ جور باشد.

import { useState } from "react";
import { faDigits, formatPrice } from "@/lib/format";
import type { DayPoint } from "./storeStats";

type TrendChartProps = {
  title: string;
  hint: string;
  points: DayPoint[];
  field: "sales" | "profit";
  kind: "bar" | "line";
  color: string;
};

const WIDTH = 640;
const HEIGHT = 260;
const PAD = { top: 18, right: 72, bottom: 32, left: 16 };

function shortMoney(value: number) {
  if (value >= 1000000) {
    const million = Math.round((value / 1000000) * 10) / 10;
    return `${faDigits(String(million))} م`;
  }
  if (value >= 1000) {
    return `${faDigits(Math.round(value / 1000))} هزار`;
  }
  return faDigits(value);
}

export default function TrendChart({
  title,
  hint,
  points,
  field,
  kind,
  color,
}: TrendChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const values = points.map((point) => point[field]);
  const peak = Math.max(...values, 0);
  const scale = peak || 1;
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const slot = points.length ? plotWidth / points.length : plotWidth;
  const baseline = PAD.top + plotHeight;

  function xAt(index: number) {
    return PAD.left + plotWidth - (index + 0.5) * slot;
  }

  function yAt(value: number) {
    return PAD.top + plotHeight - (value / scale) * plotHeight;
  }

  const ticks = peak === 0 ? [0] : [peak, peak / 2, 0];
  const line = points
    .map((point, index) => `${xAt(index)},${yAt(point[field])}`)
    .join(" ");
  const area =
    points.length > 0
      ? `${xAt(0)},${baseline} ${line} ${xAt(points.length - 1)},${baseline}`
      : "";
  const chosen = active === null ? null : points[active];
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <section className="rounded-xl border border-neutral-03 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-black">{title}</h2>
          <p className="mt-1 text-xs leading-6 text-neutral-09">{hint}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-black">
          {formatPrice(total)}
          <span className="mr-1 text-xs font-normal text-neutral-08">تومان</span>
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`${title} ${formatPrice(total)} تومان`}
          onMouseLeave={() => setActive(null)}
        >
          {ticks.map((tick, index) => {
            const y = yAt(tick);
            return (
              <g key={index}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="#f2f2f3"
                />
                <text
                  x={WIDTH - PAD.right + 8}
                  y={y + 4}
                  fill="#85858b"
                  fontSize="11"
                >
                  {shortMoney(Math.round(tick))}
                </text>
              </g>
            );
          })}

          {kind === "line" && points.length > 0 ? (
            <>
              <polygon points={area} fill={color} opacity="0.16" />
              <polyline
                points={line}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          ) : null}

          {points.map((point, index) => {
            const x = xAt(index);
            const value = point[field];
            const y = yAt(value);
            const barWidth = Math.min(22, slot * 0.46);
            const showLabel =
              points.length <= 10 ||
              index % Math.ceil(points.length / 8) === 0 ||
              index === points.length - 1;

            return (
              <g key={point.key}>
                {kind === "bar" ? (
                  <rect
                    x={x - barWidth / 2}
                    y={value === 0 ? baseline - 2 : y}
                    width={barWidth}
                    height={value === 0 ? 2 : baseline - y}
                    rx="4"
                    fill={color}
                    opacity={active === null || active === index ? 1 : 0.35}
                  />
                ) : (
                  <circle
                    cx={x}
                    cy={y}
                    r={active === index ? 4.5 : 3}
                    fill={color}
                  />
                )}
                {showLabel ? (
                  <text
                    x={x}
                    y={HEIGHT - 10}
                    textAnchor="middle"
                    fill="#6d6d74"
                    fontSize="11"
                  >
                    {point.label}
                  </text>
                ) : null}
                <rect
                  x={x - slot / 2}
                  y={PAD.top}
                  width={slot}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setActive(index)}
                />
              </g>
            );
          })}
        </svg>

        {chosen && active !== null ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-neutral-13 px-3 py-2 text-xs text-white"
            style={{
              left: `${(xAt(active) / WIDTH) * 100}%`,
              top: `${(yAt(chosen[field]) / HEIGHT) * 100}%`,
            }}
          >
            <p>روز {chosen.label}</p>
            <p className="mt-1">{formatPrice(chosen[field])} تومان</p>
            <p className="mt-1 text-white/70">{faDigits(chosen.orders)} سفارش</p>
          </div>
        ) : null}
      </div>

      {peak === 0 ? (
        <p className="mt-2 text-center text-sm text-neutral-09">
          {field === "sales"
            ? "در این بازه فروشی ثبت نشده است."
            : "در این بازه سودی ثبت نشده است."}
        </p>
      ) : null}
    </section>
  );
}
