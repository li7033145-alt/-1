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
  ArrowRight,
  Save,
  Eye,
  Sparkles,
  Check,
} from 'lucide-react';
import { ActivityCategory, PublishFormData } from '../types/activity';
import { CAMPUS_LIST } from '../data/initialData';
import { COVER_PRESETS, CoverArtwork } from './CoverArtwork';
import {
  formatDateTimeRange,
  validatePublishForm,
  validatePublishStep,
} from '../utils/activityRules';

interface PublishPageProps {
  currentCampus: string;
  currentSubCampus?: string;
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

const CATEGORY_CARDS: {
  id: Exclude<ActivityCategory, '全部'>;
  label: string;
  desc: string;
  defaultCover: string;
}[] = [
  {
    id: '文体',
    label: '文体演出与运动',
    desc: '草坪音乐节、院系篮球赛、羽毛球赛、迎新晚会等',
    defaultCover: 'music',
  },
  {
    id: '讲座',
    label: '学术讲座与沙龙',
    desc: '前沿技术报告、名师讲堂、就业分享、思辨读书会等',
    defaultCover: 'lecture',
  },
  {
    id: '比赛',
    label: '校园竞赛与挑战',
    desc: '建筑结构设计赛、辩论赛、编程马拉松、创业大赛等',
    defaultCover: 'design',
  },
  {
    id: '社团',
    label: '社团纳新与市集',
    desc: '百团大战、文创手作市集、暗房工坊、桌游联谊等',
    defaultCover: 'market',
  },
  {
    id: '展览',
    label: '艺术摄影与作品展',
    desc: '校园纪实摄影展、毕业设计联展、古建筑测绘展等',
    defaultCover: 'photo',
  },
];

const WIZARD_STEPS: { step: 1 | 2 | 3 | 4; title: string; subtitle: string }[] = [
  { step: 1, title: '校区与类型', subtitle: '第一步：选择所在校区与活动类型' },
  { step: 2, title: '名称与图文', subtitle: '第二步：填写活动名称、封面与介绍' },
  { step: 3, title: '时间与场地', subtitle: '第三步：设置活动时间与校内地点' },
  { step: 4, title: '主办与要求', subtitle: '第四步：完善主办方、人数与联系方式' },
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
  subCampus: '清远校区',
  location: '',
  organizer: '',
  capacity: '100',
  requirementsText: '限本校在校学生报名，入场请携带校园卡签到。',
  contact: '',
};

export const PublishPage: React.FC<PublishPageProps> = ({
  currentCampus,
  currentSubCampus,
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
  const campusInfo =
    CAMPUS_LIST.find((c) => c.name === currentCampus) || CAMPUS_LIST[0];
  const subCampusList = campusInfo.subCampuses || ['清远校区', '广州校区'];
  const defaultSub =
    currentSubCampus && currentSubCampus !== '全部校区'
      ? currentSubCampus
      : subCampusList[0];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<PublishFormData>(
    () => initialDraft || { ...DEFAULT_FORM, subCampus: defaultSub }
  );
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
      subCampus: defaultSub,
      location: `${defaultSub}南区中心草坪`,
      organizer: '吉他协会 · 大学生艺术团',
      capacity: '80',
      requirementsText: '本校在校学生均可报名，欢迎自带木吉他、尤克里里或沙锤参与互动。',
      contact: '林晓阳 13826048819',
    });
    setErrors({});
  };

  const handleSaveDraftClick = () => {
    if (!form.title.trim()) {
      setCurrentStep(2);
      setErrors({ title: '保存草稿请至少在第二步填写活动名称' });
      return;
    }
    onSaveDraft(form);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2500);
  };

  const handleNextStep = () => {
    const check = validatePublishStep(form, currentStep);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleJumpToStep = (targetStep: 1 | 2 | 3 | 4) => {
    if (targetStep <= currentStep) {
      setErrors({});
      setCurrentStep(targetStep);
      return;
    }
    // Validate current step before jumping forward
    const check = validatePublishStep(form, currentStep);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setCurrentStep(targetStep);
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

  // --- 发布成功页 ---
  if (mode === 'success') {
    return (
      <div className="min-h-full bg-[#F4F2EE] px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full bg-white rounded-[10px] p-6 border border-[#E6E3DF] space-y-5">
          <div className="w-14 h-14 rounded-[10px] bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-[20px] font-black text-[#171717]">活动已提交，等待审核</h1>
            {lastSubmittedTitle && (
              <p className="text-sm font-bold text-[#514744] mt-1.5">《{lastSubmittedTitle}》</p>
            )}
            <p className="text-xs text-[#8C7E79] mt-2 leading-relaxed">
              校团委或社团联合会将在 1-2 个工作日内完成内容合规与场地核验，你可以在「我的 - 我的发布」中实时查看审核状态。
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={onGoToMyPublished}
              className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center"
            >
              查看我的发布
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                onGoHome();
              }}
              className="w-full h-11 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] text-[#514744] font-semibold text-sm flex items-center justify-center"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 活动预览页 ---
  if (mode === 'preview' && previewData) {
    const startIso = `${previewData.startDate}T${previewData.startClock}:00`;
    const endIso = `${previewData.endDate}T${previewData.endClock}:00`;
    const regStartIso = `${previewData.regStartDate}T${previewData.regStartClock}:00`;
    const regDeadlineIso = `${previewData.regDeadlineDate}T${previewData.regDeadlineClock}:00`;

    return (
      <div className="flex flex-col min-h-full bg-[#F4F2EE] pb-24">
        <div className="relative h-[196px] w-full">
          <CoverArtwork
            cover={previewData.cover}
            title={previewData.title}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35" />

          <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToEdit}
              aria-label="返回修改"
              className="px-3 h-9 rounded-[8px] bg-black/50 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回修改</span>
            </button>
            <span className="text-xs font-bold text-white bg-[#FF5A4F] px-3 py-1 rounded-[6px]">
              发布预览模式
            </span>
          </div>
        </div>

        <div className="px-4 -mt-3 relative z-10 space-y-3">
          <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#8C7E79] font-medium">
                {previewData.category} · {currentCampus}
                {previewData.subCampus ? ` (${previewData.subCampus})` : ''}
              </span>
              <span className="text-[#FF5A4F] font-bold">报名中（预览）</span>
            </div>

            <h1 className="text-[20px] font-black text-[#171717] mt-1.5 leading-snug">
              {previewData.title}
            </h1>

            <div className="mt-3 pt-3 border-t border-[#F0EEEC]">
              <div className="flex items-center justify-between text-xs tabular-nums">
                <span className="text-[#514744]">
                  报名人数限制：<strong className="text-[#171717]">0/{previewData.capacity} 人</strong>
                </span>
                <span className="text-[#FF5A4F] font-bold">
                  剩余 {previewData.capacity} 个名额
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-[4px] bg-[#F0EEEC] overflow-hidden">
                <div className="h-full bg-[#FF5A4F] w-[4%]" />
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#F0EEEC] space-y-2 text-xs text-[#514744]">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0 mt-0.5" />
                <span>活动时间：{formatDateTimeRange(startIso, endIso)}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0 mt-0.5" />
                <span>报名时间：{formatDateTimeRange(regStartIso, regDeadlineIso)}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0 mt-0.5" />
                <span>活动地点：{previewData.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0 mt-0.5" />
                <span>主办单位：{previewData.organizer}</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]">
            <h2 className="text-[16px] font-black text-[#171717]">活动介绍</h2>
            <p className="text-sm text-[#514744] leading-relaxed mt-2 whitespace-pre-line">
              {previewData.description}
            </p>
          </section>

          <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3">
            <div>
              <h2 className="text-[16px] font-black text-[#171717]">参与要求</h2>
              <p className="text-xs text-[#514744] mt-1.5 leading-relaxed">
                {previewData.requirementsText}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#F0EEEC] flex items-center gap-2 text-xs text-[#8C7E79]">
              <Phone className="w-3.5 h-3.5 text-[#FF5A4F]" />
              <span>负责人联系方式：{previewData.contact}</span>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E6E3DF] px-4 py-3 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToEdit}
            className="w-2/5 h-11 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] text-[#514744] font-semibold text-sm flex items-center justify-center"
          >
            返回修改
          </button>
          <button
            type="button"
            onClick={() => onSubmitPublish(previewData)}
            className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center"
          >
            提交发布
          </button>
        </div>
      </div>
    );
  }

  // --- 四步向导式发布主界面 ---
  const activeStepMeta = WIZARD_STEPS.find((s) => s.step === currentStep) || WIZARD_STEPS[0];

  return (
    <div className="pb-6 bg-[#F4F2EE] min-h-full">
      {/* 1. 顶部标题与步骤导航条 */}
      <header className="px-4 pt-3 pb-3.5 bg-white border-b border-[#E6E3DF] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-black tracking-tight text-[#171717]">发布校园活动</h1>
            <p className="text-xs text-[#8C7E79] mt-0.5">{activeStepMeta.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="px-2.5 py-1.5 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>填入示例</span>
          </button>
        </div>

        {/* 4 步进度指示器 */}
        <div
          role="tablist"
          aria-label="发布活动步骤"
          className="mt-3 grid grid-cols-4 gap-1.5"
        >
          {WIZARD_STEPS.map((item) => {
            const isCurrent = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => handleJumpToStep(item.step)}
                className={`p-2 rounded-[8px] border text-left transition-all ${
                  isCurrent
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : isCompleted
                    ? 'bg-[#FFF0ED] text-[#FF5A4F] border-[#FF5A4F]/30'
                    : 'bg-[#F7F7F5] text-[#8C7E79] border-[#E6E3DF]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span>STEP {item.step}</span>
                  {isCompleted && <Check className="w-3 h-3 text-[#FF5A4F]" />}
                </div>
                <div className="text-xs font-bold mt-0.5 truncate">{item.title}</div>
              </button>
            );
          })}
        </div>
      </header>

      {draftSavedToast && (
        <div className="mx-4 mt-3 px-3.5 py-2.5 rounded-[8px] bg-[#FFF0ED] border border-[#FF5A4F]/30 text-[#FF5A4F] text-xs font-semibold flex items-center justify-between">
          <span>草稿已保存！可在「我的 - 我的发布」中继续编辑。</span>
          <button type="button" onClick={onGoToMyPublished} className="underline font-bold">
            去查看
          </button>
        </div>
      )}

      {/* 分步表单主体 */}
      <form onSubmit={handlePreviewClick} className="px-4 pt-3.5 space-y-3.5">
        {/* 第一步：选择校区与活动类型 */}
        {currentStep === 1 && (
          <div data-testid="publish-step-1" className="space-y-3.5">
            {/* 1. 选择校区 */}
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3">
              <div>
                <h2 className="text-sm font-black text-[#171717]">
                  1. 选择举办校区 <span className="text-[#FF5A4F]">*</span>
                </h2>
                <p className="text-xs text-[#8C7E79] mt-0.5">
                  当前学校：{currentCampus}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {subCampusList.map((sub) => {
                  const active = (form.subCampus || subCampusList[0]) === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => updateField('subCampus', sub)}
                      className={`p-3 rounded-[8px] border text-left transition-all ${
                        active
                          ? 'bg-[#FFF0ED] border-[#FF5A4F] text-[#171717]'
                          : 'bg-[#F7F7F5] border-[#E6E3DF] text-[#514744]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{sub}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-[#FF5A4F]" />}
                      </div>
                      <span className="text-[11px] text-[#8C7E79] mt-1 block">
                        面向{sub}及全校同学开放
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.subCampus && <p className="text-xs text-[#FF5A4F]">{errors.subCampus}</p>}
            </section>

            {/* 2. 选择活动类型 */}
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3">
              <div>
                <h2 className="text-sm font-black text-[#171717]">
                  2. 选择活动类型 <span className="text-[#FF5A4F]">*</span>
                </h2>
                <p className="text-xs text-[#8C7E79] mt-0.5">
                  系统将根据类型匹配对应兴趣偏好的同学
                </p>
              </div>

              <div className="space-y-2">
                {CATEGORY_CARDS.map((cat) => {
                  const active = form.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        updateField('category', cat.id);
                        if (!form.cover.startsWith('data:image/')) {
                          updateField('cover', cat.defaultCover);
                        }
                      }}
                      className={`w-full p-3 rounded-[8px] border text-left flex items-center justify-between gap-3 transition-all ${
                        active
                          ? 'bg-[#FFF0ED] border-[#FF5A4F]'
                          : 'bg-[#F7F7F5] border-[#E6E3DF] hover:border-[#9A8984]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-[4px] bg-[#171717] text-white text-xs font-bold">
                            {cat.id}
                          </span>
                          <span className="text-sm font-bold text-[#171717]">{cat.label}</span>
                        </div>
                        <p className="text-xs text-[#514744] mt-1">{cat.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-[#FF5A4F] text-white'
                            : 'bg-white border border-[#E6E3DF] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center gap-1.5"
            >
              <span>下一步：填写名称与图文</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 第二步：活动名称、封面图片与活动介绍 */}
        {currentStep === 2 && (
          <div data-testid="publish-step-2" className="space-y-3.5">
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-4">
              <div>
                <label
                  htmlFor="pub-title"
                  className="block text-xs font-bold text-[#171717] mb-1.5"
                >
                  活动名称 <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  id="pub-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="例如：第十四届校园草坪音乐节"
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                />
                {errors.title && <p className="text-xs text-[#FF5A4F] mt-1">{errors.title}</p>}
              </div>

              {/* 活动封面上传与预设选择 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#171717]">
                    活动海报封面 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <label className="text-xs text-[#FF5A4F] font-bold cursor-pointer flex items-center gap-1">
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

                <div className="h-[140px] w-full rounded-[8px] overflow-hidden border border-[#E6E3DF]">
                  <CoverArtwork
                    cover={form.cover}
                    title={form.title || '预览封面'}
                    className="w-full h-full"
                  />
                </div>

                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {COVER_PRESETS.map((preset) => {
                    const selected = form.cover === preset.key;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => updateField('cover', preset.key)}
                        className={`py-1.5 px-2 rounded-[6px] text-[11px] font-semibold border text-center truncate transition-colors ${
                          selected
                            ? 'border-[#FF5A4F] bg-[#FFF0ED] text-[#FF5A4F]'
                            : 'border-[#E6E3DF] bg-[#F7F7F5] text-[#514744]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 活动介绍 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="pub-desc" className="block text-xs font-bold text-[#171717]">
                    活动详细介绍 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <span className="text-[11px] text-[#8C7E79] tabular-nums">
                    已输入 {form.description.trim().length} 字（至少10字）
                  </span>
                </div>
                <textarea
                  id="pub-desc"
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="详细介绍活动亮点、嘉宾阵容、日程安排与参与收获..."
                  className="w-full p-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F] resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-[#FF5A4F] mt-1">{errors.description}</p>
                )}
              </div>
            </section>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/3 h-11 rounded-[8px] bg-white border border-[#E6E3DF] text-[#514744] font-semibold text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <span>下一步：时间与场地</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 第三步：时间安排与场地地点 */}
        {currentStep === 3 && (
          <div data-testid="publish-step-3" className="space-y-3.5">
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3.5">
              <h2 className="text-sm font-black text-[#171717]">活动时间与报名周期</h2>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-[#514744] mb-1">
                    活动开始日期 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full h-10 px-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
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
                    className="w-full h-10 px-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
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
                    className="w-full h-10 px-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
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
                    className="w-full h-10 px-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
              </div>
              {errors.endDate && <p className="text-xs text-[#FF5A4F]">{errors.endDate}</p>}

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F0EEEC]">
                <div>
                  <label className="block text-xs font-medium text-[#514744] mb-1">
                    报名开始日期 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.regStartDate}
                    onChange={(e) => updateField('regStartDate', e.target.value)}
                    className="w-full h-10 px-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514744] mb-1">
                    报名截止日期 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.regDeadlineDate}
                    onChange={(e) => updateField('regDeadlineDate', e.target.value)}
                    className="w-full h-10 px-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EEEC]">
                <label
                  htmlFor="pub-location"
                  className="block text-xs font-bold text-[#171717] mb-1.5"
                >
                  校内具体活动地点（{form.subCampus}） <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  id="pub-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder={`例如：${form.subCampus}南区中心草坪 / 图书馆报告厅`}
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                />
                {errors.location && (
                  <p className="text-xs text-[#FF5A4F] mt-1">{errors.location}</p>
                )}

                {/* 常用地点快捷填入 */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#8C7E79]">常用场地：</span>
                  {['南区中心草坪', '图书馆学术报告厅', '室内体育馆主馆', '学生活动中心广场'].map(
                    (spot) => (
                      <button
                        key={spot}
                        type="button"
                        onClick={() => updateField('location', `${form.subCampus || ''}${spot}`)}
                        className="px-2 py-1 rounded-[6px] bg-[#F7F7F5] hover:bg-[#FFF0ED] hover:text-[#FF5A4F] text-[11px] text-[#514744] border border-[#E6E3DF]"
                      >
                        {spot}
                      </button>
                    )
                  )}
                </div>
              </div>
            </section>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/3 h-11 rounded-[8px] bg-white border border-[#E6E3DF] text-[#514744] font-semibold text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <span>下一步：主办与要求</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 第四步：主办方、人数限制、要求与联系方式 */}
        {currentStep === 4 && (
          <div data-testid="publish-step-4" className="space-y-3.5">
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3.5">
              <h2 className="text-sm font-black text-[#171717]">主办方与报名要求</h2>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="pub-org"
                    className="block text-xs font-bold text-[#171717] mb-1.5"
                  >
                    主办方名称 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="pub-org"
                    type="text"
                    value={form.organizer}
                    onChange={(e) => updateField('organizer', e.target.value)}
                    placeholder="例如：校学生会 / 吉他社"
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                  />
                  {errors.organizer && (
                    <p className="text-xs text-[#FF5A4F] mt-1">{errors.organizer}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pub-cap"
                    className="block text-xs font-bold text-[#171717] mb-1.5"
                  >
                    报名人数上限 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="pub-cap"
                    type="number"
                    min={1}
                    max={10000}
                    value={form.capacity}
                    onChange={(e) => updateField('capacity', e.target.value)}
                    placeholder="100"
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] tabular-nums"
                  />
                  {errors.capacity && (
                    <p className="text-xs text-[#FF5A4F] mt-1">{errors.capacity}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="pub-req"
                  className="block text-xs font-bold text-[#171717] mb-1.5"
                >
                  参与要求与签到说明 <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  id="pub-req"
                  type="text"
                  value={form.requirementsText}
                  onChange={(e) => updateField('requirementsText', e.target.value)}
                  placeholder="例如：需携带本人校园卡签到入场"
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                />
                {errors.requirementsText && (
                  <p className="text-xs text-[#FF5A4F] mt-1">{errors.requirementsText}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pub-contact"
                  className="block text-xs font-bold text-[#171717] mb-1.5"
                >
                  负责人联系方式 <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  id="pub-contact"
                  type="text"
                  value={form.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  placeholder="负责人姓名与手机号 / 企业微信"
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                />
                {errors.contact && (
                  <p className="text-xs text-[#FF5A4F] mt-1">{errors.contact}</p>
                )}
              </div>
            </section>

            {/* 第四步底部操作：上一步 + 保存草稿 + 预览活动 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 h-11 rounded-[8px] bg-white border border-[#E6E3DF] text-[#514744] font-semibold text-xs flex items-center justify-center gap-1 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDraftClick}
                className="px-3.5 h-11 rounded-[8px] bg-white border border-[#E6E3DF] text-[#514744] hover:text-[#FF5A4F] font-semibold text-xs flex items-center justify-center gap-1 shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>存草稿</span>
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>预览并发布</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
