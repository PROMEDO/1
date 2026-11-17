/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Megaphone,
  MessageCircle,
  QrCode,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../utils/i18n';
import { getExpiryDetails } from '../../utils/storage';
import { DEFAULT_MEDIA_ASSETS } from '../../utils/businessDefaults';
import { Ml7Text } from '../../components/Ml7Text';
import { useDashboard } from './DashboardContext';

export const HomePage: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const {
    mainRest,
    rest,
    resolvedPlan,
    terms,
    allCategories,
    allItems,
    setActiveTab,
    activeRid,
    mainRid,
    customTabLabel,
  } = useDashboard();

  const expiry = getExpiryDetails(mainRest.e);

  const defaultMedia =
    terms.isStore ? DEFAULT_MEDIA_ASSETS.store : DEFAULT_MEDIA_ASSETS.restaurant;
  const hasCustomLogo = Boolean(rest.logo && rest.logo !== defaultMedia.logo);
  const hasCustomBanner = Boolean(rest.coverImages?.[0] && rest.coverImages[0] !== defaultMedia.banner);
  const hasRichBio = Boolean(rest.aboutText && rest.aboutText.trim().length >= 35);
  const hasSocialLinks = Boolean(
    rest.social?.instagram || rest.social?.tiktok || rest.social?.facebook || rest.mapUrl
  );
  const hasCustomSlugConfigured = Boolean(rest.slug || rest.subdomain);

  interface MenuTip {
    id: string;
    done: boolean;
    title: string;
    desc: string;
    actionLabel: string;
    targetTab: 'cats' | 'menu' | 'set' | 'qr' | 'appearance';
  }

  const dynamicTips: MenuTip[] = [
    {
      id: 'cats',
      done: allCategories.length >= 3,
      title:
        allCategories.length >= 3
          ? `الأقسام منظمة بشكل رائع (${allCategories.length} أقسام) ✓`
          : `أضف أقساماً إضافية لتسهيل التصفح (لديك حالياً ${allCategories.length} فقط)`,
      desc: 'تقسيم القائمة إلى 3 أقسام على الأقل (مثلاً: الأكثر طلباً، العروض، المشروبات) يرفع سرعة اختيار الزبون.',
      actionLabel: `إدارة ${terms.categoriesPlural}`,
      targetTab: 'cats',
    },
    {
      id: 'items',
      done: allItems.length >= 6,
      title:
        allItems.length >= 6
          ? `تنوع ممتاز في ${terms.itemsPlural} (${allItems.length} عنصر) ✓`
          : `أضف المزيد من ${terms.itemsPlural} لإغناء قائمتك (${allItems.length} حالياً)`,
      desc: `ينصح بإضافة 6 ${terms.itemsPlural} أو أكثر مع وصف واضح وسعر وصورة حقيقية لكل عنصر لزيادة متوسط الفاتورة.`,
      actionLabel: `إضافة ${terms.itemSingular}`,
      targetTab: 'menu',
    },
    {
      id: 'media',
      done: hasCustomLogo && hasCustomBanner,
      title:
        hasCustomLogo && hasCustomBanner
          ? 'الشعار وصورة الغلاف مرفوعان بهويتك الخاصة ✓'
          : 'ارفع شعارك الخاص وصورة غلاف حقيقية لمشروعك',
      desc: 'وجود شعار واضح وصورة بانر احترافية خاصة بعلامتك التجارية يعزز ثقة الزبائن من اللحظة الأولى.',
      actionLabel: 'رفع الشعار والغلاف',
      targetTab: 'set',
    },
    {
      id: 'bio',
      done: hasRichBio && hasSocialLinks,
      title:
        hasRichBio && hasSocialLinks
          ? 'النبذة التعريفية وروابط التواصل مكتملة ✓'
          : 'أكمل نبذة المشروع وروابط إنستقرام والخريطة',
      desc: 'أضف نبذة جذابة عن جودة عملك ورابط خرائط جوجل وحسابات التواصل الاجتماعي داخل الإعدادات.',
      actionLabel: 'تحديث النبذة والروابط',
      targetTab: 'set',
    },
  ];

  if (resolvedPlan.perms.customSlug) {
    dynamicTips.push({
      id: 'slug',
      done: hasCustomSlugConfigured,
      title: hasCustomSlugConfigured
        ? 'رابطك الفرعي المخصص مفعّل وجاهز للمشاركة ✓'
        : 'اختر رابطاً مخصصاً باسم مشروعك الآن',
      desc: 'بما أنك على باقة مدفوعة، يمكنك حجز رابط فرعي خاص باسم مشروعك ليبدو احترافياً في البايو والإعلانات.',
      actionLabel: 'حجز الرابط المخصص',
      targetTab: 'set',
    });
  }

  const completedTipsCount = dynamicTips.filter((x) => x.done).length;
  const readinessPercent = Math.round((completedTipsCount / dynamicTips.length) * 100);
  const allTipsCompleted = completedTipsCount >= dynamicTips.length;

  const guideTitleText = t.tipsShareTitle || 'كيف تنشر رابطك وتجلب طلبات أكثر؟';

  const guideCards = [
    {
      id: 'social',
      Icon: Share2,
      title: '1. السوشيال ميديا والإعلانات',
      body: (
        <>
          ثبّت رابط {terms.menuTitle} في <b>البايو</b> بإنستقرام وتيك توك مع عبارة واضحة مثل:{' '}
          <i>«للطلب المباشر اضغط الرابط 👇»</i>. وفي الستوري والإعلانات المموّلة اربط زر الإجراء بالمنيو مباشرة حتى يطلب الزبون خلال ثوانٍ بدل انتظار الرد في الخاص.
        </>
      ),
    },
    {
      id: 'qr',
      Icon: QrCode,
      title: '2. كود QR داخل المحل والتغليف',
      body: (
        <>
          اطبع كود الـ <b>QR</b> وضعه على الطاولات والكاشير، وأرفق ملصقاً صغيراً على أكياس أو علب التوصيل بعبارة:
          <i> «امسح الكود واطلب مرة ثانية أسرع»</i> لتضمن عودة الزبون لطلبك مباشرة من دون تطبيقات وسيطة.
        </>
      ),
    },
    {
      id: 'whatsapp',
      Icon: MessageCircle,
      title: '3. الرد التلقائي في واتساب',
      body: (
        <>
          أضف رابط المنيو داخل رسالة الترحيب أو الرد السريع في <b>WhatsApp Business</b> مثل:
          <i> «أهلاً بك! تصفح قائمتنا واختر طلبك مباشرة من هنا»</i> ليصل الزبون لقائمتك ويرسل طلبه كاملاً مع العنوان والسعر.
        </>
      ),
    },
  ];

  return (
    <div className="mp-home-wrap">
      {/* Floating Welcome Header (transparent to main grid background) */}
      <div className="mp-home-welcome">
        <img
          src={rest.logo}
          alt={rest.n}
          referrerPolicy="no-referrer"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--brand)',
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--brand-ink, #34D399)', fontWeight: 800, marginBottom: '2px' }}>
            {activeRid === mainRid
              ? customTabLabel('home', 'لوحة التحكم الرئيسية')
              : `إدارة فرع: ${rest.branchName || rest.n}`}
          </div>
          <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(19px, 3vw, 24px)', fontWeight: 900, color: 'var(--ink)' }}>
            أهلاً بك في {rest.n} 👋
          </h1>
          <div className="mp-home-welcome-meta">
            <span>
              {t.activePlanLabel || 'الباقة الحالية'}: <b style={{ color: 'var(--brand-ink, #34D399)' }}>{resolvedPlan.plan.n}</b>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={13} />
              {t.planExpiryLabel || 'الانتهاء'}: <b style={{ color: expiry.isExp ? '#ef4444' : 'var(--ink)' }}>{expiry.text}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Section: transparent & borderless, shown when steps are still incomplete */}
      {!allTipsCompleted && (
        <section className="mp-home-section">
          <div className="mp-home-section-head">
            <span
              className="mp-home-section-badge"
              style={{
                background: 'rgba(245, 158, 11, 0.14)',
                color: '#f59e0b',
              }}
            >
              <Lightbulb size={15} />
              <span>نسبة الاكتمال: {readinessPercent}%</span>
            </span>

            <h2 className="mp-home-section-title">
              <Ml7Text
                text="خطوات استكمال جاهزية المنيو 💡"
                mode="mount"
                delay={0.08}
                stagger={0.12}
                isRtl={isRtl}
              />
            </h2>

            <motion.p
              className="mp-home-section-sub"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {t.tipsSectionTitle || 'أكمل هذه الخطوات البسيطة ليظهر متجرك بأفضل صورة أمام الزبائن.'}
            </motion.p>
          </div>

          <div className="mp-home-tips-list">
            {dynamicTips.map((tip, idx) => (
              <motion.div
                key={tip.id}
                className="mp-home-tip-row"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.85,
                  delay: prefersReducedMotion ? 0 : Math.min(idx * 0.08, 0.4),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="mp-home-tip-main">
                  {tip.done ? (
                    <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                  ) : (
                    <Sparkles size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '3px' }} />
                  )}
                  <div className="mp-home-tip-copy">
                    <b className="mp-home-tip-title">{tip.title}</b>
                    <span className="mp-home-tip-desc">{tip.desc}</span>
                  </div>
                </div>

                {!tip.done && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(tip.targetTab)}
                    className="btn s mp-home-tip-btn"
                  >
                    <span>{tip.actionLabel}</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Clear & Practical Growth & Publishing Guide */}
      <section
        className={`mp-home-section ${!allTipsCompleted ? 'mp-home-section--guide' : ''}`}
      >
        <div className="mp-home-section-head">
          <span
            className="mp-home-section-badge"
            style={{
              background: 'var(--soft)',
              color: 'var(--brand-ink, #34D399)',
            }}
          >
            <Megaphone size={15} />
            <span>نصائح لزيادة الطلبات</span>
          </span>

          <h2 className="mp-home-section-title">
            <Ml7Text
              text={guideTitleText}
              mode="inView"
              delay={0.08}
              stagger={0.12}
              isRtl={isRtl}
            />
          </h2>

          <motion.p
            className="mp-home-section-sub"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            خطوات عملية بسيطة تحول متابعيك وزبائن المحل إلى طلبات مباشرة بدون عمولات.
          </motion.p>
        </div>

        <div className="mp-home-guide-grid">
          {guideCards.map((card, idx) => {
            const IconComp = card.Icon;
            return (
              <motion.div
                key={card.id}
                className="mp-home-guide-card"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.96,
                  delay: prefersReducedMotion ? 0 : Math.min(idx * 0.11, 0.44),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="mp-home-guide-title">
                  <IconComp size={17} style={{ flexShrink: 0 }} />
                  <span>{card.title}</span>
                </div>
                <p className="mp-home-guide-body">{card.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
