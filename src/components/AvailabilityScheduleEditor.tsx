/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import type { AvailabilitySchedule } from '../types';
import {
  AVAILABILITY_DAYS,
  AVAILABILITY_PRESETS,
  formatScheduleLabel,
  getScheduleWindows,
  isWithinAvailabilitySchedule,
  normalizeAvailabilitySchedule,
} from '../utils/availability';

interface AvailabilityScheduleEditorProps {
  value: AvailabilitySchedule;
  onChange: (next: AvailabilitySchedule) => void;
  targetLabel?: string; // e.g. 'العنصر' or 'القسم'
  inputStyle?: React.CSSProperties;
}

export const AvailabilityScheduleEditor: React.FC<AvailabilityScheduleEditorProps> = ({
  value,
  onChange,
  targetLabel = 'العنصر',
  inputStyle,
}) => {
  const sched = normalizeAvailabilitySchedule(value);
  const windows = getScheduleWindows(sched);
  const selectedDays = sched.days || [];
  const allDaysSelected = selectedDays.length === 0 || selectedDays.length === 7;
  const activeNow = sched.enabled ? isWithinAvailabilitySchedule(sched) : true;
  const scheduleSummary = sched.enabled ? formatScheduleLabel(sched) : '';

  const updateWindows = (nextWindows: Array<{ from: string; to: string }>) => {
    const clean = nextWindows.length > 0 ? nextWindows : [{ from: '08:00', to: '12:00' }];
    onChange({
      ...sched,
      enabled: true,
      from: clean[0].from,
      to: clean[0].to,
      windows: clean,
    });
  };

  const toggleDay = (dayKey: string) => {
    const cur = new Set(selectedDays);
    if (cur.has(dayKey)) {
      cur.delete(dayKey);
    } else {
      cur.add(dayKey);
    }
    const arr = Array.from(cur);
    onChange({
      ...sched,
      days: arr.length === 7 ? [] : arr,
    });
  };

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 11px',
    borderRadius: '10px',
    border: '1px solid var(--line)',
    background: 'var(--surface)',
    color: 'var(--ink)',
    fontSize: '13.5px',
    fontWeight: 700,
    ...(inputStyle || {}),
  };

  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--line)',
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Header + Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: '200px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: sched.enabled ? 'color-mix(in srgb, var(--brand) 16%, transparent)' : 'var(--bg)',
              color: sched.enabled ? 'var(--brand-ink, #34D399)' : 'var(--muted)',
              border: '1px solid var(--line)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={17} />
          </div>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>
              متوفر بأوقات محددة باليوم
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.45 }}>
              حدد ساعات أو أيام معينة لتوفر هذا {targetLabel} (مثال: وجبة فطور من 8 صباحاً إلى 12 ظهراً)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: sched.enabled ? '#10b981' : 'var(--muted)' }}>
            {sched.enabled ? 'مفعّل' : 'متوفر دائماً'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={sched.enabled}
            aria-label={`تفعيل أوقات التوفر المحددة لـ ${targetLabel}`}
            onClick={() =>
              onChange({
                ...sched,
                enabled: !sched.enabled,
              })
            }
            className={`ios-switch ${sched.enabled ? 'on' : 'off'}`}
          >
            <span className="ios-switch-thumb" />
          </button>
        </div>
      </div>

      {sched.enabled && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--line)',
          }}
        >
          {/* Quick Presets */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', marginBottom: '7px' }}>
              أوقات جاهزة سريعة:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {AVAILABILITY_PRESETS.map((preset) => {
                const isSelected =
                  windows.length === 1 &&
                  windows[0].from === preset.from &&
                  windows[0].to === preset.to;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateWindows([{ from: preset.from, to: preset.to }])}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--brand)' : '1px solid var(--line)',
                      background: isSelected ? 'color-mix(in srgb, var(--brand) 16%, transparent)' : 'var(--surface)',
                      color: isSelected ? 'var(--brand-ink, #34D399)' : 'var(--ink)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Windows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--ink)' }}>
                أوقات التوفر اليومية
              </span>
              {windows.length < 3 && (
                <button
                  type="button"
                  className="btn s"
                  onClick={() => updateWindows([...windows, { from: '18:00', to: '23:00' }])}
                  style={{ fontSize: '11.5px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} />
                  <span>إضافة فترة ثانية باليوم</span>
                </button>
              )}
            </div>

            {windows.map((win, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: windows.length > 1 ? '1fr 1fr auto' : '1fr 1fr',
                  gap: '10px',
                  alignItems: 'end',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '11px',
                  padding: '10px 12px',
                }}
              >
                <label className="f" style={{ marginBottom: 0 }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700 }}>
                    {windows.length > 1 ? `الفترة #${idx + 1} — من الساعة` : 'من الساعة'}
                  </span>
                  <input
                    type="time"
                    dir="ltr"
                    value={win.from}
                    onChange={(e) => {
                      const val = e.target.value || '08:00';
                      updateWindows(windows.map((row, i) => (i === idx ? { ...row, from: val } : row)));
                    }}
                    style={baseInputStyle}
                  />
                </label>

                <label className="f" style={{ marginBottom: 0 }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700 }}>
                    إلى الساعة
                  </span>
                  <input
                    type="time"
                    dir="ltr"
                    value={win.to}
                    onChange={(e) => {
                      const val = e.target.value || '12:00';
                      updateWindows(windows.map((row, i) => (i === idx ? { ...row, to: val } : row)));
                    }}
                    style={baseInputStyle}
                  />
                </label>

                {windows.length > 1 && (
                  <button
                    type="button"
                    aria-label="حذف الفترة"
                    onClick={() => updateWindows(windows.filter((_, i) => i !== idx))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Days Selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--ink)' }}>
                الأيام المتاح بها
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...sched, days: [] })}
                style={{
                  padding: '3px 9px',
                  borderRadius: '7px',
                  border: allDaysSelected ? '1px solid var(--brand)' : '1px solid var(--line)',
                  background: allDaysSelected ? 'color-mix(in srgb, var(--brand) 16%, transparent)' : 'var(--surface)',
                  color: allDaysSelected ? 'var(--brand-ink, #34D399)' : 'var(--muted)',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                كل أيام الأسبوع
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {AVAILABILITY_DAYS.map((day) => {
                const isSelected = !allDaysSelected && selectedDays.includes(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--brand)' : '1px solid var(--line)',
                      background: isSelected ? 'var(--brand)' : 'var(--surface)',
                      color: isSelected ? 'var(--on-brand, #fff)' : 'var(--ink)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Behavior Outside Hours */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--ink)', marginBottom: '7px' }}>
              التصرف خارج أوقات التوفر:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onChange({ ...sched, behavior: 'badge' })}
                style={{
                  textAlign: 'start',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: sched.behavior !== 'hide' ? '1.5px solid var(--brand)' : '1px solid var(--line)',
                  background: sched.behavior !== 'hide' ? 'color-mix(in srgb, var(--brand) 10%, var(--surface))' : 'var(--surface)',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 800 }}>يظهر مع تنبيه الوقت</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  يشاهد الزبون {targetLabel} مع أوقات توفره ولا يمكن طلبه خارج الوقت
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...sched, behavior: 'hide' })}
                style={{
                  textAlign: 'start',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: sched.behavior === 'hide' ? '1.5px solid var(--brand)' : '1px solid var(--line)',
                  background: sched.behavior === 'hide' ? 'color-mix(in srgb, var(--brand) 10%, var(--surface))' : 'var(--surface)',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 800 }}>إخفاء تلقائي خارج الوقت</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  يختفي {targetLabel} تماماً من المنيو خارج ساعات التوفر المحددة
                </div>
              </button>
            </div>
          </div>

          {/* Live Status Preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
              padding: '9px 12px',
              borderRadius: '10px',
              background: activeNow ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.12)',
              border: activeNow ? '1px solid rgba(16, 185, 129, 0.28)' : '1px solid rgba(245, 158, 11, 0.3)',
              fontSize: '12px',
              fontWeight: 700,
              color: activeNow ? '#10b981' : '#f59e0b',
            }}
          >
            <span>
              {activeNow
                ? `متاح حالياً حسب التوقيت الآن`
                : sched.behavior === 'hide'
                ? `خارج الوقت الآن — مخفي حالياً من المنيو`
                : `خارج الوقت الآن — يظهر كغير متاح مع تنبيه الوقت`}
            </span>
            {scheduleSummary && (
              <span style={{ color: 'var(--ink)', fontSize: '11.5px' }}>{scheduleSummary}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
