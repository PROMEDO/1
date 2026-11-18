/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Compass,
  Edit,
  Image as ImageIcon,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ImageSuggestionPicker } from '../../components/ImageSuggestionPicker';
import { AvailabilityScheduleEditor } from '../../components/AvailabilityScheduleEditor';
import { formatScheduleLabel, isWithinAvailabilitySchedule } from '../../utils/availability';
import {
  ANIMATED_EMOJIS,
  SixDotDragHandle,
  modalSectionStyle,
  surfaceCardStyle,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const CategoriesPage: React.FC = () => {
  const {
    resolvedPlan,
    allCategories,
    filteredCategories,
    searchCatQuery,
    setSearchCatQuery,
    showCatModal,
    setShowCatModal,
    editingCatId,
    catNameInput,
    setCatNameInput,
    catSubtitleInput,
    setCatSubtitleInput,
    catEmojiInput,
    setCatEmojiInput,
    catImageInput,
    setCatImageInput,
    catScheduleInput,
    setCatScheduleInput,
    openNewCategoryModal,
    handleToggleCategoryVisibility,
    handleSaveCategory,
    handleOpenEditCategory,
    handleDeleteCategory,
    handleReorderCategories,
    handleDeviceImageUpload,
  } = useDashboard();

  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);
  const [showCatSearch, setShowCatSearch] = useState<boolean>(() => Boolean(searchCatQuery.trim()));
  const catSearchInputRef = useRef<HTMLInputElement>(null);

  const isSearchVisible = showCatSearch || Boolean(searchCatQuery.trim());
  const canReorder = !searchCatQuery.trim() && allCategories.length > 1;

  const toggleCategorySearch = () => {
    if (isSearchVisible) {
      setSearchCatQuery('');
      setShowCatSearch(false);
    } else {
      setShowCatSearch(true);
      setTimeout(() => catSearchInputRef.current?.focus(), 20);
    }
  };

  const moveCategoryStep = (catId: string, dir: -1 | 1) => {
    const ids = allCategories.map((c) => c.id);
    const idx = ids.indexOf(catId);
    const target = idx + dir;
    if (idx === -1 || target < 0 || target >= ids.length) return;
    const next = [...ids];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    handleReorderCategories(next);
  };

  const handleDropOnCategory = (targetCatId: string) => {
    if (!draggedCatId || draggedCatId === targetCatId || !canReorder) {
      setDraggedCatId(null);
      setDragOverCatId(null);
      return;
    }
    const ids = allCategories.map((c) => c.id);
    const fromIdx = ids.indexOf(draggedCatId);
    const toIdx = ids.indexOf(targetCatId);
    if (fromIdx !== -1 && toIdx !== -1) {
      const next = [...ids];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      handleReorderCategories(next);
    }
    setDraggedCatId(null);
    setDragOverCatId(null);
  };

  const atCatLimit = resolvedPlan.maxCats !== -1 && allCategories.length >= resolvedPlan.maxCats;
  const catLimitText =
    resolvedPlan.maxCats === -1
      ? `${allCategories.length}/∞`
      : `${allCategories.length}/${resolvedPlan.maxCats}`;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={toggleCategorySearch}
          className="btn s"
          aria-expanded={isSearchVisible}
          style={{
            height: '42px',
            minHeight: '42px',
            borderRadius: '12px',
            padding: '0 16px',
            fontSize: '13.5px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderColor: isSearchVisible ? 'var(--brand)' : undefined,
            color: isSearchVisible ? 'var(--brand-ink, #34D399)' : undefined,
          }}
        >
          <Compass size={17} />
          <span>ابحث</span>
        </button>

        <button
          type="button"
          onClick={openNewCategoryModal}
          className={atCatLimit ? 'btn s' : 'btn p'}
          style={{
            height: '42px',
            minHeight: '42px',
            borderRadius: '12px',
            padding: '0 16px',
            fontSize: '13.5px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <Plus size={17} />
          <span>{atCatLimit ? 'الحد مكتمل 🔒' : 'إضافة قسم'}</span>
          <span
            className="tabular-nums"
            style={{
              fontSize: '12px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '8px',
              background: atCatLimit ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.16)',
              lineHeight: 1.35,
            }}
          >
            {catLimitText}
          </span>
        </button>
      </div>

      {isSearchVisible && (
        <div
          style={{
            ...surfaceCardStyle,
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <Search size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            ref={catSearchInputRef}
            type="text"
            value={searchCatQuery}
            onChange={(e) => setSearchCatQuery(e.target.value)}
            placeholder="بحث في الأقسام..."
            style={{
              border: 'none',
              background: 'transparent',
              width: '100%',
              outline: 'none',
              fontSize: '14.5px',
              color: 'var(--ink)',
            }}
          />
          <button
            type="button"
            onClick={() => {
              setSearchCatQuery('');
              setShowCatSearch(false);
            }}
            title="إغلاق البحث"
            aria-label="إغلاق البحث"
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--muted)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: '2px',
              flexShrink: 0,
            }}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {canReorder && (
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', fontWeight: 600 }}>
          يمكنك سحب الأقسام وإفلاتها أو استخدام أزرار الأسهم لترتيب ظهورها في المنيو.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredCategories.map((c, idx) => {
          const isCatVisible = c.published !== false;
          const isDragging = draggedCatId === c.id;
          const isDragOver = dragOverCatId === c.id && draggedCatId !== c.id;
          return (
            <div
              key={c.id}
              draggable={canReorder}
              onDragStart={(e) => {
                if (!canReorder) return;
                setDraggedCatId(c.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                if (!canReorder) return;
                e.preventDefault();
                if (dragOverCatId !== c.id) setDragOverCatId(c.id);
              }}
              onDragLeave={() => {
                if (dragOverCatId === c.id) setDragOverCatId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDropOnCategory(c.id);
              }}
              onDragEnd={() => {
                setDraggedCatId(null);
                setDragOverCatId(null);
              }}
              style={{
                ...surfaceCardStyle,
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                opacity: isDragging ? 0.5 : isCatVisible ? 1 : 0.65,
                border: isDragOver ? '1.5px dashed var(--brand)' : surfaceCardStyle.border,
                transition: 'border-color 0.15s ease, opacity 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                {canReorder && (
                  <div title="اسحب لتغيير الترتيب" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <SixDotDragHandle />
                  </div>
                )}
                {c.img && (
                  <img
                    src={c.img}
                    alt={c.n}
                    referrerPolicy="no-referrer"
                    style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--line)' }}
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
                    {c.emoji ? `${c.emoji} ` : ''}{c.n}
                  </span>
                  {c.subtitle && (
                    <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>
                      {c.subtitle}
                    </span>
                  )}
                  {c.availabilitySchedule?.enabled && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '7px',
                        background: isWithinAvailabilitySchedule(c.availabilitySchedule)
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(245, 158, 11, 0.14)',
                        color: isWithinAvailabilitySchedule(c.availabilitySchedule) ? '#10b981' : '#f59e0b',
                        border: isWithinAvailabilitySchedule(c.availabilitySchedule)
                          ? '1px solid rgba(16, 185, 129, 0.28)'
                          : '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Clock size={11} />
                      <span>{formatScheduleLabel(c.availabilitySchedule)}</span>
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {canReorder && (
                  <>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveCategoryStep(c.id, -1)}
                      title="تحريك للأعلى"
                      aria-label="تحريك للأعلى"
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        opacity: idx === 0 ? 0.35 : 1,
                      }}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === filteredCategories.length - 1}
                      onClick={() => moveCategoryStep(c.id, 1)}
                      title="تحريك للأسفل"
                      aria-label="تحريك للأسفل"
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: idx === filteredCategories.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: idx === filteredCategories.length - 1 ? 0.35 : 1,
                      }}
                    >
                      <ArrowDown size={13} />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  role="switch"
                  aria-checked={isCatVisible}
                  aria-label={isCatVisible ? 'إخفاء القسم من المنيو' : 'إظهار القسم في المنيو'}
                  title={isCatVisible ? 'ظاهر في المنيو — اضغط للإيقاف' : 'مخفي من المنيو — اضغط للتشغيل'}
                  onClick={() => handleToggleCategoryVisibility(c)}
                  className={`ios-switch ${isCatVisible ? 'on' : 'off'}`}
                >
                  <span className="ios-switch-thumb" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditCategory(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                    color: 'var(--ink)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="تعديل القسم"
                >
                  <Edit size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="حذف القسم"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCatModal && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowCatModal(false)} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(580px, 94vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              ...surfaceCardStyle,
              borderRadius: '22px',
              padding: '22px',
              zIndex: 99999,
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                {editingCatId ? 'تعديل القسم والتصنيف' : 'إضافة قسم جديد للمنيو'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '9px', width: '34px', height: '34px', display: 'grid', placeItems: 'center', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div style={modalSectionStyle}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--brand-ink, #34D399)', marginBottom: '10px' }}>
                  بيانات القسم الأساسية
                </div>
                <label className="f">
                  اسم القسم *
                  <input
                    type="text"
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    placeholder="مثال: سماش برجر، مشروبات باردة، عطورات..."
                    style={themedInputStyle}
                    required
                  />
                </label>

                <label className="f" style={{ marginBottom: 0 }}>
                  وصف فرعي (اختياري)
                  <input
                    type="text"
                    value={catSubtitleInput}
                    onChange={(e) => setCatSubtitleInput(e.target.value)}
                    placeholder="مثال: وجبات طازجة تحضر عند الطلب"
                    style={themedInputStyle}
                  />
                </label>
              </div>

              <div style={modalSectionStyle}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--brand-ink, #34D399)', marginBottom: '10px' }}>
                  صورة القسم (من الجهاز أو اقتراحات قوقل)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '12px',
                          border: '1.5px dashed var(--line)',
                          background: 'var(--surface)',
                          overflow: 'hidden',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {catImageInput ? (
                          <img
                            src={catImageInput}
                            alt={catNameInput || 'صورة القسم'}
                            referrerPolicy="no-referrer"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <ImageIcon size={24} style={{ color: 'var(--muted)' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: 'var(--brand)',
                            color: 'var(--on-brand)',
                            fontSize: '12.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={14} />
                          <span>رفع صورة من الجهاز</span>
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => void handleDeviceImageUpload(e, setCatImageInput, 'تم رفع صورة القسم بنجاح ✓')}
                          />
                        </label>
                        {catImageInput && (
                          <button
                            type="button"
                            onClick={() => setCatImageInput('')}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--line)',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              fontSize: '11.5px',
                              color: 'var(--muted)',
                              cursor: 'pointer',
                            }}
                          >
                            إزالة الصورة
                          </button>
                        )}
                      </div>
                    </div>

                    <label className="f" style={{ marginBottom: 0 }}>
                      أو رابط الصورة مباشرة
                      <input
                        type="text"
                        dir="ltr"
                        value={catImageInput}
                        onChange={(e) => setCatImageInput(e.target.value)}
                        placeholder="https://..."
                        style={{ ...themedInputStyle, textAlign: 'left', fontSize: '12.5px' }}
                      />
                    </label>
                  </div>

                  <ImageSuggestionPicker
                    productName={catNameInput}
                    currentImage={catImageInput}
                    onSelect={setCatImageInput}
                    titleLabel="اقتراحات صور حسب اسم القسم"
                  />
                </div>
              </div>

              <div style={modalSectionStyle}>
                <label className="f" style={{ marginBottom: '8px' }}>
                  أيقونة القسم (Emoji)
                  <input
                    type="text"
                    value={catEmojiInput}
                    onChange={(e) => setCatEmojiInput(e.target.value)}
                    placeholder="مثال: 🍔"
                    style={themedInputStyle}
                  />
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {ANIMATED_EMOJIS.slice(0, 10).map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCatEmojiInput(em)}
                      style={{
                        background: catEmojiInput === em ? 'var(--brand)' : 'var(--surface)',
                        color: catEmojiInput === em ? 'var(--on-brand)' : 'var(--ink)',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        padding: '5px 9px',
                        fontSize: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div style={modalSectionStyle}>
                <AvailabilityScheduleEditor
                  value={catScheduleInput}
                  onChange={setCatScheduleInput}
                  targetLabel="القسم"
                  inputStyle={themedInputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCatModal(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn p"
                  style={{ fontWeight: 800, padding: '10px 22px' }}
                >
                  <Save size={15} />
                  <span>حفظ القسم</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
