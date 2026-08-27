import React, { useState } from 'react';
import { WellnessLog, DiagnosisReport } from '../types';
import {
  Calendar,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  CloudSun,
  Activity,
  PlusCircle,
  FileText,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface HistoryDashboardProps {
  logs: WellnessLog[];
  onSelectLog: (report: DiagnosisReport) => void;
  onDeleteLog: (id: string) => void;
  onStartNewDiagnosis: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  logs,
  onSelectLog,
  onDeleteLog,
  onStartNewDiagnosis,
}) => {
  const [filterRisk, setFilterRisk] = useState<'all' | '안전' | '주의' | '위험'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Prepare chart data (reverse chronological to chronological for chart)
  const chartData = [...logs].reverse().map((log, idx) => ({
    name: log.date.split(' ').slice(1, 3).join(' ') || `#${idx + 1}`,
    stress: log.stressScore,
    resilience: Number((log.resilienceScore * 3.2).toFixed(1)), // Scale to ~16 for comparable visualization
    resilienceRaw: log.resilienceScore,
    fullDate: log.date,
    title: log.summaryWeather,
  }));

  // Filter logs
  const filteredLogs = logs.filter((l) => {
    const matchesRisk = filterRisk === 'all' || l.riskLevel === filterRisk;
    const matchesSearch =
      searchTerm === '' ||
      l.summaryWeather.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.userNotes && l.userNotes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.primaryEmotion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  // Calculate high-level stats
  const totalCount = logs.length;
  const avgStress =
    totalCount > 0
      ? (logs.reduce((acc, l) => acc + l.stressScore, 0) / totalCount).toFixed(1)
      : '0';
  const avgResilience =
    totalCount > 0
      ? (logs.reduce((acc, l) => acc + l.resilienceScore, 0) / totalCount).toFixed(1)
      : '0';

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
            <CloudSun className="w-7 h-7 text-teal-700" />
            <span>웰니스 기록장 & 마음 기후 트래킹</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            시간의 흐름에 따른 마음 날씨의 변화와 회복탄력성 추이를 관찰하세요.
          </p>
        </div>

        <button
          onClick={onStartNewDiagnosis}
          className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>오늘 마음 진단하기</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            총 진단 기록
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
              {totalCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">회 완료</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
            평균 스트레스 부하 (PSS)
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-900 font-mono">
              {avgStress}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ 16점</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
            평균 회복탄력성 (KRQ)
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-900 font-mono">
              {avgResilience}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ 5.0점</span>
          </div>
        </div>
      </div>

      {/* Wellness Trend Chart */}
      {logs.length > 1 && (
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-700" />
                <span>스트레스 및 회복력 변화 추이</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                지속적인 로깅을 통해 내면의 회복 주기를 파악할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="h-60 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 16]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-white/95 rounded-xl border border-stone-200 shadow-md text-xs space-y-1">
                          <p className="font-bold text-stone-800">{data.fullDate}</p>
                          <p className="text-stone-600">{data.title}</p>
                          <div className="pt-1 text-rose-600 font-semibold">
                            스트레스: {data.stress}점
                          </div>
                          <div className="text-teal-700 font-semibold">
                            회복탄력성: {data.resilienceRaw}점 (5점 만점)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="stress"
                  name="스트레스 (PSS, 16점 만점)"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#e11d48' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="resilience"
                  name="회복탄력성 지표 (스케일 환산)"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0d9488' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Risk Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-200/60 w-full sm:w-auto">
          {(['all', '안전', '주의', '위험'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 sm:flex-none cursor-pointer ${
                filterRisk === r
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {r === 'all' ? '전체 보기' : r}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 메모 검색..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder:text-stone-400 focus:border-teal-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center border border-stone-200/80 space-y-3">
          <p className="text-stone-500 text-sm">일치하는 진단 기록이 없습니다.</p>
          <button
            onClick={onStartNewDiagnosis}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            새로운 마음 진단 진행하기
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredLogs.map((log) => {
            const riskBadgeColor =
              log.riskLevel === '안전'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : log.riskLevel === '주의'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-rose-50 text-rose-900 border-rose-300';

            return (
              <div
                key={log.id}
                className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => onSelectLog(log.report)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {log.date}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${riskBadgeColor}`}>
                      {log.riskLevel}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                      {log.primaryEmotion}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base sm:text-lg group-hover:text-teal-800 transition-colors">
                    {log.summaryWeather}
                  </h3>

                  {log.userNotes && (
                    <p className="text-xs text-stone-600 mt-1 line-clamp-1 bg-stone-50/80 px-2.5 py-1 rounded-md border border-stone-200/50">
                      📝 {log.userNotes}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-center gap-4 text-xs text-stone-500 font-mono">
                    <span>
                      스트레스: <strong className="text-rose-700 font-bold">{log.stressScore}점</strong>
                    </span>
                    <span>
                      회복탄력성: <strong className="text-teal-700 font-bold">{log.resilienceScore}점</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 justify-end">
                  <button
                    onClick={() => onSelectLog(log.report)}
                    className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>리포트 열람</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="기록 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
