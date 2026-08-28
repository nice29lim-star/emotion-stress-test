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
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E293B] flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center shadow-pop-sm">
              <CloudSun className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span>웰니스 기록장 & 기후 트래킹</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 ml-1">
            시간의 흐름에 따른 마음 날씨의 변화와 회복탄력성 추이를 관찰하세요.
          </p>
        </div>

        <button
          onClick={onStartNewDiagnosis}
          className="px-6 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>오늘 마음 진단하기</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 shadow-pop-card">
          <div className="text-xs font-heading font-extrabold text-slate-500 uppercase tracking-wider">
            총 진단 기록
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#1E293B] font-mono">
              {totalCount}
            </span>
            <span className="text-xs text-slate-500 font-bold">회 완료</span>
          </div>
        </div>

        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 shadow-pop-card">
          <div className="text-xs font-heading font-extrabold text-[#F472B6] uppercase tracking-wider">
            평균 스트레스 부하 (PSS)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#F472B6] font-mono">
              {avgStress}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ 16점</span>
          </div>
        </div>

        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 shadow-pop-card">
          <div className="text-xs font-heading font-extrabold text-[#8B5CF6] uppercase tracking-wider">
            평균 회복탄력성 (KRQ)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#8B5CF6] font-mono">
              {avgResilience}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ 5.0점</span>
          </div>
        </div>
      </div>

      {/* Wellness Trend Chart */}
      {logs.length > 1 && (
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-pop-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B] flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-[#8B5CF6] stroke-[2.5]" />
                <span>스트레스 및 회복력 변화 추이</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                지속적인 로깅을 통해 내면의 회복 주기를 파악할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                <YAxis domain={[0, 16]} tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3.5 bg-white rounded-2xl border-2 border-[#1E293B] shadow-pop-sm text-xs space-y-1">
                          <p className="font-heading font-extrabold text-[#1E293B]">{data.fullDate}</p>
                          <p className="text-slate-600 font-medium">{data.title}</p>
                          <div className="pt-1 text-[#F472B6] font-extrabold font-mono">
                            스트레스: {data.stress}점
                          </div>
                          <div className="text-[#8B5CF6] font-extrabold font-mono">
                            회복탄력성: {data.resilienceRaw}점 (5점 만점)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
                <Line
                  type="monotone"
                  dataKey="stress"
                  name="스트레스 (PSS, 16점 만점)"
                  stroke="#F472B6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#F472B6', stroke: '#1E293B', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="resilience"
                  name="회복탄력성 지표 (환산치)"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#8B5CF6', stroke: '#1E293B', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Risk Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-200/80 border-2 border-[#1E293B] w-full sm:w-auto">
          {(['all', '안전', '주의', '위험'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-heading font-extrabold transition-all flex-1 sm:flex-none cursor-pointer ${
                filterRisk === r
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#1E293B] hover:bg-slate-300/60'
              }`}
            >
              {r === 'all' ? '전체 보기' : r}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 메모 검색..."
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-slate-300 focus:border-[#8B5CF6] focus:shadow-pop-violet bg-[#FFFDF5] text-xs text-[#1E293B] font-medium outline-none transition-all"
          />
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-12 text-center shadow-pop-card space-y-4">
          <p className="text-slate-500 font-medium text-sm">일치하는 진단 기록이 없습니다.</p>
          <button
            onClick={onStartNewDiagnosis}
            className="px-6 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            새로운 마음 진단 진행하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const riskBadgeColor =
              log.riskLevel === '안전'
                ? 'bg-[#34D399] text-[#1E293B]'
                : log.riskLevel === '주의'
                ? 'bg-[#FBBF24] text-[#1E293B]'
                : 'bg-[#F472B6] text-white';

            return (
              <div
                key={log.id}
                className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => onSelectLog(log.report)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className="text-xs text-slate-600 flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                      {log.date}
                    </span>
                    <span className={`text-[11px] px-3 py-0.5 rounded-full border-2 border-[#1E293B] font-heading font-extrabold shadow-pop-sm ${riskBadgeColor}`}>
                      {log.riskLevel}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFFDF5] text-[#1E293B] font-bold border border-slate-300">
                      {log.primaryEmotion}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[#1E293B] text-lg group-hover:text-[#8B5CF6] transition-colors">
                    {log.summaryWeather}
                  </h3>

                  {log.userNotes && (
                    <p className="text-xs text-slate-700 font-medium mt-1.5 line-clamp-1 bg-[#FFFDF5] px-3 py-1.5 rounded-xl border border-slate-200">
                      📝 {log.userNotes}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-5 text-xs text-slate-600 font-mono font-bold">
                    <span>
                      스트레스: <strong className="text-[#F472B6]">{log.stressScore}점</strong>
                    </span>
                    <span>
                      회복탄력성: <strong className="text-[#8B5CF6]">{log.resilienceScore}점</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 border-t-2 sm:border-t-0 border-slate-100 pt-3 sm:pt-0 justify-end">
                  <button
                    onClick={() => onSelectLog(log.report)}
                    className="px-5 py-2.5 rounded-full bg-violet-50 hover:bg-[#8B5CF6] text-[#8B5CF6] hover:text-white border-2 border-[#1E293B] font-heading font-extrabold text-xs shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>리포트 열람</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2.5 rounded-full border-2 border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-colors cursor-pointer"
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

