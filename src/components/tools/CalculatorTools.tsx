import { useState, useMemo } from 'react';
import { Calculator, Percent, Calendar, Activity, CreditCard, TrendingUp, Receipt, DollarSign, Tag, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export default function CalculatorTools({ tool }: Props) {
  // PERCENTAGE CALCULATOR
  const [percMode, setPercMode] = useState<'val_of' | 'is_what_perc' | 'inc_dec'>('val_of');
  const [percX, setPercX] = useState<number>(15);
  const [percY, setPercY] = useState<number>(200);

  // AGE CALCULATOR
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // BMI CALCULATOR
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [metricHeight, setMetricHeight] = useState<number>(175); // cm
  const [metricWeight, setMetricWeight] = useState<number>(70); // kg
  const [impFeet, setImpFeet] = useState<number>(5);
  const [impInches, setImpInches] = useState<number>(9);
  const [impLbs, setImpLbs] = useState<number>(154);

  // EMI CALCULATOR
  const [emiPrincipal, setEmiPrincipal] = useState<number>(1000000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiYears, setEmiYears] = useState<number>(20);

  // SIP CALCULATOR
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipReturn, setSipReturn] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);

  // GST CALCULATOR
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'add' | 'remove'>('add');

  // SIMPLE INTEREST
  const [siP, setSiP] = useState<number>(50000);
  const [siR, setSiR] = useState<number>(6.5);
  const [siT, setSiT] = useState<number>(3);

  // COMPOUND INTEREST
  const [ciP, setCiP] = useState<number>(50000);
  const [ciR, setCiR] = useState<number>(7.0);
  const [ciT, setCiT] = useState<number>(5);
  const [ciFreq, setCiFreq] = useState<number>(12); // monthly

  // DISCOUNT CALCULATOR
  const [discPrice, setDiscPrice] = useState<number>(120);
  const [discPercent, setDiscPercent] = useState<number>(20);
  const [discTax, setDiscTax] = useState<number>(8);

  // --- Calculations ---

  // Percentage
  const percResult = useMemo(() => {
    if (percMode === 'val_of') {
      const res = (percX / 100) * percY;
      return {
        answer: res.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        explanation: `${percX}% × ${percY} = (${percX} / 100) × ${percY} = ${res}`,
      };
    } else if (percMode === 'is_what_perc') {
      const res = percY !== 0 ? (percX / percY) * 100 : 0;
      return {
        answer: `${res.toFixed(2)}%`,
        explanation: `(${percX} ÷ ${percY}) × 100 = ${res.toFixed(2)}%`,
      };
    } else {
      const diff = percY - percX;
      const res = percX !== 0 ? (diff / percX) * 100 : 0;
      const direction = res >= 0 ? 'Increase' : 'Decrease';
      return {
        answer: `${Math.abs(res).toFixed(2)}% ${direction}`,
        explanation: `((${percY} - ${percX}) / ${percX}) × 100 = ${res.toFixed(2)}%`,
      };
    }
  }, [percMode, percX, percY]);

  // Age
  const ageResult = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const target = targetDate ? new Date(targetDate) : new Date();
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = Math.max(0, target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday countdown
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysToBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayName = daysOfWeek[birth.getDay()];

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      daysToBday,
      birthDayName,
    };
  }, [birthDate, targetDate]);

  // BMI
  const bmiResult = useMemo(() => {
    let weightKg = metricWeight;
    let heightM = metricHeight / 100;

    if (bmiUnit === 'imperial') {
      const totalInches = impFeet * 12 + impInches;
      heightM = (totalInches * 2.54) / 100;
      weightKg = impLbs * 0.45359237;
    }

    if (heightM <= 0 || weightKg <= 0) return null;
    const score = weightKg / (heightM * heightM);

    let category = 'Normal';
    let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    let healthyMin = 18.5 * (heightM * heightM);
    let healthyMax = 24.9 * (heightM * heightM);

    if (score < 18.5) {
      category = 'Underweight';
      colorClass = 'text-sky-700 bg-sky-50 border-sky-200';
    } else if (score >= 25 && score < 30) {
      category = 'Overweight';
      colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (score >= 30) {
      category = 'Obese';
      colorClass = 'text-red-700 bg-red-50 border-red-200';
    }

    return {
      score: score.toFixed(1),
      category,
      colorClass,
      healthyRange: `${healthyMin.toFixed(1)} kg - ${healthyMax.toFixed(1)} kg`,
    };
  }, [bmiUnit, metricHeight, metricWeight, impFeet, impInches, impLbs]);

  // EMI
  const emiResult = useMemo(() => {
    const P = emiPrincipal;
    const r = emiRate / 12 / 100;
    const n = emiYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return null;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestPercent: Math.round((totalInterest / totalPayment) * 100),
      principalPercent: Math.round((P / totalPayment) * 100),
    };
  }, [emiPrincipal, emiRate, emiYears]);

  // SIP
  const sipResult = useMemo(() => {
    const P = sipMonthly;
    const i = sipReturn / 12 / 100;
    const n = sipYears * 12;

    if (P <= 0 || i <= 0 || n <= 0) return null;
    const maturityValue = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const investedAmount = P * n;
    const estimatedReturns = maturityValue - investedAmount;

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      maturityValue: Math.round(maturityValue),
      returnPercent: Math.round((estimatedReturns / maturityValue) * 100),
    };
  }, [sipMonthly, sipReturn, sipYears]);

  // GST
  const gstResult = useMemo(() => {
    const amt = gstAmount;
    const r = gstRate;
    if (amt <= 0) return null;

    if (gstType === 'add') {
      const gstVal = (amt * r) / 100;
      const total = amt + gstVal;
      return {
        original: amt,
        gst: gstVal,
        cgst: gstVal / 2,
        sgst: gstVal / 2,
        total: total,
      };
    } else {
      const original = (amt * 100) / (100 + r);
      const gstVal = amt - original;
      return {
        original: original,
        gst: gstVal,
        cgst: gstVal / 2,
        sgst: gstVal / 2,
        total: amt,
      };
    }
  }, [gstAmount, gstRate, gstType]);

  // Simple Interest
  const siResult = useMemo(() => {
    const interest = (siP * siR * siT) / 100;
    const total = siP + interest;
    return {
      interest: interest.toFixed(2),
      total: total.toFixed(2),
    };
  }, [siP, siR, siT]);

  // Compound Interest
  const ciResult = useMemo(() => {
    const r = ciR / 100;
    const n = ciFreq;
    const t = ciT;
    const amount = ciP * Math.pow(1 + r / n, n * t);
    const interest = amount - ciP;
    return {
      interest: interest.toFixed(2),
      total: amount.toFixed(2),
    };
  }, [ciP, ciR, ciT, ciFreq]);

  // Discount
  const discResult = useMemo(() => {
    const savings = (discPrice * discPercent) / 100;
    const priceAfterDiscount = discPrice - savings;
    const taxAmount = (priceAfterDiscount * discTax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;
    return {
      savings: savings.toFixed(2),
      discounted: priceAfterDiscount.toFixed(2),
      final: finalPrice.toFixed(2),
    };
  }, [discPrice, discPercent, discTax]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* PERCENTAGE CALCULATOR */}
      {tool.id === 'percentage-calculator' && (
        <div className="space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs sm:text-sm font-semibold max-w-lg">
            <button
              onClick={() => setPercMode('val_of')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                percMode === 'val_of' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              What is X% of Y?
            </button>
            <button
              onClick={() => setPercMode('is_what_perc')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                percMode === 'is_what_perc' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              X is what % of Y?
            </button>
            <button
              onClick={() => setPercMode('inc_dec')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                percMode === 'inc_dec' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              % Increase / Decrease
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {percMode === 'val_of'
                  ? 'Percentage (X%)'
                  : percMode === 'is_what_perc'
                  ? 'Part Value (X)'
                  : 'Initial Value (X)'}
              </label>
              <input
                type="number"
                value={percX}
                onChange={(e) => setPercX(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {percMode === 'val_of'
                  ? 'Total Value (Y)'
                  : percMode === 'is_what_perc'
                  ? 'Total Value (Y)'
                  : 'Final Value (Y)'}
              </label>
              <input
                type="number"
                value={percY}
                onChange={(e) => setPercY(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
              Calculated Result
            </span>
            <div className="text-3xl sm:text-4xl font-black text-indigo-950 mt-1">
              {percResult.answer}
            </div>
            <div className="mt-3 text-xs sm:text-sm text-indigo-900 font-mono bg-white/80 p-2.5 rounded-lg border border-indigo-200/60 inline-block">
              {percResult.explanation}
            </div>
          </div>
        </div>
      )}

      {/* AGE CALCULATOR */}
      {tool.id === 'age-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Age as of Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-indigo-500"
              />
            </div>
          </div>

          {ageResult && (
            <div className="space-y-4">
              <div className="p-6 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-center sm:text-left">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Exact Chronological Age
                </span>
                <div className="text-3xl sm:text-4xl font-black text-indigo-950 mt-1">
                  {ageResult.years} <span className="text-lg font-normal text-indigo-800">years</span>{' '}
                  {ageResult.months} <span className="text-lg font-normal text-indigo-800">months</span>{' '}
                  {ageResult.days} <span className="text-lg font-normal text-indigo-800">days</span>
                </div>
                <p className="text-xs text-indigo-700 mt-2">
                  Born on a <strong>{ageResult.birthDayName}</strong> • Next birthday in{' '}
                  <strong>{ageResult.daysToBday} days</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Total Days Lived</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {ageResult.totalDays.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Total Hours Lived</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {ageResult.totalHours.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Total Minutes Lived</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {ageResult.totalMinutes.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BMI CALCULATOR */}
      {tool.id === 'bmi-calculator' && (
        <div className="space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold max-w-xs">
            <button
              onClick={() => setBmiUnit('metric')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                bmiUnit === 'metric' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Metric (cm, kg)
            </button>
            <button
              onClick={() => setBmiUnit('imperial')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                bmiUnit === 'imperial' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Imperial (ft+in, lbs)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            {bmiUnit === 'metric' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={metricHeight}
                    onChange={(e) => setMetricHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={metricWeight}
                    onChange={(e) => setMetricWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Height (ft + in)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={impFeet}
                      onChange={(e) => setImpFeet(parseInt(e.target.value, 10) || 0)}
                      placeholder="ft"
                      className="w-1/2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                    />
                    <input
                      type="number"
                      value={impInches}
                      onChange={(e) => setImpInches(parseInt(e.target.value, 10) || 0)}
                      placeholder="in"
                      className="w-1/2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={impLbs}
                    onChange={(e) => setImpLbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
                  />
                </div>
              </>
            )}
          </div>

          {bmiResult && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Body Mass Index
                  </span>
                  <div className="text-4xl font-black text-slate-900 mt-1">{bmiResult.score}</div>
                </div>

                <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${bmiResult.colorClass}`}>
                  Classification: {bmiResult.category}
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                Healthy weight reference for this height: <strong>{bmiResult.healthyRange}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EMI CALCULATOR */}
      {tool.id === 'emi-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loan Principal</label>
              <input
                type="number"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={emiRate}
                onChange={(e) => setEmiRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loan Tenure (Years)</label>
              <input
                type="number"
                value={emiYears}
                onChange={(e) => setEmiYears(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
          </div>

          {emiResult && (
            <div className="space-y-6">
              <div className="p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center sm:text-left">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Monthly Repayment (EMI)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-indigo-950 mt-1">
                  ${emiResult.monthlyEmi.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Total Interest Payable</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    ${emiResult.totalInterest.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    {emiResult.interestPercent}% of total payment
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Total Payment (Principal + Interest)</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    ${emiResult.totalPayment.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIP CALCULATOR */}
      {tool.id === 'sip-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Investment</label>
              <input
                type="number"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Expected Return (% p.a.)</label>
              <input
                type="number"
                step="0.5"
                value={sipReturn}
                onChange={(e) => setSipReturn(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Time Horizon (Years)</label>
              <input
                type="number"
                value={sipYears}
                onChange={(e) => setSipYears(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
          </div>

          {sipResult && (
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Total Expected Corpus (Maturity Value)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1">
                  ${sipResult.maturityValue.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium">Invested Principal</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    ${sipResult.investedAmount.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <span className="text-xs text-indigo-700 font-medium">Estimated Wealth Gained</span>
                  <div className="text-xl font-bold text-indigo-950 mt-0.5">
                    +${sipResult.estimatedReturns.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GST CALCULATOR */}
      {tool.id === 'gst-calculator' && (
        <div className="space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold max-w-xs">
            <button
              onClick={() => setGstType('add')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                gstType === 'add' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Add GST (Exclusive)
            </button>
            <button
              onClick={() => setGstType('remove')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                gstType === 'remove' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Remove GST (Inclusive)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Base Amount ($)</label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">GST Slab Rate</label>
              <div className="flex flex-wrap gap-1.5">
                {[3, 5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      gstRate === rate
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {gstResult && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Gross Amount
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    ${gstResult.total.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Total Tax ({gstRate}%)
                  </span>
                  <div className="text-2xl font-black text-indigo-600 mt-1">
                    ${gstResult.gst.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block">CGST ({(gstRate / 2).toFixed(1)}%)</span>
                  <span className="font-bold text-slate-900 text-sm">${gstResult.cgst.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block">SGST ({(gstRate / 2).toFixed(1)}%)</span>
                  <span className="font-bold text-slate-900 text-sm">${gstResult.sgst.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIMPLE INTEREST */}
      {tool.id === 'simple-interest-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Principal Amount (P)</label>
              <input
                type="number"
                value={siP}
                onChange={(e) => setSiP(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Annual Rate (R %)</label>
              <input
                type="number"
                step="0.1"
                value={siR}
                onChange={(e) => setSiR(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Time in Years (T)</label>
              <input
                type="number"
                step="0.5"
                value={siT}
                onChange={(e) => setSiT(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Total Simple Interest
              </span>
              <div className="text-3xl font-black text-indigo-950 mt-1">${siResult.interest}</div>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Maturity Amount (P + I)
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">${siResult.total}</div>
            </div>
          </div>
        </div>
      )}

      {/* COMPOUND INTEREST */}
      {tool.id === 'compound-interest-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Principal (P)</label>
              <input
                type="number"
                value={ciP}
                onChange={(e) => setCiP(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Annual Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={ciR}
                onChange={(e) => setCiR(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Years (t)</label>
              <input
                type="number"
                value={ciT}
                onChange={(e) => setCiT(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Compounding</label>
              <select
                value={ciFreq}
                onChange={(e) => setCiFreq(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold cursor-pointer"
              >
                <option value="1">Annually (1/yr)</option>
                <option value="2">Semi-Annually (2/yr)</option>
                <option value="4">Quarterly (4/yr)</option>
                <option value="12">Monthly (12/yr)</option>
                <option value="365">Daily (365/yr)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Compound Interest Earned
              </span>
              <div className="text-3xl font-black text-indigo-950 mt-1">${ciResult.interest}</div>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Final Future Value (A)
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">${ciResult.total}</div>
            </div>
          </div>
        </div>
      )}

      {/* DISCOUNT CALCULATOR */}
      {tool.id === 'discount-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Original Price ($)</label>
              <input
                type="number"
                value={discPrice}
                onChange={(e) => setDiscPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Discount (% Off)</label>
              <input
                type="number"
                value={discPercent}
                onChange={(e) => setDiscPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Sales Tax (%)</label>
              <input
                type="number"
                value={discTax}
                onChange={(e) => setDiscTax(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="text-xs text-emerald-700 font-bold uppercase">You Save</span>
              <div className="text-2xl font-black text-emerald-950 mt-1">${discResult.savings}</div>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 font-bold uppercase">Discounted Price</span>
              <div className="text-2xl font-black text-slate-900 mt-1">${discResult.discounted}</div>
            </div>
            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
              <span className="text-xs text-indigo-700 font-bold uppercase">Final (with Tax)</span>
              <div className="text-2xl font-black text-indigo-950 mt-1">${discResult.final}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
