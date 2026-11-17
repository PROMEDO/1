/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  ImagePlus,
  Pin,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { formatNumber } from '../../utils/storage';
import { ImageSuggestionPicker } from '../../components/ImageSuggestionPicker';
import { AvailabilityScheduleEditor } from '../../components/AvailabilityScheduleEditor';
import { formatScheduleLabel, isWithinAvailabilitySchedule } from '../../utils/availability';
import {
  SixDotDragHandle,
  surfaceCardStyle,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const ItemsPage: React.FC = () => {
  const {
    resolvedPlan,
    customTabLabel,
    currency,
    allCategories,
    allItems,
    filteredItems,
    searchItemQuery,
    setSearchItemQuery,
    filterCatId,
    setFilterCatId,
    isItemEditorOpen,
    setIsItemEditorOpen,
    itemEditorTab,
    setItemEditorTab,
    editingItemId,
    categoryScrollRef,
    scrollCategoryPills,
    formCat,
    setFormCat,
    formName,
    setFormName,
    formPrice,
    setFormPrice,
    formBeforePrice,
    setFormBeforePrice,
    formDesc,
    setFormDesc,
    formImage,
    setFormImage,
    formPrepTime,
    setFormPrepTime,
    formBadgeText,
    setFormBadgeText,
    formBadgeType,
    setFormBadgeType,
    formAllergens,
    setFormAllergens,
    formPublished,
    setFormPublished,
    formNoDelivery,
    setFormNoDelivery,
    formNoPickup,
    setFormNoPickup,
    formSchedule,
    setFormSchedule,
    hasVariableSizes,
    setHasVariableSizes,
    formSizes,
    setFormSizes,
    hasExtras,
    setHasExtras,
    formExtras,
    setFormExtras,
    hasChoices,
    setHasChoices,
    formMaxChoices,
    setFormMaxChoices,
    formChoices,
    setFormChoices,
    showBatchModal,
    setShowBatchModal,
    batchLinesInput,
    setBatchLinesInput,
    openNewItemEditor,
    openBatchModal,
    handleSaveItem,
    handleQuickUpdateItemPrice,
    handleDeleteItem,
    handleBatchAddItems,
    handleEditItem,
    handleToggleItemVisibility,
    handleDeviceImageUpload,
  } = useDashboard();

  const [quickPriceItemId, setQuickPriceItemId] = useState<string | null>(null);
  const [quickPriceDraft, setQuickPriceDraft] = useState<string>('');

  const atItemLimit = resolvedPlan.maxItems !== -1 && allItems.length >= resolvedPlan.maxItems;
  const canDiscount = resolvedPlan.perms.itemDiscounts;

  if (isItemEditorOpen) {
    return (
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Back Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setIsItemEditorOpen(false)}
            style={{
              ...surfaceCardStyle,
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={15} />
            <span>العودة للعناصر</span>
          </button>
        </div>

        {/* Page Heading */}
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>
          العنصر
        </h1>

        {/* Horizontal Top Underline Tabs */}
        <div className="item-editor-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={itemEditorTab === 'info'}
            className={`item-editor-tab ${itemEditorTab === 'info' ? 'active' : ''}`}
            onClick={() => setItemEditorTab('info')}
          >
            <span>المعلومات</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={itemEditorTab === 'extras'}
            className={`item-editor-tab ${itemEditorTab === 'extras' ? 'active' : ''}`}
            onClick={() => setItemEditorTab('extras')}
          >
            <span>الإضافات</span>
            {hasExtras && (
              <span className="item-editor-tab-badge tabular-nums">
                {formExtras.filter((x) => x.n.trim()).length || 'مفعّل'}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={itemEditorTab === 'choices'}
            className={`item-editor-tab ${itemEditorTab === 'choices' ? 'active' : ''}`}
            onClick={() => setItemEditorTab('choices')}
          >
            <span>الخيارات</span>
            {hasChoices && (
              <span className="item-editor-tab-badge tabular-nums">
                {formChoices.filter((c) => c.trim()).length || 'مفعّل'}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={itemEditorTab === 'availability'}
            className={`item-editor-tab ${itemEditorTab === 'availability' ? 'active' : ''}`}
            onClick={() => setItemEditorTab('availability')}
          >
            <span>أوقات التوفر</span>
            {formSchedule.enabled && (
              <span className="item-editor-tab-badge">مفعّل</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={itemEditorTab === 'extraInfo'}
            className={`item-editor-tab ${itemEditorTab === 'extraInfo' ? 'active' : ''}`}
            onClick={() => setItemEditorTab('extraInfo')}
          >
            <span>معلومات إضافية</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={itemEditorTab === 'badges'}
            className={`item-editor-tab ${itemEditorTab === 'badges' ? 'active' : ''}`}
            onClick={() => setItemEditorTab('badges')}
          >
            <span>البادجات</span>
            {formBadgeText.trim() && (
              <span className="item-editor-tab-badge">1</span>
            )}
          </button>
        </div>

        {/* Dedicated Editor Card Container */}
        <form onSubmit={handleSaveItem}>
          <div
            style={{
              ...surfaceCardStyle,
              borderRadius: '18px',
              padding: '22px',
              boxShadow: 'var(--sh)',
            }}
          >
            {/* TAB 1: المعلومات */}
            {itemEditorTab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '14px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {formImage && (
                      <div
                        style={{
                          position: 'relative',
                          width: '108px',
                          height: '108px',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          border: '1.5px solid var(--brand)',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={formImage}
                          alt={formName || 'صورة العنصر'}
                          referrerPolicy="no-referrer"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <button
                          type="button"
                          aria-label="إزالة الصورة"
                          onClick={() => setFormImage('')}
                          style={{
                            position: 'absolute',
                            top: '6px',
                            insetInlineStart: '6px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'rgba(15, 23, 42, 0.85)',
                            color: '#ffffff',
                            border: 0,
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={13} />
                        </button>
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '6px',
                            insetInlineEnd: '6px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--surface)',
                            color: 'var(--brand-ink, #34D399)',
                            display: 'grid',
                            placeItems: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                          }}
                        >
                          <Pin size={12} />
                        </span>
                      </div>
                    )}

                    <label
                      style={{
                        width: '108px',
                        height: '108px',
                        borderRadius: '14px',
                        border: '1.5px dashed var(--line)',
                        background: 'var(--surface)',
                        color: 'var(--ink)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'border-color 0.15s ease',
                      }}
                      title="إضافة صورة من الجهاز"
                    >
                      <ImagePlus size={24} style={{ color: 'var(--brand-ink, #34D399)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                        من الجهاز
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => void handleDeviceImageUpload(e, setFormImage, 'تم اختيار صورة العنصر بنجاح ✓', 'item')}
                      />
                    </label>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label className="f" style={{ marginBottom: 0 }}>
                        أو رابط الصورة مباشرة (اختياري)
                        <input
                          type="text"
                          dir="ltr"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://..."
                          style={{ ...themedInputStyle, textAlign: 'left', fontSize: '12.5px' }}
                        />
                      </label>
                    </div>
                  </div>

                  <ImageSuggestionPicker
                    productName={formName}
                    categoryName={allCategories.find((c) => c.id === formCat)?.n}
                    currentImage={formImage}
                    onSelect={setFormImage}
                    titleLabel="اقتراحات صور من قوقل حسب اسم العنصر"
                  />
                </div>

                <label className="f" style={{ marginBottom: 0 }}>
                  اسم العنصر *
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: ريزو، كاب سماش برجر، بيبسي..."
                    style={themedInputStyle}
                    required
                  />
                </label>

                <label className="f" style={{ marginBottom: 0 }}>
                  قسم العنصر *
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    style={themedInputStyle}
                    required
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji ? `${c.emoji} ` : ''}{c.n}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="f" style={{ marginBottom: 0 }}>
                  وصف العنصر ( الوصف والمكونات )
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="اكتب مكونات الوجبة أو وصف المنتج بشكل واضح للزبون..."
                    rows={4}
                    style={themedInputStyle}
                  />
                </label>

                <label className="f" style={{ marginBottom: 0 }}>
                  المدة لتجهيز العنصر بالدقائق ( اختياري )
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={formPrepTime}
                      onChange={(e) => setFormPrepTime(e.target.value)}
                      placeholder="مثال: 15"
                      style={themedInputStyle}
                    />
                  </div>
                </label>

                {/* Pricing Section */}
                <div
                  style={{
                    background: 'transparent',
                    border: 0,
                    borderTop: '1px solid var(--line)',
                    borderRadius: 0,
                    padding: '16px 0 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>
                        أسعار متغيرة (أكثر من حجم)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        فعّل هذا الخيار لتحديد عدة أحجام وبجوار كل حجم سعره الخاص
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={hasVariableSizes}
                      aria-label="تفعيل أسعار متغيرة بأكثر من حجم"
                      onClick={() => {
                        setHasVariableSizes((prev) => {
                          const next = !prev;
                          if (next && formSizes.length === 0) {
                            setFormSizes([
                              { n: 'سنجل', p: formPrice !== '' ? Number(formPrice) : '' },
                              { n: 'دبل', p: '' },
                            ]);
                          }
                          return next;
                        });
                      }}
                      className={`ios-switch ${hasVariableSizes ? 'on' : 'off'}`}
                    >
                      <span className="ios-switch-thumb" />
                    </button>
                  </div>

                  {!hasVariableSizes ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                      <label className="f" style={{ marginBottom: 0 }}>
                        السعر ({currency}) *
                        <input
                          type="number"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="6000"
                          style={{ ...themedInputStyle, background: 'var(--surface)' }}
                        />
                      </label>
                      <label className="f" style={{ marginBottom: 0 }}>
                        <span>
                          السعر قبل الخصم (اختياري)
                          {!canDiscount && (
                            <span style={{ color: '#f59e0b', fontSize: '11px', marginInlineStart: '6px' }}>
                              🔒 متاح في الباقة الاحترافية وباقة الاعمال الشاملة
                            </span>
                          )}
                        </span>
                        <input
                          type="number"
                          value={canDiscount ? formBeforePrice : ''}
                          disabled={!canDiscount}
                          onChange={(e) => setFormBeforePrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder={canDiscount ? '7500' : 'مقفل في باقتك الحالية'}
                          style={{
                            ...themedInputStyle,
                            background: 'var(--surface)',
                            opacity: canDiscount ? 1 : 0.6,
                            cursor: canDiscount ? 'text' : 'not-allowed',
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                        {formSizes.map((sz, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'minmax(0, 1.5fr) minmax(110px, 1fr) auto',
                              gap: '8px',
                              alignItems: 'center',
                            }}
                          >
                            <input
                              type="text"
                              value={sz.n}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormSizes((prev) => prev.map((row, i) => (i === idx ? { ...row, n: val } : row)));
                              }}
                              placeholder={`اسم الحجم #${idx + 1} (مثال: سنجل / دبل / كبير)`}
                              style={{ ...themedInputStyle, background: 'var(--surface)' }}
                            />
                            <input
                              type="number"
                              value={sz.p}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                setFormSizes((prev) => prev.map((row, i) => (i === idx ? { ...row, p: val } : row)));
                              }}
                              placeholder={`السعر (${currency})`}
                              style={{ ...themedInputStyle, background: 'var(--surface)' }}
                            />
                            <button
                              type="button"
                              aria-label="حذف الحجم"
                              onClick={() => {
                                if (formSizes.length === 1) {
                                  setFormSizes([{ n: '', p: '' }]);
                                } else {
                                  setFormSizes((prev) => prev.filter((_, i) => i !== idx));
                                }
                              }}
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
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn s"
                          onClick={() => setFormSizes((prev) => [...prev, { n: '', p: '' }])}
                          style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Plus size={15} />
                          <span>إضافة حجم جديد</span>
                        </button>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn s"
                            onClick={() =>
                              setFormSizes([
                                { n: 'سنجل', p: formSizes[0]?.p || 6000 },
                                { n: 'دبل', p: 8500 },
                                { n: 'تربل', p: 11000 },
                              ])
                            }
                            style={{ fontSize: '11.5px', color: 'var(--muted)' }}
                          >
                            قالب: سنجل / دبل / تربل
                          </button>
                          <button
                            type="button"
                            className="btn s"
                            onClick={() =>
                              setFormSizes([
                                { n: 'صغير', p: formSizes[0]?.p || 5000 },
                                { n: 'وسط', p: 7000 },
                                { n: 'كبير', p: 9000 },
                              ])
                            }
                            style={{ fontSize: '11.5px', color: 'var(--muted)' }}
                          >
                            قالب: صغير / وسط / كبير
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: الإضافات (مدفوعة مع السعر) */}
            {itemEditorTab === 'extras' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    paddingBottom: '16px',
                    marginBottom: '18px',
                    borderBottom: '1px solid var(--line)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 900, color: 'var(--ink)' }}>
                      إضافات العنصر (مدفوعة)
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                      أضف صوصات أو إضافات مدفوعة (مثال: صوص جبن بسعر 500 {currency}) يحددها الزبون مع الطبق.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: hasExtras ? '#10b981' : 'var(--muted)' }}>
                      {hasExtras ? 'مفعّل' : 'مطفأ'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hasExtras}
                      aria-label="تشغيل أو إطفاء الإضافات"
                      onClick={() => {
                        setHasExtras((prev) => {
                          const next = !prev;
                          if (next && formExtras.length === 0) {
                            setFormExtras([{ n: '', p: '' }]);
                          }
                          return next;
                        });
                      }}
                      className={`ios-switch ${hasExtras ? 'on' : 'off'}`}
                    >
                      <span className="ios-switch-thumb" />
                    </button>
                  </div>
                </div>

                {!hasExtras ? (
                  <div
                    style={{
                      background: 'var(--panel)',
                      border: 0,
                      borderRadius: '14px',
                      padding: '28px 20px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: '14px', fontWeight: 600 }}>
                      الإضافات غير مفعلة لهذا العنصر حالياً.
                    </p>
                    <button
                      type="button"
                      className="btn p s"
                      onClick={() => {
                        setHasExtras(true);
                        if (formExtras.length === 0) setFormExtras([{ n: '', p: '' }]);
                      }}
                    >
                      تشغيل وإضافة خيارات مدفوعة
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                      {formExtras.map((ex, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(120px, 1fr) auto',
                            gap: '10px',
                            alignItems: 'center',
                            background: 'transparent',
                            border: 0,
                            borderBottom: '1px solid var(--line)',
                            borderRadius: 0,
                            padding: '8px 0',
                          }}
                        >
                          <input
                            type="text"
                            value={ex.n}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormExtras((prev) => prev.map((row, i) => (i === idx ? { ...row, n: val } : row)));
                            }}
                            placeholder="اسم الإضافة (مثال: صوص جبن)"
                            style={{ ...themedInputStyle, background: 'var(--surface)' }}
                          />
                          <input
                            type="number"
                            value={ex.p}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Number(e.target.value);
                              setFormExtras((prev) => prev.map((row, i) => (i === idx ? { ...row, p: val } : row)));
                            }}
                            placeholder={`السعر (${currency}) مثال: 500`}
                            style={{ ...themedInputStyle, background: 'var(--surface)' }}
                          />
                          <button
                            type="button"
                            aria-label="حذف الإضافة"
                            onClick={() => {
                              if (formExtras.length === 1) {
                                setFormExtras([{ n: '', p: '' }]);
                              } else {
                                setFormExtras((prev) => prev.filter((_, i) => i !== idx));
                              }
                            }}
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
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn s"
                        onClick={() => setFormExtras((prev) => [...prev, { n: '', p: '' }])}
                        style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={15} />
                        <span>إضافة جديدة</span>
                      </button>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[
                          { n: 'صوص جبن', p: 500 },
                          { n: 'شريحة جبن شيدر', p: 1000 },
                          { n: 'فلفل هلابينو', p: 500 },
                          { n: 'بيكون مدخن', p: 2000 },
                        ].map((preset) => (
                          <button
                            key={preset.n}
                            type="button"
                            className="btn s"
                            style={{ fontSize: '11.5px', color: 'var(--muted)' }}
                            onClick={() =>
                              setFormExtras((prev) => {
                                const filtered = prev.filter((x) => x.n.trim() !== '');
                                if (filtered.some((x) => x.n === preset.n)) return prev;
                                return [...filtered, preset];
                              })
                            }
                          >
                            + {preset.n} ({preset.p})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: الخيارات (مجانية بدون سعر) */}
            {itemEditorTab === 'choices' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    paddingBottom: '16px',
                    marginBottom: '18px',
                    borderBottom: '1px solid var(--line)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 900, color: 'var(--ink)' }}>
                      اختيارات العنصر (مجانية بدون سعر)
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                      خيارات مجانية يحددها الزبون مع الطبق مثل نوع الخبز أو مستوى الحرارة بدون سعر إضافي.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: hasChoices ? '#10b981' : 'var(--muted)' }}>
                      {hasChoices ? 'مفعّل' : 'مطفأ'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hasChoices}
                      aria-label="تشغيل أو إطفاء الاختيارات المجانية"
                      onClick={() => {
                        setHasChoices((prev) => {
                          const next = !prev;
                          if (next && formChoices.length === 0) {
                            setFormChoices(['']);
                          }
                          return next;
                        });
                      }}
                      className={`ios-switch ${hasChoices ? 'on' : 'off'}`}
                    >
                      <span className="ios-switch-thumb" />
                    </button>
                  </div>
                </div>

                {!hasChoices ? (
                  <div
                    style={{
                      background: 'var(--panel)',
                      border: 0,
                      borderRadius: '14px',
                      padding: '28px 20px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: '14px', fontWeight: 600 }}>
                      الاختيارات المجانية غير مفعلة لهذا العنصر حالياً.
                    </p>
                    <button
                      type="button"
                      className="btn p s"
                      onClick={() => {
                        setHasChoices(true);
                        if (formChoices.length === 0) setFormChoices(['']);
                      }}
                    >
                      تشغيل وإضافة اختيارات مجانية
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="f" style={{ maxWidth: '300px', marginBottom: '14px' }}>
                      عدد الاختيارات المسموح للزبون تحديدها
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={formMaxChoices}
                        onChange={(e) => setFormMaxChoices(Math.max(1, Number(e.target.value) || 1))}
                        style={themedInputStyle}
                      />
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                      {formChoices.map((ch, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr) auto',
                            gap: '10px',
                            alignItems: 'center',
                            background: 'transparent',
                            border: 0,
                            borderBottom: '1px solid var(--line)',
                            borderRadius: 0,
                            padding: '8px 0',
                          }}
                        >
                          <input
                            type="text"
                            value={ch}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormChoices((prev) => prev.map((row, i) => (i === idx ? val : row)));
                            }}
                            placeholder={`اسم الخيار المجاني #${idx + 1} (مثال: خبز بريوش ذهبي / سبايسي حار)`}
                            style={{ ...themedInputStyle, background: 'var(--surface)' }}
                          />
                          <button
                            type="button"
                            aria-label="حذف الخيار"
                            onClick={() => {
                              if (formChoices.length === 1) {
                                setFormChoices(['']);
                              } else {
                                setFormChoices((prev) => prev.filter((_, i) => i !== idx));
                              }
                            }}
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
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn s"
                        onClick={() => setFormChoices((prev) => [...prev, ''])}
                        style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={15} />
                        <span>إضافة خيار جديد</span>
                      </button>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn s"
                          style={{ fontSize: '11.5px', color: 'var(--muted)' }}
                          onClick={() => setFormChoices(['خبز بريوش ذهبي', 'خبز بطاطا طري'])}
                        >
                          قالب: نوع الخبز
                        </button>
                        <button
                          type="button"
                          className="btn s"
                          style={{ fontSize: '11.5px', color: 'var(--muted)' }}
                          onClick={() => setFormChoices(['عادي (بارد)', 'سبايسي حار 🔥'])}
                        >
                          قالب: عادي / سبايسي
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: أوقات التوفر */}
            {itemEditorTab === 'availability' && (() => {
              const selectedParentCat = allCategories.find((c) => c.id === formCat);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedParentCat?.availabilitySchedule?.enabled && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '11px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.28)',
                        color: 'var(--ink)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Clock size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <span>
                        ملاحظة: القسم المختار <b>({selectedParentCat.n})</b> محدد مسبقاً بأوقات توفر:{' '}
                        {formatScheduleLabel(selectedParentCat.availabilitySchedule)}
                      </span>
                    </div>
                  )}
                  <AvailabilityScheduleEditor
                    value={formSchedule}
                    onChange={setFormSchedule}
                    targetLabel="العنصر"
                    inputStyle={themedInputStyle}
                  />
                </div>
              );
            })()}

            {/* TAB 5: معلومات إضافية */}
            {itemEditorTab === 'extraInfo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'var(--panel)',
                    border: 0,
                    borderRadius: '14px',
                    padding: '14px 16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>
                      ظهور العنصر في المنيو
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      عند الإطفاء يختفي العنصر مؤقتاً من قائمة الزبائن دون حذفه
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formPublished}
                    onClick={() => setFormPublished((p) => !p)}
                    className={`ios-switch ${formPublished ? 'on' : 'off'}`}
                  >
                    <span className="ios-switch-thumb" />
                  </button>
                </div>

                <label className="f" style={{ marginBottom: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                    <span>مسببات الحساسية (اختياري)</span>
                  </span>
                  <textarea
                    rows={3}
                    value={formAllergens}
                    onChange={(e) => setFormAllergens(e.target.value)}
                    placeholder="مثال: يحتوي على الجلوتين، الألبان، السمسم..."
                    style={themedInputStyle}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--panel)',
                      border: 0,
                      borderRadius: '12px',
                      padding: '12px 14px',
                    }}
                  >
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                      متاح لطلبات التوصيل
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!formNoDelivery}
                      onClick={() => setFormNoDelivery((p) => !p)}
                      className={`ios-switch ${!formNoDelivery ? 'on' : 'off'}`}
                    >
                      <span className="ios-switch-thumb" />
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--panel)',
                      border: 0,
                      borderRadius: '12px',
                      padding: '12px 14px',
                    }}
                  >
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                      متاح للاستلام من الفرع
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!formNoPickup}
                      onClick={() => setFormNoPickup((p) => !p)}
                      className={`ios-switch ${!formNoPickup ? 'on' : 'off'}`}
                    >
                      <span className="ios-switch-thumb" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: البادجات */}
            {itemEditorTab === 'badges' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
                    اختر شارة جاهزة أو اكتب نصاً مخصصاً
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { text: 'الأكثر طلباً', type: 'red' as const },
                      { text: 'جديد', type: 'green' as const },
                      { text: 'توقيع الشيف', type: 'gold' as const },
                      { text: 'مميز', type: 'accent' as const },
                      { text: 'مقرمش 🔥', type: 'red' as const },
                    ].map((b) => (
                      <button
                        key={b.text}
                        type="button"
                        className={`btn s ${formBadgeText === b.text ? 'p' : ''}`}
                        onClick={() => {
                          setFormBadgeText(b.text);
                          setFormBadgeType(b.type);
                        }}
                      >
                        {b.text}
                      </button>
                    ))}
                    {formBadgeText && (
                      <button
                        type="button"
                        className="btn s d"
                        onClick={() => setFormBadgeText('')}
                      >
                        إزالة الشارة
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                  <label className="f" style={{ marginBottom: 0 }}>
                    نص البادج (اختياري)
                    <input
                      type="text"
                      value={formBadgeText}
                      onChange={(e) => setFormBadgeText(e.target.value)}
                      placeholder="مثال: الأكثر طلباً"
                      style={themedInputStyle}
                    />
                  </label>

                  <label className="f" style={{ marginBottom: 0 }}>
                    لون الشارة
                    <select
                      value={formBadgeType}
                      onChange={(e) => setFormBadgeType(e.target.value as 'red' | 'gold' | 'green' | 'accent')}
                      style={themedInputStyle}
                    >
                      <option value="accent">لون البراند الأساسي</option>
                      <option value="red">أحمر بارز</option>
                      <option value="gold">ذهبي</option>
                      <option value="green">أخضر</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Save / Cancel Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '20px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="submit"
              className="btn p"
              style={{ fontWeight: 900, padding: '12px 32px', fontSize: '15px', minWidth: '180px' }}
            >
              <Save size={16} />
              <span>{editingItemId ? 'حفظ التعديلات' : 'حفظ العنصر'}</span>
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => setIsItemEditorOpen(false)}
              style={{ fontWeight: 700, padding: '12px 22px' }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
              {customTabLabel('menu', 'العناصر والمنتجات')}
            </h1>
            <span
              className="tabular-nums"
              style={{
                fontSize: '12px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '9px',
                background: atItemLimit ? 'rgba(245, 158, 11, 0.14)' : 'var(--soft)',
                color: atItemLimit ? '#f59e0b' : 'var(--brand-ink, #34D399)',
                border: '1px solid var(--line)',
              }}
            >
              {resolvedPlan.maxItems === -1
                ? `${allItems.length} / غير محدود`
                : `${allItems.length} / ${resolvedPlan.maxItems} عنصر`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={openNewItemEditor}
            style={{
              background: atItemLimit ? 'rgba(148, 163, 184, 0.25)' : 'var(--brand)',
              color: atItemLimit ? 'var(--muted)' : 'var(--on-brand)',
              border: 0,
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <Plus size={17} />
            <span>{atItemLimit ? 'الحد مكتمل 🔒' : 'إضافة عنصر'}</span>
          </button>

          <button
            type="button"
            onClick={openBatchModal}
            style={{
              ...surfaceCardStyle,
              borderRadius: '10px',
              padding: '10px 16px',
              fontSize: '13.5px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              opacity: atItemLimit ? 0.65 : 1,
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--brand-ink, #34D399)' }} />
            <span>إضافة سريعة بالجملة</span>
          </button>
        </div>
      </div>

      <div
        style={{
          ...surfaceCardStyle,
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '14px',
        }}
      >
        <input
          type="text"
          value={searchItemQuery}
          onChange={(e) => setSearchItemQuery(e.target.value)}
          placeholder="بحث في العناصر..."
          style={{
            border: 'none',
            background: 'transparent',
            width: '100%',
            outline: 'none',
            fontSize: '14.5px',
            color: 'var(--ink)',
          }}
        />
        <Search size={18} style={{ color: 'var(--muted)', marginInlineStart: '10px' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => scrollCategoryPills('left')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            ...surfaceCardStyle,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="السابق"
        >
          <ChevronRight size={16} />
        </button>

        <div
          ref={categoryScrollRef}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '4px 2px',
            flex: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <button
            type="button"
            onClick={() => setFilterCatId('all')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: filterCatId === 'all' ? '3px solid var(--brand)' : '3px solid transparent',
              padding: '6px 10px',
              fontWeight: filterCatId === 'all' ? 800 : 600,
              color: filterCatId === 'all' ? 'var(--brand-ink, #34D399)' : 'var(--muted)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            الكل ({allItems.length})
          </button>

          {allCategories.map((c) => {
            const count = allItems.filter((it) => it.cat === c.id).length;
            const isSelected = filterCatId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilterCatId(c.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isSelected ? '3px solid var(--brand)' : '3px solid transparent',
                  padding: '6px 10px',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? 'var(--brand-ink, #34D399)' : 'var(--muted)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {c.n} ({count})
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollCategoryPills('right')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            ...surfaceCardStyle,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="التالي"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredItems.map((item) => {
          const catObj = allCategories.find((c) => c.id === item.cat);
          const isItemVisible = item.published !== false && item.available !== false;
          const sizesCount = (item.sizes || []).length;
          const choicesCount = (item.choices || []).length;
          const extrasCount = (item.extras || []).length;
          return (
            <div
              key={item.id}
              style={{
                ...surfaceCardStyle,
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                opacity: isItemVisible ? 1 : 0.65,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '160px', flex: 1 }}>
                <SixDotDragHandle />
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.n}
                    referrerPolicy="no-referrer"
                    style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.n}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '3px' }}>
                    {quickPriceItemId === item.id ? (
                      <div
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="number"
                          min={0}
                          step={250}
                          dir="ltr"
                          autoFocus
                          value={quickPriceDraft}
                          onChange={(e) => setQuickPriceDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (handleQuickUpdateItemPrice(item, Number(quickPriceDraft))) {
                                setQuickPriceItemId(null);
                              }
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setQuickPriceItemId(null);
                            }
                          }}
                          style={{
                            width: '104px',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            border: '1.5px solid var(--brand)',
                            background: 'var(--bg)',
                            color: 'var(--ink)',
                            fontSize: '12.5px',
                            fontWeight: 800,
                          }}
                          aria-label={`تعديل سريع لسعر ${item.n}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (handleQuickUpdateItemPrice(item, Number(quickPriceDraft))) {
                              setQuickPriceItemId(null);
                            }
                          }}
                          style={{
                            height: '26px',
                            padding: '0 8px',
                            borderRadius: '7px',
                            border: '0',
                            background: 'var(--brand)',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            cursor: 'pointer',
                          }}
                          title="حفظ السعر"
                        >
                          <Check size={13} />
                          <span>حفظ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickPriceItemId(null)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '7px',
                            border: '1px solid var(--line)',
                            background: 'var(--bg)',
                            color: 'var(--muted)',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                          title="إلغاء"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setQuickPriceItemId(item.id);
                          setQuickPriceDraft(String(item.pr ?? 0));
                        }}
                        title="اضغط للتعديل السريع على السعر"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          border: '1px dashed var(--line)',
                          background: 'var(--bg)',
                          cursor: 'pointer',
                          color: 'var(--brand-ink, #34D399)',
                          fontSize: '12.5px',
                          fontWeight: 800,
                        }}
                      >
                        <span className="tabular-nums">
                          {sizesCount > 0 ? `من ${formatNumber(item.pr)} ${currency}` : `${formatNumber(item.pr)} ${currency}`}
                        </span>
                        <Edit size={11} style={{ opacity: 0.78 }} />
                      </button>
                    )}
                    {sizesCount > 0 && (
                      <span style={{ fontSize: '10.5px', color: 'var(--muted)', background: 'var(--bg)', padding: '1px 6px', borderRadius: '6px', border: '1px solid var(--line)' }}>
                        {sizesCount} أحجام
                      </span>
                    )}
                    {choicesCount > 0 && (
                      <span style={{ fontSize: '10.5px', color: 'var(--muted)', background: 'var(--bg)', padding: '1px 6px', borderRadius: '6px', border: '1px solid var(--line)' }}>
                        {choicesCount} اختيارات
                      </span>
                    )}
                    {extrasCount > 0 && (
                      <span style={{ fontSize: '10.5px', color: 'var(--muted)', background: 'var(--bg)', padding: '1px 6px', borderRadius: '6px', border: '1px solid var(--line)' }}>
                        {extrasCount} إضافات
                      </span>
                    )}
                    {item.availabilitySchedule?.enabled && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '1px 7px',
                          borderRadius: '6px',
                          background: isWithinAvailabilitySchedule(item.availabilitySchedule)
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'rgba(245, 158, 11, 0.14)',
                          color: isWithinAvailabilitySchedule(item.availabilitySchedule) ? '#10b981' : '#f59e0b',
                          border: isWithinAvailabilitySchedule(item.availabilitySchedule)
                            ? '1px solid rgba(16, 185, 129, 0.28)'
                            : '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        <Clock size={10} />
                        <span>{formatScheduleLabel(item.availabilitySchedule)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="desktop-inline-only"
                style={{
                  fontSize: '13.5px',
                  color: 'var(--muted)',
                  fontWeight: 600,
                  textAlign: 'center',
                  minWidth: '110px',
                }}
              >
                {catObj?.n || 'بدون قسم'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isItemVisible}
                  aria-label={isItemVisible ? 'إطفاء وإخفاء العنصر' : 'تشغيل وإظهار العنصر'}
                  title={isItemVisible ? 'ظاهر في المنيو — اضغط للإطفاء' : 'مخفي من المنيو — اضغط للتشغيل'}
                  onClick={() => handleToggleItemVisibility(item)}
                  className={`ios-switch ${isItemVisible ? 'on' : 'off'}`}
                >
                  <span className="ios-switch-thumb" />
                </button>

                <button
                  type="button"
                  onClick={() => handleEditItem(item)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                    color: 'var(--ink)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="تعديل العنصر"
                >
                  <Edit size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="حذف العنصر"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showBatchModal && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowBatchModal(false)} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(480px, 92vw)',
              ...surfaceCardStyle,
              borderRadius: '20px',
              padding: '24px',
              zIndex: 99999,
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--brand-ink, #34D399)', margin: 0 }}>
                إضافة عناصر سريعة بالجملة ✨
              </h3>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 14px' }}>
              أدخل كل عنصر في سطر منفصل بصيغة: <b>الاسم - السعر - الوصف</b>
            </p>

            <label className="f">
              قائمة العناصر
              <textarea
                value={batchLinesInput}
                onChange={(e) => setBatchLinesInput(e.target.value)}
                placeholder={'برجر دبل تشيز - 8500 - لحم طازج مع جبنة شيدر\nبيتزا مارجريتا - 9000 - عجينة إيطالية وموتزاريلا'}
                rows={5}
                style={themedInputStyle}
              />
            </label>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="button" className="btn" onClick={() => setShowBatchModal(false)}>
                إلغاء
              </button>
              <button type="button" className="btn p" onClick={handleBatchAddItems} style={{ fontWeight: 800 }}>
                إضافة العناصر للمنيو
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
