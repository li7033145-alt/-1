import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  Phone,
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
} from 'lucide-react';
import { ActivityCategory, PublishFormData } from '../types/activity';
import { COVER_PRESETS, CoverArtwork } from './CoverArtwork';
import { formatDateTimeRange, validatePublishForm } from '../utils/activityRules';

interface PublishPageProps {
  currentCampus: string;
  initialDraft?: PublishFormData | null;
  mode: 'form' | 'preview' | 'success';
  previewData?: PublishFormData | null;
  lastSubmittedTitle?: string;
  onSaveDraft: (formData: PublishFormData) => void;
  onProceedToPreview: (formData: PublishFormData) => void;
  onBackToEdit: () => void;
  onSubmitPublish: (formData: PublishFormData) => void;
  onGoToMyPublished: () => void;
  onGoHome: () => void;
}

const CATEGORIES: Exclude<ActivityCategory, '全部'>[] = [
  '讲座',
  '比赛',
  '文体',
  '社团',
  '展览',
];

const DEFAULT_FORM: PublishFormData = {
  title: '',
  cover: 'music',
  category: '文体',
  description: '',
  startDate: '2026-11-15',
  startClock: '19:00',
  endDate: '2026-11-15',
  endClock: '21:00',
  regStartDate: '2026-11-04',
  regStartClock: '09:00',
  regDeadlineDate: '2026-11-14',
  regDeadlineClock: '22:00',
  location: '',
  organizer: '',
  capacity: '100',
  requirementsText: '限本校在校学生报名，入场请携带校园卡签到。',
  contact: '',
};

export const PublishPage: React.FC<PublishPageProps> = ({
  currentCampus,
  initialDraft,
  mode,
  previewData,
  lastSubmittedTitle,
  onSaveDraft,
  onProceedToPreview,
  onBackToEdit,
  onSubmitPublish,
  onGoToMyPublished,
  onGoHome,
}) => {
  const [form, setForm] = useState<PublishFormData>(() => initialDraft || DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PublishFormData, string>>>({});
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  const updateField = <K extends keyof PublishFormData>(key: K, value: PublishFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('cover', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickFillDemo = () => {
    setForm({
      title: '秋日南区草坪吉他弹唱夜',
      cover: 'music',
      category: '文体',
      description:
        '带上你的木吉他与故事，在南区中心草坪一起围坐弹唱校园民谣与流行金曲。现场备有荧光棒与歌词本，欢迎全校音乐爱好者报名参与！',
      startDate: '2026-11-15',
      startClock: '19:00',
      endDate: '2026-11-15',
      endClock: '21:00',
      regStartDate: '2026-11-04',
      regStartClock: '09:00',
      regDeadlineDate: '2026-11-14',
      regDeadlineClock: '22:00',
      location: '清远校区南区中心草坪',
      organizer: '吉他协会 · 大学生艺术团',
      capacity: '80',
      requirementsText: '本校在校学生均可报名，欢迎自带木吉他、尤克里里或沙锤参与互动。',
      contact: '林晓阳 13826048819',
    });
    setErrors({});
  };

  const handleSaveDraftClick = () => {
    if (!form.title.trim()) {
      setErrors({ title: '保存草稿请至少填写活动名称' });
      return;
    }
    onSaveDraft(form);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2500);
  };

  const handlePreviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePublishForm(form);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    onProceedToPreview(form);
  };

  // --- 5. 发布成功页 ---
  if (mode === 'success') {
    return (
      <div className="min-h-full bg-[#F7F7F5] px-5 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full bg-white rounded-[18px] p-6 border border-[#F0EEEC] space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-[20px] font-bold text-[#171717]">活动已提交，等待审核。</h1>
            {lastSubmittedTitle && (
              <p className="text-sm font-medium text-[#514744] mt-1.5">
                《{lastSubmittedTitle}》
              </p>
            )}
            <p className="text-xs text-[#9A8984] mt-2 leading-relaxed">
              校团委或社团联合会将在 1-2 个工作日内完成内容合规与场地核验，你可以在「我的 - 我的发布」中实时查看审核状态。
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={onGoToMyPublished}
              className="w-full h-[52px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
            >
              查看我的发布
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="w-full h-[52px] rounded-[26px] bg-[#F7F7F5] text-[#514744] font-semibold text-[15px] flex items-center justify-center hover:bg-[#F0EEEC] transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. 活动预览页（与正式活动详情页保持相同布局） ---
  if (mode === 'preview' && previewData) {
    const startIso = `${previewData.startDate}T${previewData.startClock}:00`;
    const endIso = `${previewData.endDate}T${previewData.endClock}:00`;
    const regStartIso = `${previewData.regStartDate}T${previewData.regStartClock}:00`;
    const regDeadlineIso = `${previewData.regDeadlineDate}T${previewData.regDeadlineClock}:00`;

    return (
      <div className="flex flex-col min-h-full bg-[#F7F7F5] pb-24">
        {/* 顶部封面 + 返回修改按钮 */}
        <div className="relative h-[220px] w-full">
          <CoverArtwork cover={previewData.cover} title={previewData.title} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35" />

          <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToEdit}
              aria-label="返回修改"
              className="px-3 h-9 rounded-full bg-black/45 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回修改</span>
            </button>
            <span className="text-xs font-semibold text-white bg-black/45 backdrop-blur-sm px-3 py-1 rounded-full">
              发布预览模式
            </span>
          </div>
        </div>

        <div className="px-5 -mt-4 relative z-10 space-y-4">
          {/* 核心信息卡片 */}
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#9A8984] font-medium">
                {previewData.category} · {currentCampus}
              </span>
              <span className="text-[#FF5A4F] font-semibold">报名中（预览）</span>
            </div>

            <h1 className="text-[20px] font-bold text-[#171717] mt-1.5 leading-snug">
              {previewData.title}
            </h1>

            <div className="mt-3.5 pt-3.5 border-t border-[#F0EEEC]">
              <div className="flex items-center justify-between text-xs tabular-nums">
                <span className="text-[#514744]">
                  报名人数限制：<strong className="text-[#171717]">0/{previewData.capacity} 人</strong>
                </span>
                <span className="text-[#FF5A4F] font-semibold">
                  剩余 {previewData.capacity} 个名额
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-[#F0EEEC] overflow-hidden">
                <div className="h-full rounded-full bg-[#FF5A4F] w-[4%]" />
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F0EEEC] space-y-2.5 text-xs text-[#514744]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">活动时间</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {formatDateTimeRange(startIso, endIso)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">报名起止时间</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {formatDateTimeRange(regStartIso, regDeadlineIso)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">活动地点</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {previewData.location}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">主办方</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {previewData.organizer}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 活动介绍 */}
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
            <h2 className="text-[16px] font-bold text-[#171717]">活动介绍</h2>
            <p className="text-sm text-[#514744] leading-relaxed mt-2 whitespace-pre-line">
              {previewData.description}
            </p>
          </section>

          {/* 参与要求与联系方式 */}
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#171717]">参与要求</h2>
              <p className="text-xs text-[#514744] mt-1.5 leading-relaxed">
                {previewData.requirementsText}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0EEEC] flex items-center gap-2 text-xs text-[#9A8984]">
              <Phone className="w-3.5 h-3.5 text-[#FF5A4F]" />
              <span>负责人联系方式：{previewData.contact}</span>
            </div>
          </section>
        </div>

        {/* 底部操作栏：返回修改 + 提交发布 */}
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F0EEEC] px-5 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToEdit}
            className="w-2/5 h-[50px] rounded-[26px] bg-[#F7F7F5] text-[#514744] font-semibold text-sm flex items-center justify-center"
          >
            返回修改
          </button>
          <button
            type="button"
            onClick={() => onSubmitPublish(previewData)}
            className="flex-1 h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
          >
            提交发布
          </button>
        </div>
      </div>
    );
  }

  // --- 1-3. 发布表单页 ---
  return (
    <div className="pb-6">
      {/* 1. 页面顶部 */}
      <header className="px-5 pt-3 pb-4 bg-white border-b border-[#F0EEEC] flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">发布一场活动</h1>
          <p className="text-xs text-[#9A8984] mt-0.5">让更多同学发现你的精彩</p>
        </div>
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="px-3 py-1.5 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>填入示例</span>
        </button>
      </header>

      {draftSavedToast && (
        <div className="mx-5 mt-3 px-4 py-2.5 rounded-2xl bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center justify-between">
          <span>草稿已保存！可在「我的 - 我的发布」中继续编辑。</span>
          <button type="button" onClick={onGoToMyPublished} className="underline">
            去查看
          </button>
        </div>
      )}

      {/* 2. 发布表单 */}
      <form onSubmit={handlePreviewClick} className="px-5 pt-4 space-y-4">
        {/* 基本信息与封面卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-4">
          <div>
            <label htmlFor="pub-title" className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动名称 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：第十四届校园草坪音乐节"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.title && <p className="text-xs text-[#FF5A4F] mt-1">{errors.title}</p>}
          </div>

          {/* 活动封面上传与预设选择 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#171717]">
                活动封面上传 <span className="text-[#FF5A4F]">*</span>
              </label>
              <label className="text-xs text-[#FF5A4F] font-semibold cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>上传本地图片</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="h-[136px] w-full rounded-2xl overflow-hidden border border-[#F0EEEC]">
              <CoverArtwork
                cover={form.cover}
                title={form.title || '预览封面'}
                className="w-full h-full"
              />
            </div>

            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {COVER_PRESETS.slice(0, 4).map((preset) => {
                const selected = form.cover === preset.key;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => updateField('cover', preset.key)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border text-center truncate transition-colors ${
                      selected
                        ? 'border-[#FF5A4F] bg-[#FFF0ED] text-[#FF5A4F]'
                        : 'border-[#F0EEEC] bg-[#F7F7F5] text-[#514744]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 活动分类 */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动分类 <span className="text-[#FF5A4F]">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => {
                const active = form.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateField('category', cat)}
                    className={`h-9 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#FF5A4F] text-white'
                        : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 活动介绍 */}
          <div>
            <label htmlFor="pub-desc" className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动介绍 <span className="text-[#FF5A4F]">*</span>
            </label>
            <textarea
              id="pub-desc"
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="详细介绍活动亮点、嘉宾阵容、日程安排与收获..."
              className="w-full p-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F] resize-none"
            />
            {errors.description && (
              <p className="text-xs text-[#FF5A4F] mt-1">{errors.description}</p>
            )}
          </div>
        </section>

        {/* 时间与地点设置卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3.5">
          <h2 className="text-sm font-bold text-[#171717]">时间与场地安排</h2>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                活动开始日期 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                开始时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="time"
                value={form.startClock}
                onChange={(e) => updateField('startClock', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                活动结束日期 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                结束时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="time"
                value={form.endClock}
                onChange={(e) => updateField('endClock', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
          </div>
          {errors.endDate && <p className="text-xs text-[#FF5A4F]">{errors.endDate}</p>}

          <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-[#F0EEEC]">
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                报名开始时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.regStartDate}
                onChange={(e) => updateField('regStartDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                报名截止时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.regDeadlineDate}
                onChange={(e) => updateField('regDeadlineDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pub-location" className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动地点 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-location"
              type="text"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="例如：清远校区南区中心草坪 / 图书馆报告厅"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.location && <p className="text-xs text-[#FF5A4F] mt-1">{errors.location}</p>}
          </div>
        </section>

        {/* 组织者与报名要求卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pub-org" className="block text-xs font-semibold text-[#171717] mb-1.5">
                主办方 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                id="pub-org"
                type="text"
                value={form.organizer}
                onChange={(e) => updateField('organizer', e.target.value)}
                placeholder="例如：校学生会 / 吉他社"
                className="w-full h-11 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
              />
              {errors.organizer && (
                <p className="text-xs text-[#FF5A4F] mt-1">{errors.organizer}</p>
              )}
            </div>

            <div>
              <label htmlFor="pub-cap" className="block text-xs font-semibold text-[#171717] mb-1.5">
                报名人数上限 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                id="pub-cap"
                type="number"
                min={1}
                max={10000}
                value={form.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                placeholder="150"
                className="w-full h-11 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F] tabular-nums"
              />
              {errors.capacity && (
                <p className="text-xs text-[#FF5A4F] mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="pub-req" className="block text-xs font-semibold text-[#171717] mb-1.5">
              参与要求 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-req"
              type="text"
              value={form.requirementsText}
              onChange={(e) => updateField('requirementsText', e.target.value)}
              placeholder="例如：需携带本人校园卡签到入场"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.requirementsText && (
              <p className="text-xs text-[#FF5A4F] mt-1">{errors.requirementsText}</p>
            )}
          </div>

          <div>
            <label htmlFor="pub-contact" className="block text-xs font-semibold text-[#171717] mb-1.5">
              联系方式 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-contact"
              type="text"
              value={form.contact}
              onChange={(e) => updateField('contact', e.target.value)}
              placeholder="负责人姓名与手机号 / 企业微信"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.contact && <p className="text-xs text-[#FF5A4F] mt-1">{errors.contact}</p>}
          </div>
        </section>

        {/* 3. 页面底部操作：保存草稿 + 下一步：预览活动 */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="w-2/5 h-[52px] rounded-[26px] bg-white border border-[#F0EEEC] text-[#514744] font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#FFF0ED] hover:text-[#FF5A4F] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存草稿</span>
          </button>
          <button
            type="submit"
            className="flex-1 h-[52px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99]"
          >
            <Eye className="w-4 h-4" />
            <span>下一步：预览活动</span>
          </button>
        </div>
      </form>
    </div>
  );
};
