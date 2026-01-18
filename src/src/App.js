import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export default function LifeCounter() {
  const [birthDate, setBirthDate] = useState('');
  const [lifeExpectancy, setLifeExpectancy] = useState(75);
  const [viewMode, setViewMode] = useState('years');
  const [habits, setHabits] = useState([]);
  const [showApp, setShowApp] = useState(false);

  const habitStats = {
    'Курение': { impact: -6 },
    'Алкоголь (регулярно)': { impact: -5 },
    'Малоподвижный образ': { impact: -4 },
    'Спорт': { impact: 3 },
    'Здоровая диета': { impact: 2 },
    'Медитация': { impact: 1.5 },
    'Хороший сон (8ч)': { impact: 2.5 },
    'Социальное общение': { impact: 2 }
  };

  const getTotalHabitImpact = () => {
    return habits.reduce((sum, h) => sum + (habitStats[h]?.impact || 0), 0);
  };

  const calculateStats = () => {
    if (!birthDate || birthDate.length < 10) return null;

    try {
      const parts = birthDate.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      
      if (!year || !month || !day || year < 1900 || year > 2024 || month < 1 || month > 12 || day < 1 || day > 31) return null;
      
      const birth = new Date(year, month - 1, day);
      const today = new Date();
      const daysPassed = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      
      if (daysPassed < 0) return null;
      
      const habitImpact = getTotalHabitImpact();
      const actualLifeExpectancy = lifeExpectancy + habitImpact;
      
      const totalYears = actualLifeExpectancy;
      const passedYears = daysPassed / 365.25;
      
      let totalUnits = totalYears;
      let passedUnits = passedYears;
      
      if (viewMode === 'weeks') {
        totalUnits = totalYears * 52.14;
        passedUnits = passedYears * 52.14;
      } else if (viewMode === 'months') {
        totalUnits = totalYears * 12;
        passedUnits = passedYears * 12;
      }
      
      const percentPassed = (passedUnits / totalUnits) * 100;
      let age = today.getFullYear() - year;
      
      if (today.getMonth() < month - 1 || 
          (today.getMonth() === month - 1 && today.getDate() < day)) {
        age--;
      }

      return {
        totalUnits: Math.floor(totalUnits),
        passedUnits: Math.floor(passedUnits),
        remainingUnits: Math.max(0, Math.floor(totalUnits - passedUnits)),
        percentPassed: Math.min(100, Math.max(0, percentPassed)),
        age,
        actualLifeExpectancy,
        habitImpact
      };
    } catch (e) {
      return null;
    }
  };

  const stats = calculateStats();
  const dateParts = birthDate.split('-');
  const isDateComplete = birthDate && 
    dateParts.length === 3 && 
    dateParts[0] && dateParts[0].length === 4 &&
    dateParts[1] && dateParts[1] !== '00' &&
    dateParts[2] && dateParts[2] !== '00';

  const toggleHabit = (habit) => {
    if (habits.includes(habit)) {
      setHabits(habits.filter(h => h !== habit));
    } else {
      setHabits([...habits, habit]);
    }
  };

  const unitLabels = {
    weeks: 'недель',
    months: 'месяцев',
    years: 'лет'
  };

  if (!showApp) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 tracking-tight">dimaglg.life</h1>
            <p className="text-gray-500 text-lg">Узнай сколько времени у тебя осталось</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="mb-8">
              <label className="block text-sm text-gray-400 mb-4 font-medium">Дата рождения</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="День"
                  min="1"
                  max="31"
                  onChange={(e) => {
                    const d = e.target.value ? String(e.target.value).padStart(2, '0') : '';
                    const parts = birthDate.split('-');
                    const m = parts[1] || '';
                    const y = parts[0] || '';
                    setBirthDate(`${y}-${m}-${d}`);
                  }}
                  className="w-1/3 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-white/30 transition"
                />
                <input
                  type="number"
                  placeholder="Месяц"
                  min="1"
                  max="12"
                  onChange={(e) => {
                    const m = e.target.value ? String(e.target.value).padStart(2, '0') : '';
                    const parts = birthDate.split('-');
                    const d = parts[2] || '';
                    const y = parts[0] || '';
                    setBirthDate(`${y}-${m}-${d}`);
                  }}
                  className="w-1/3 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-white/30 transition"
                />
                <input
                  type="number"
                  placeholder="Год"
                  min="1900"
                  max="2024"
                  onChange={(e) => {
                    const y = e.target.value;
                    const parts = birthDate.split('-');
                    const m = parts[1] || '';
                    const d = parts[2] || '';
                    setBirthDate(`${y}-${m}-${d}`);
                  }}
                  className="w-1/3 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm text-gray-400 mb-4 font-medium">Ожидаемая жизнь: <span className="text-white font-bold">{lifeExpectancy}</span> лет</label>
              <input
                type="range"
                min="50"
                max="100"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            {isDateComplete && (
              <button
                onClick={() => setShowApp(true)}
                className="w-full bg-white text-black rounded-xl py-3 font-bold hover:bg-gray-200 transition animate-fade-in"
              >
                Продолжить
              </button>
            )}

            {!isDateComplete && birthDate && (
              <p className="text-center text-gray-400 text-sm">Заполните все поля</p>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-center">
          <p className="text-gray-400 mb-4">Ошибка в дате рождения</p>
          <button
            onClick={() => { setShowApp(false); setBirthDate(''); }}
            className="bg-white text-black rounded-xl px-6 py-3 font-bold hover:bg-gray-200 transition"
          >
            Исправить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4" style={{
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">dimaglg.life</h1>
            <p className="text-gray-500 text-sm mt-1">Возраст: {stats.age} лет</p>
          </div>
          <button
            onClick={() => { setShowApp(false); setBirthDate(''); setHabits([]); }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl mb-6">
          {/* View Mode Buttons */}
          <div className="flex gap-2 mb-6">
            {['weeks', 'months', 'years'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === mode
                    ? 'bg-white text-black'
                    : 'backdrop-blur-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {unitLabels[mode]}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-500 text-sm mb-2">Прожито</p>
              <p className="text-3xl font-bold">{stats.passedUnits}</p>
            </div>
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-500 text-sm mb-2">Осталось</p>
              <p className="text-3xl font-bold text-gray-200">{stats.remainingUnits}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-sm">Прогресс жизни</p>
              <p className="text-white font-bold">{Math.floor(stats.percentPassed)}%</p>
            </div>
            <div className="backdrop-blur-lg bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-gray-300 to-white h-full transition-all duration-500"
                style={{ width: `${stats.percentPassed}%` }}
              ></div>
            </div>
          </div>

          {/* Dot Grid - Адаптивная сетка */}
          <div className="backdrop-blur-lg bg-black/50 rounded-2xl border border-white/10" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px'
          }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: viewMode === 'years' ? 'repeat(auto-fit, minmax(20px, 1fr))' : 
                                  viewMode === 'months' ? 'repeat(auto-fit, minmax(14px, 1fr))' : 
                                  'repeat(auto-fit, minmax(8px, 1fr))',
              gap: '3px',
              padding: '0',
              width: '100%',
              maxWidth: '100%'
            }}>
              {Array.from({ length: stats.totalUnits }).map((_, i) => {
                let dotColor = 'bg-white/20';
                const habitImpactInUnits = getTotalHabitImpact() * (viewMode === 'weeks' ? 52.14 : viewMode === 'months' ? 12 : 1);
                
                if (i < stats.passedUnits) {
                  dotColor = 'bg-white';
                } else if (getTotalHabitImpact() > 0 && i < stats.passedUnits + habitImpactInUnits) {
                  dotColor = 'bg-green-500';
                } else if (getTotalHabitImpact() < 0 && i >= stats.totalUnits + habitImpactInUnits) {
                  dotColor = 'bg-red-500';
                }
                
                return (
                  <div
                    key={i}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '50%'
                    }}
                    className={`transition-all duration-500 ${dotColor}`}
                  ></div>
                );
              })}
            </div>
            <p className="text-gray-500 text-xs text-center mt-3 w-full">
              {viewMode === 'years' && 'По 1 точке в год'}
              {viewMode === 'months' && 'По 1 точке в месяц'}
              {viewMode === 'weeks' && 'По 1 точке в неделю'}
            </p>
          </div>
        </div>

        {/* Habits Section */}
        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Образ жизни</h2>

          <div className="space-y-3 mb-6">
            {Object.entries(habitStats).map(([habit, { impact }]) => (
              <button
                key={habit}
                onClick={() => toggleHabit(habit)}
                className={`w-full p-4 rounded-xl transition backdrop-blur-lg border ${
                  habits.includes(habit)
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/8'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{habit}</span>
                  <span className={`text-sm font-bold ${impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {impact > 0 ? '+' : ''}{impact} лет
                  </span>
                </div>
              </button>
            ))}
          </div>

          {habits.length > 0 && (
            <div className="backdrop-blur-lg bg-black/50 rounded-2xl p-6 border border-white/10">
              <p className="text-gray-500 text-sm mb-3">Изменение ожидаемой жизни</p>
              <p className="text-4xl font-bold mb-4">
                <span className={getTotalHabitImpact() > 0 ? 'text-green-400' : 'text-red-400'}>
                  {getTotalHabitImpact() > 0 ? '+' : ''}
                  {getTotalHabitImpact().toFixed(1)} лет
                </span>
              </p>
              <p className="text-gray-400 text-sm">
                Новая ожидаемая жизнь: <span className="text-white font-bold">{Math.round(stats.actualLifeExpectancy)}</span> лет
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-xs">
          <p>Данные основаны на исследованиях ВОЗ</p>
        </div>
      </div>
    </div>
  );
}
