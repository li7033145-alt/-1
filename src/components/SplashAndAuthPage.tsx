import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Phone,
  Sparkles,
  User,
  ArrowRight,
} from 'lucide-react';
import { InterestPreference, UserProfile } from '../types/activity';
import { CAMPUS_LIST } from '../data/initialData';
import { ALL_INTEREST_PREFERENCES } from '../utils/activityRules';

export type AuthScreenPhase = 'splash' | 'login' | 'register';

interface SplashAndAuthPageProps {
  initialPhase?: AuthScreenPhase;
  currentCampus: string;
  currentSubCampus: string;
  userProfile: UserProfile;
  onLoginSuccess: (profile: UserProfile, campus: string, subCampus: string) => void;
}

const GRADES = ['2026级', '2025级', '2024级', '2023级'];

export const SplashAndAuthPage: React.FC<SplashAndAuthPageProps> = ({
  initialPhase = 'splash',
  currentCampus,
  currentSubCampus,
  userProfile,
  onLoginSuccess,
}) => {
  const [phase, setPhase] = useState<AuthScreenPhase>(initialPhase);
  const [splashProgress, setSplashProgress] = useState<number>(18);

  // Login state
  const [loginAccount, setLoginAccount] = useState<string>(userProfile.studentId || '2024081036');
  const [loginPassword, setLoginPassword] = useState<string>('yichang2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Register state
  const [regNickname, setRegNickname] = useState<string>('');
  const [regStudentId, setRegStudentId] = useState<string>('');
  const [regGrade, setRegGrade] = useState<string>('2024级');
  const [regCampus, setRegCampus] = useState<string>(currentCampus || '广东建设职业技术学院');
  const [regSubCampus, setRegSubCampus] = useState<string>(
    currentSubCampus && currentSubCampus !== '全部校区' ? currentSubCampus : '清远校区'
  );
  const [regDepartment, setRegDepartment] = useState<string>('建筑信息工程学院 · 软件技术');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regInterests, setRegInterests] = useState<InterestPreference[]>(['艺术', '体育', '讲座']);
  const [regError, setRegError] = useState<string>('');

  const selectedCampusObj =
    CAMPUS_LIST.find((c) => c.name === regCampus) || CAMPUS_LIST[0];
  const subCampusList = selectedCampusObj.subCampuses || ['清远校区', '广州校区'];

  useEffect(() => {
    setPhase(initialPhase);
  }, [initialPhase]);

  useEffect(() => {
    if (phase !== 'splash') return;
    setSplashProgress(20);
    const t1 = setTimeout(() => setSplashProgress(65), 320);
    const t2 = setTimeout(() => setSplashProgress(100), 750);
    const t3 = setTimeout(() => {
      setPhase('login');
    }, 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount.trim()) {
      setLoginError('请输入学号或绑定手机号');
      return;
    }
    if (!loginPassword.trim() || loginPassword.trim().length < 4) {
      setLoginError('请输入不少于 4 位的登录密码');
      return;
    }
    setLoginError('');
    const updatedProfile: UserProfile = {
      ...userProfile,
      studentId: loginAccount.trim(),
    };
    onLoginSuccess(updatedProfile, currentCampus, currentSubCampus);
  };

  const handleQuickDemoLogin = () => {
    setLoginError('');
    onLoginSuccess(userProfile, currentCampus, currentSubCampus);
  };

  const handleToggleRegInterest = (pref: InterestPreference) => {
    setRegInterests((prev) => {
      if (prev.includes(pref)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== pref);
      }
      return [...prev, pref];
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNickname.trim()) {
      setRegError('请填写真实姓名或校园昵称');
      return;
    }
    if (!regStudentId.trim()) {
      setRegError('请填写学号以完成校园身份核验');
      return;
    }
    if (!regDepartment.trim()) {
      setRegError('请填写所属学院与专业');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('请填写联系电话');
      return;
    }
    if (!regPassword.trim() || regPassword.trim().length < 6) {
      setRegError('请设置不少于 6 位的登录密码');
      return;
    }
    setRegError('');

    const newProfile: UserProfile = {
      ...userProfile,
      nickname: regNickname.trim(),
      studentId: regStudentId.trim(),
      grade: regGrade,
      campus: regCampus,
      subCampus: regSubCampus,
      department: regDepartment.trim(),
      phone: regPhone.trim(),
      interests: regInterests,
    };
    onLoginSuccess(newProfile, regCampus, regSubCampus);
  };

  const handleFillRegisterDemo = () => {
    setRegNickname('陈嘉禾');
    setRegStudentId('2025031208');
    setRegGrade('2025级');
    setRegCampus('广东建设职业技术学院');
    setRegSubCampus('清远校区');
    setRegDepartment('建筑与艺术学院 · 视觉传达设计');
    setRegPhone('13924086612');
    setRegPassword('yichang2026');
    setRegInterests(['艺术', '音乐', '社团']);
    setRegError('');
  };

  // --- 1. 品牌加载页 (Splash Screen) ---
  if (phase === 'splash') {
    return (
      <div
        data-testid="splash-screen"
        className="flex flex-col justify-between h-full bg-[#171717] text-white px-6 py-8 select-none relative overflow-hidden"
      >
        {/* 顶部状态与跳过按钮 */}
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-medium text-white/60 tracking-wider">
            YICHANG CAMPUS · 2026
          </span>
          <button
            type="button"
            onClick={() => setPhase('login')}
            className="px-3 py-1.5 rounded-[6px] bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            跳过加载
          </button>
        </div>

        {/* 中心品牌视觉区 */}
        <div className="my-auto space-y-6 z-10">
          <div className="w-16 h-16 rounded-[10px] bg-[#FF5A4F] flex items-center justify-center shadow-[0_12px_32px_rgba(255,90,79,0.35)]">
            <span className="text-[32px] font-black tracking-tight text-white leading-none">
              一
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-[34px] font-black tracking-tight text-white leading-none">
                一场
              </h1>
              <span className="text-sm font-semibold text-[#FF5A4F]">校园活动平台</span>
            </div>
            <p className="text-[17px] font-medium text-white/85 tracking-tight">
              校园里，总有一场值得去。
            </p>
            <p className="text-xs text-white/50 leading-relaxed max-w-[280px]">
              聚合讲座、比赛、文体、社团与艺术展览，支持一键报名与同场组团结伴。
            </p>
          </div>

          {/* 加载进度条 */}
          <div className="pt-4 space-y-2 max-w-[240px]">
            <div className="h-1.5 w-full rounded-[4px] bg-white/15 overflow-hidden">
              <div
                className="h-full bg-[#FF5A4F] transition-all duration-300 ease-out"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/55 tabular-nums">
              <span>正在同步校园活动数据...</span>
              <span>{splashProgress}%</span>
            </div>
          </div>
        </div>

        {/* 底部直达操作 */}
        <div className="space-y-2.5 z-10">
          <button
            type="button"
            onClick={() => setPhase('login')}
            className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white text-sm font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
          >
            <span>进入登录 / 注册</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-white/40">
            默认示范高校：广东建设职业技术学院（清远 / 广州校区）
          </p>
        </div>
      </div>
    );
  }

  // --- 2. 登录 / 注册页 (Login & Register Screen) ---
  return (
    <div
      data-testid="auth-screen"
      className="flex flex-col min-h-full bg-[#F4F2EE] text-[#171717] pb-6"
    >
      {/* 顶部品牌头部 */}
      <div className="bg-[#171717] text-white px-5 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[8px] bg-[#FF5A4F] flex items-center justify-center font-black text-lg text-white">
              一
            </div>
            <div>
              <h1 className="text-[19px] font-black tracking-tight leading-none">
                一场 · 校园通行证
              </h1>
              <p className="text-[11px] text-white/65 mt-1">
                校园里，总有一场值得去
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('splash')}
            className="px-2.5 py-1 rounded-[6px] bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white/85 transition-colors"
          >
            查看加载页
          </button>
        </div>

        {/* 登录 / 注册 Tab 切换器 */}
        <div
          role="tablist"
          aria-label="登录与注册切换"
          className="mt-5 grid grid-cols-2 gap-1.5 p-1 rounded-[8px] bg-white/10"
        >
          <button
            type="button"
            role="tab"
            aria-selected={phase === 'login'}
            onClick={() => {
              setPhase('login');
              setLoginError('');
            }}
            className={`py-2 rounded-[6px] text-xs font-bold transition-colors ${
              phase === 'login'
                ? 'bg-[#FF5A4F] text-white'
                : 'text-white/75 hover:text-white'
            }`}
          >
            账号登录
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={phase === 'register'}
            onClick={() => {
              setPhase('register');
              setRegError('');
            }}
            className={`py-2 rounded-[6px] text-xs font-bold transition-colors ${
              phase === 'register'
                ? 'bg-[#FF5A4F] text-white'
                : 'text-white/75 hover:text-white'
            }`}
          >
            新同学注册
          </button>
        </div>
      </div>

      {/* 主体表单区 */}
      <div className="px-5 pt-4 flex-1">
        {phase === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#F0EEEC] pb-2.5">
                <div>
                  <h2 className="text-[16px] font-bold text-[#171717]">高校学生统一身份登录</h2>
                  <p className="text-xs text-[#8C7E79] mt-0.5">
                    支持学号或校园绑定手机号登录
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#FF5A4F]">在校生认证</span>
              </div>

              <div>
                <label
                  htmlFor="login-account"
                  className="block text-xs font-semibold text-[#171717] mb-1.5"
                >
                  学号 / 手机号 <span className="text-[#FF5A4F]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9A8984] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-account"
                    type="text"
                    value={loginAccount}
                    onChange={(e) => setLoginAccount(e.target.value)}
                    placeholder="请输入学号（如 2024081036）或手机号"
                    className="w-full h-10 pl-9 pr-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[#171717] mb-1.5"
                >
                  登录密码 <span className="text-[#FF5A4F]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9A8984] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="请输入登录密码"
                    className="w-full h-10 pl-9 pr-9 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    className="w-8 h-8 flex items-center justify-center text-[#9A8984] hover:text-[#171717] absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] flex items-center justify-between text-xs">
                <div className="min-w-0">
                  <span className="text-[#8C7E79] block">当前默认登录校园</span>
                  <strong className="text-[#171717] mt-0.5 block truncate">
                    {currentCampus} · {currentSubCampus}
                  </strong>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#FF5A4F] shrink-0" />
              </div>

              {loginError && <p className="text-xs font-medium text-[#FF5A4F]">{loginError}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-[15px] flex items-center justify-center active:scale-[0.99] transition-transform"
              >
                登录进入一场
              </button>
            </div>

            {/* 快捷演示登录与切换注册提示 */}
            <div className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#171717]">演示体验通道</span>
                <span className="text-[#8C7E79]">林晓阳 · 2024级软件技术</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full h-10 rounded-[8px] bg-[#FFF0ED] text-[#FF5A4F] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FFE4DF] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>一键使用示范学生账号登录</span>
              </button>
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setPhase('register')}
                  className="text-xs text-[#514744] hover:text-[#FF5A4F] font-medium"
                >
                  还没有账号？<span className="text-[#FF5A4F] font-bold ml-1 underline">点击注册新同学账号</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0EEEC] pb-2.5">
                <div>
                  <h2 className="text-[16px] font-bold text-[#171717]">新同学注册认证</h2>
                  <p className="text-xs text-[#8C7E79] mt-0.5">
                    完善校区与兴趣偏好，为你精准推荐校园活动
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillRegisterDemo}
                  className="px-2.5 py-1 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>填入示例</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="reg-nickname"
                    className="block text-xs font-semibold text-[#171717] mb-1"
                  >
                    姓名 / 昵称 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="reg-nickname"
                    type="text"
                    value={regNickname}
                    onChange={(e) => setRegNickname(e.target.value)}
                    placeholder="如：陈嘉禾"
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-student-id"
                    className="block text-xs font-semibold text-[#171717] mb-1"
                  >
                    学号 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="reg-student-id"
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    placeholder="如：2025031208"
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                  />
                </div>
              </div>

              {/* 所属高校与分校区 */}
              <div>
                <label
                  htmlFor="reg-campus"
                  className="block text-xs font-semibold text-[#171717] mb-1"
                >
                  所属高校 <span className="text-[#FF5A4F]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#9A8984] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="reg-campus"
                    value={regCampus}
                    onChange={(e) => {
                      const nextSchool = e.target.value;
                      setRegCampus(nextSchool);
                      const schoolObj = CAMPUS_LIST.find((c) => c.name === nextSchool);
                      if (schoolObj && schoolObj.subCampuses.length > 0) {
                        setRegSubCampus(schoolObj.subCampuses[0]);
                      }
                    }}
                    className="w-full h-10 pl-9 pr-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                  >
                    {CAMPUS_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}（{c.city}）
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    常驻校区 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {subCampusList.slice(0, 2).map((sub) => {
                      const active = regSubCampus === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setRegSubCampus(sub)}
                          className={`flex-1 h-9 rounded-[6px] text-xs font-semibold border transition-colors ${
                            active
                              ? 'bg-[#FF5A4F] text-white border-[#FF5A4F]'
                              : 'bg-[#F7F7F5] text-[#514744] border-[#E6E3DF]'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-grade"
                    className="block text-xs font-semibold text-[#171717] mb-1"
                  >
                    入学年级
                  </label>
                  <select
                    id="reg-grade"
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-dept"
                  className="block text-xs font-semibold text-[#171717] mb-1"
                >
                  所属学院与专业 <span className="text-[#FF5A4F]">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#9A8984] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-dept"
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="如：建筑信息工程学院 · 软件技术"
                    className="w-full h-10 pl-9 pr-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] focus:outline-none focus:border-[#FF5A4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="reg-phone"
                    className="block text-xs font-semibold text-[#171717] mb-1"
                  >
                    手机号码 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#9A8984] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="11位手机号"
                      className="w-full h-10 pl-8 pr-2.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-semibold text-[#171717] mb-1"
                  >
                    设置密码 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="不少于6位"
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
              </div>

              {/* 兴趣偏好勾选 */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  兴趣偏好（用于首页「今日精选」推荐）
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {ALL_INTEREST_PREFERENCES.map((pref) => {
                    const selected = regInterests.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => handleToggleRegInterest(pref)}
                        className={`py-1.5 rounded-[6px] text-xs font-semibold border transition-colors ${
                          selected
                            ? 'bg-[#171717] text-white border-[#171717]'
                            : 'bg-[#F7F7F5] text-[#514744] border-[#E6E3DF]'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {regError && <p className="text-xs font-medium text-[#FF5A4F]">{regError}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-[15px] flex items-center justify-center active:scale-[0.99] transition-transform"
              >
                完成注册并进入一场
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
