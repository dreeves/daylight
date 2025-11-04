import ReactDOM from 'react-dom/client';

// ========== BEGIN CLAUDE CODE ==========
// Paste Claude's artifact code between these markers

import React, { useState, useMemo, useCallback } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area } from 'recharts';


const DawnDeltaTool = () => {
  const [latitude, setLatitude] = useState(40);
  const [wakeTime, setWakeTime] = useState(2);
  const [bedtime, setBedtime] = useState(18);
  const [dstEnabled, setDstEnabled] = useState(false);
  // European defaults: last Sunday in March (day 87) to last Sunday in October (day 301)
  const [dstStart, setDstStart] = useState(87);
  const [dstEnd, setDstEnd] = useState(301);

  // DST date rules for various locales
  // Using formula: kth whateverday = 7k-3, last whateverday = L-3
  // Source: Computed averages over 400-year Gregorian cycle
  const dstLocales = useMemo(() => [
    { name: 'Europe', start: 87, end: 301 }, // Last Sun Mar (28) to Last Sun Oct (28)
    { name: 'USA/Canada', start: 70, end: 308 }, // 2nd Sun Mar (11) to 1st Sun Nov (4)
    { name: 'Australia', start: 277, end: 94 }, // 1st Sun Oct (4) to 1st Sun Apr (4)
    { name: 'New Zealand', start: 270, end: 94 }, // Last Sun Sep (27) to 1st Sun Apr (4)
    { name: 'Paraguay', start: 277, end: 84 }, // 1st Sun Oct (4) to 4th Sun Mar (25)
    { name: 'Cuba', start: 70, end: 308 }, // 2nd Sun Mar (11) to 1st Sun Nov (4)
  ], []);

  // Get locale names for start date
  const getLocalesForStartDate = useCallback((start) => {
    return dstLocales
      .filter(loc => Math.abs(loc.start - start) <= 1)
      .map(loc => loc.name);
  }, [dstLocales]);

  // Get locale names for end date
  const getLocalesForEndDate = useCallback((end) => {
    return dstLocales
      .filter(loc => Math.abs(loc.end - end) <= 1)
      .map(loc => loc.name);
  }, [dstLocales]);

  const startLocales = useMemo(() => 
    getLocalesForStartDate(dstStart), 
    [dstStart, getLocalesForStartDate]
  );

  const endLocales = useMemo(() => 
    getLocalesForEndDate(dstEnd), 
    [dstEnd, getLocalesForEndDate]
  );

  // Convert day of year to month/day string
  const dayOfYearToDate = useCallback((day) => {
    const date = new Date(2024, 0, day); // 2024 is a leap year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }, []);

  // Get city names for exact integer latitude
  // Data sources: Wikipedia city coordinates, rounded to nearest degree
  // Population data from 2020-2024 metropolitan area estimates
  const getCitiesForLatitude = useCallback((lat) => {
    const cityData = {
      64: [{ name: 'Reykjavik', pop: 233034 }],
      60: [{ name: 'Saint Petersburg', pop: 5.6e6 }, { name: 'Helsinki', pop: 1.5e6 }, { name: 'Oslo', pop: 1.04e6 }],
      59: [{ name: 'Stockholm', pop: 2.4e6 }],
      56: [{ name: 'Moscow', pop: 21.5e6 }, { name: 'Copenhagen', pop: 2.1e6 }],
      55: [{ name: 'Edinburgh', pop: 900000 }],
      54: [{ name: 'Hamburg', pop: 5.1e6 }],
      53: [{ name: 'Dublin', pop: 1.4e6 }],
      52: [{ name: 'Berlin', pop: 6.1e6 }, { name: 'Warsaw', pop: 3.1e6 }, { name: 'Amsterdam', pop: 2.4e6 }],
      51: [{ name: 'London', pop: 14.3e6 }, { name: 'Calgary', pop: 1.6e6 }],
      50: [{ name: 'Frankfurt', pop: 5.9e6 }, { name: 'Prague', pop: 2.7e6 }, { name: 'Vancouver', pop: 2.6e6 }],
      49: [{ name: 'Paris', pop: 11.2e6 }, { name: 'Munich', pop: 6.1e6 }],
      48: [{ name: 'Seattle', pop: 4.0e6 }, { name: 'Vienna', pop: 2.9e6 }],
      46: [{ name: 'Montreal', pop: 4.3e6 }, { name: 'Portland', pop: 2.5e6 }],
      45: [{ name: 'Milan', pop: 7.6e6 }, { name: 'Minneapolis', pop: 3.7e6 }],
      44: [{ name: 'Toronto', pop: 6.4e6 }],
      43: [{ name: 'Boston', pop: 4.9e6 }, { name: 'Marseille', pop: 1.9e6 }],
      42: [{ name: 'Chicago', pop: 9.6e6 }, { name: 'Rome', pop: 4.3e6 }],
      41: [{ name: 'New York', pop: 19.5e6 }, { name: 'Istanbul', pop: 15.8e6 }, { name: 'Madrid', pop: 6.7e6 }],
      40: [{ name: 'Beijing', pop: 21.5e6 }, { name: 'Philadelphia', pop: 6.2e6 }],
      39: [{ name: 'Washington DC', pop: 6.4e6 }, { name: 'Ankara', pop: 5.7e6 }],
      38: [{ name: 'Seoul', pop: 25.5e6 }, { name: 'San Francisco', pop: 4.7e6 }, { name: 'Athens', pop: 3.1e6 }],
      37: [{ name: 'Los Angeles', pop: 12.5e6 }],
      36: [{ name: 'Tokyo', pop: 37.3e6 }],
      35: [{ name: 'Tokyo', pop: 37.3e6 }, { name: 'Las Vegas', pop: 2.3e6 }],
      34: [{ name: 'Phoenix', pop: 4.9e6 }],
      33: [{ name: 'Shanghai', pop: 29.2e6 }, { name: 'Dallas', pop: 7.6e6 }, { name: 'Baghdad', pop: 7.2e6 }],
      32: [{ name: 'San Diego', pop: 3.3e6 }],
      31: [{ name: 'Shanghai', pop: 29.2e6 }, { name: 'Cairo', pop: 21.3e6 }],
      30: [{ name: 'Houston', pop: 7.1e6 }, { name: 'New Orleans', pop: 1.3e6 }],
      29: [{ name: 'Delhi', pop: 32.9e6 }],
      28: [{ name: 'Miami', pop: 6.1e6 }],
      26: [{ name: 'Riyadh', pop: 7.7e6 }],
      25: [{ name: 'Taipei', pop: 7.0e6 }],
      23: [{ name: 'Kolkata', pop: 15.1e6 }, { name: 'Havana', pop: 2.1e6 }],
      22: [{ name: 'Dhaka', pop: 22.5e6 }, { name: 'Mumbai', pop: 21.3e6 }],
      19: [{ name: 'Mexico City', pop: 22.0e6 }, { name: 'Manila', pop: 14.7e6 }],
      14: [{ name: 'Bangkok', pop: 17.1e6 }, { name: 'Manila', pop: 14.7e6 }],
      13: [{ name: 'Bangkok', pop: 17.1e6 }, { name: 'Lagos', pop: 15.4e6 }],
      9: [{ name: 'Singapore', pop: 5.9e6 }],
      7: [{ name: 'Bogotá', pop: 11.5e6 }],
      5: [{ name: 'Bogotá', pop: 11.5e6 }],
      1: [{ name: 'Nairobi', pop: 5.1e6 }],
      0: [{ name: 'Quito', pop: 2.9e6 }],
      '-1': [{ name: 'Nairobi', pop: 5.1e6 }],
      '-6': [{ name: 'Jakarta', pop: 34.5e6 }],
      '-8': [{ name: 'Jakarta', pop: 34.5e6 }],
      '-12': [{ name: 'Lima', pop: 11.2e6 }],
      '-13': [{ name: 'Lima', pop: 11.2e6 }],
      '-23': [{ name: 'São Paulo', pop: 22.6e6 }, { name: 'Rio de Janeiro', pop: 13.7e6 }],
      '-26': [{ name: 'Johannesburg', pop: 10.0e6 }],
      '-30': [{ name: 'Durban', pop: 3.7e6 }],
      '-33': [{ name: 'Santiago', pop: 6.8e6 }, { name: 'Sydney', pop: 5.3e6 }],
      '-34': [{ name: 'Buenos Aires', pop: 15.6e6 }, { name: 'Cape Town', pop: 4.7e6 }],
      '-35': [{ name: 'Melbourne', pop: 5.1e6 }],
      '-37': [{ name: 'Melbourne', pop: 5.1e6 }],
      '-41': [{ name: 'Wellington', pop: 415000 }],
      '-45': [{ name: 'Dunedin', pop: 130000 }],
      '-53': [{ name: 'Punta Arenas', pop: 130000 }],
    };
    
    const roundedLat = Math.round(lat);
    const cities = cityData[roundedLat.toString()];
    
    if (!cities) return [];
    
    return cities
      .sort((a, b) => b.pop - a.pop)
      .slice(0, 3)
      .map(c => c.name);
  }, []);

  const cityNames = useMemo(() => getCitiesForLatitude(latitude), [latitude, getCitiesForLatitude]);

  const sleepHours = useMemo(() => {
    return 24 - (bedtime - wakeTime);
  }, [wakeTime, bedtime]);

  const isDSTActive = useCallback((dayOfYear, isLeapYear) => {
    // Handle wrapping (e.g., Australia where DST spans year boundary)
    if (dstStart < dstEnd) {
      return dayOfYear >= dstStart && dayOfYear < dstEnd;
    } else {
      return dayOfYear >= dstStart || dayOfYear < dstEnd;
    }
  }, [dstStart, dstEnd]);

  const calculateSunrise = useCallback((dayOfYear, lat, totalDays) => {
    const latRad = (lat * Math.PI) / 180;
    const declination = -23.45 * Math.cos((2 * Math.PI / totalDays) * (dayOfYear + 10));
    const declinationRad = (declination * Math.PI) / 180;
    const cosHourAngle = -Math.tan(latRad) * Math.tan(declinationRad);
    
    if (cosHourAngle > 1) return null;
    if (cosHourAngle < -1) return 0;
    
    const hourAngle = Math.acos(cosHourAngle);
    return 12 - (hourAngle * 12) / Math.PI;
  }, []);

  const calculateSunset = useCallback((dayOfYear, lat, totalDays) => {
    const latRad = (lat * Math.PI) / 180;
    const declination = -23.45 * Math.cos((2 * Math.PI / totalDays) * (dayOfYear + 10));
    const declinationRad = (declination * Math.PI) / 180;
    const cosHourAngle = -Math.tan(latRad) * Math.tan(declinationRad);
    
    if (cosHourAngle > 1) return null;
    if (cosHourAngle < -1) return 24;
    
    const hourAngle = Math.acos(cosHourAngle);
    return 12 + (hourAngle * 12) / Math.PI;
  }, []);

  const calculateYearData = useCallback((isLeapYear, useDST) => {
    const totalDays = isLeapYear ? 366 : 365;
    const summerSolsticeDay = isLeapYear ? 173 : 172;
    const summerSolsticeSunrise = calculateSunrise(summerSolsticeDay, latitude, totalDays);
    
    const result = [];
    
    for (let day = 1; day <= totalDays; day++) {
      const sunrise = calculateSunrise(day, latitude, totalDays);
      const sunset = calculateSunset(day, latitude, totalDays);
      
      const dawnDelta = (sunrise !== null && summerSolsticeSunrise !== null) 
        ? sunrise - summerSolsticeSunrise 
        : 0;
      
      const duskDelta = (sunset !== null && summerSolsticeSunrise !== null)
        ? sunset - summerSolsticeSunrise
        : 0;
      
      const isDST = useDST && isDSTActive(day, isLeapYear);
      const adjustedWakeTime = isDST ? wakeTime - 1 : wakeTime;
      const adjustedBedtime = isDST ? bedtime - 1 : bedtime;
      
      result.push({ 
        day,
        dawnDelta, 
        duskDelta, 
        wakeTime: adjustedWakeTime,
        sleepTime: adjustedBedtime
      });
    }
    
    return result;
  }, [latitude, wakeTime, bedtime, calculateSunrise, calculateSunset, isDSTActive]);

  const data = useMemo(() => {
    const nonLeapData = calculateYearData(false, dstEnabled);
    const result = [];
    
    for (let day = 1; day <= 365; day++) {
      const nonLeap = nonLeapData[day - 1];
      const { dawnDelta, duskDelta, wakeTime: adjustedWakeTime, sleepTime } = nonLeap;
      
      const date = new Date(2024, 0, day);
      const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
      
      const daylightAwakeStart = Math.max(dawnDelta, adjustedWakeTime);
      const daylightAwakeEnd = Math.min(duskDelta, sleepTime);
      const daylightAwake = daylightAwakeStart < daylightAwakeEnd ? [daylightAwakeStart, daylightAwakeEnd] : null;
      
      const morningWasteStart = dawnDelta;
      const morningWasteEnd = Math.min(adjustedWakeTime, duskDelta);
      const morningWaste = (morningWasteStart < morningWasteEnd && adjustedWakeTime > dawnDelta) ? [morningWasteStart, morningWasteEnd] : null;
      
      const eveningWasteStart = Math.max(sleepTime, dawnDelta);
      const eveningWasteEnd = duskDelta;
      const eveningWaste = (eveningWasteStart < eveningWasteEnd && sleepTime < duskDelta) ? [eveningWasteStart, eveningWasteEnd] : null;
      
      const darkAsleepMorning = adjustedWakeTime > 0 && dawnDelta > 0 ? [0, Math.min(adjustedWakeTime, dawnDelta)] : null;
      const darkAsleepEvening = sleepTime < 24 && duskDelta < 24 ? [Math.max(sleepTime, duskDelta), 24] : null;
      
      const nightAwakeMorning = (adjustedWakeTime < dawnDelta && dawnDelta < sleepTime) ? [adjustedWakeTime, Math.min(dawnDelta, sleepTime)] : null;
      const nightAwakeEvening = (adjustedWakeTime < duskDelta && duskDelta < sleepTime) ? [Math.max(duskDelta, adjustedWakeTime), sleepTime] : null;
      
      result.push({ 
        day, 
        monthDay, 
        dawnDelta, 
        duskDelta, 
        wakeTime: adjustedWakeTime,
        sleepTime,
        daylightAwake,
        morningWaste,
        eveningWaste,
        darkAsleepMorning,
        darkAsleepEvening,
        nightAwakeMorning,
        nightAwakeEvening
      });
    }
    
    return result;
  }, [calculateYearData, dstEnabled]);

  const calculateWastedDaylight = useCallback((useDST) => {
    const nonLeapData = calculateYearData(false, useDST);
    const leapData = calculateYearData(true, useDST);
    
    let nonLeapWaste = 0;
    for (let i = 0; i < nonLeapData.length; i++) {
      const { dawnDelta, duskDelta, wakeTime: adjustedWakeTime, sleepTime } = nonLeapData[i];
      const morningWaste = Math.max(0, Math.min(adjustedWakeTime, duskDelta) - Math.max(0, dawnDelta));
      const eveningWaste = Math.max(0, Math.min(24, duskDelta) - Math.max(sleepTime, dawnDelta));
      nonLeapWaste += morningWaste + eveningWaste;
    }
    
    let leapWaste = 0;
    for (let i = 0; i < leapData.length; i++) {
      const { dawnDelta, duskDelta, wakeTime: adjustedWakeTime, sleepTime } = leapData[i];
      const morningWaste = Math.max(0, Math.min(adjustedWakeTime, duskDelta) - Math.max(0, dawnDelta));
      const eveningWaste = Math.max(0, Math.min(24, duskDelta) - Math.max(sleepTime, dawnDelta));
      leapWaste += morningWaste + eveningWaste;
    }
    
    return nonLeapWaste * 0.75 + leapWaste * 0.25;
  }, [calculateYearData]);

  const wastedDaylight = useMemo(() => {
    return calculateWastedDaylight(dstEnabled);
  }, [calculateWastedDaylight, dstEnabled]);

  const dstSavings = useMemo(() => {
    const wasteWithoutDST = calculateWastedDaylight(false);
    const wasteWithDST = calculateWastedDaylight(true);
    return wasteWithoutDST - wasteWithDST;
  }, [calculateWastedDaylight]);

  const formatTimeDelta = useCallback((hours) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `+${h}h\u2009${m}m`;
  }, []);

  const formatHours = useCallback((hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h\u2009${m}m`;
  }, []);

  const formatHoursWithSign = useCallback((hours) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(Math.abs(totalMinutes) / 60);
    const m = Math.abs(totalMinutes) % 60;
    const sign = totalMinutes >= 0 ? '' : '−';
    return `${sign}${h}h\u2009${m}m`;
  }, []);

  const formatHoursPerDay = useCallback((hours) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h\u2009${m}m per day`;
  }, []);

  const CustomTooltip = useCallback(({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.monthDay}</p>
          <p className="text-sm">Dawn: {formatTimeDelta(data.dawnDelta)}</p>
          <p className="text-sm">Dusk: {formatTimeDelta(data.duskDelta)}</p>
          <p className="text-sm">Wake: {formatTimeDelta(data.wakeTime)}</p>
          <p className="text-sm">Sleep: {formatTimeDelta(data.sleepTime)}</p>
        </div>
      );
    }
    return null;
  }, [formatTimeDelta]);

  const formatYAxis = useCallback((value) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `+${hours}:${minutes.toString().padStart(2, '0')}`;
  }, []);

  const formatXAxis = useCallback((day) => {
    const date = new Date(2024, 0, day);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }, []);

  const xAxisTicks = useMemo(() => [1, 32, 61, 92, 122, 153, 183, 214, 245, 275, 306, 336], []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Daylight Savings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Latitude: {latitude}°{cityNames.length > 0 ? ` (${cityNames.join(', ')})` : ''}
          </label>
          <input
            type="range"
            min="-66"
            max="66"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Antarctic Circle</span>
            <span>Equator</span>
            <span>Arctic Circle</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Wake time: {formatTimeDelta(wakeTime)} from summer dawn
          </label>
          <input
            type="range"
            min="0"
            max="24"
            step="0.25"
            value={wakeTime}
            onChange={(e) => {
              const newWake = Number(e.target.value);
              setWakeTime(newWake);
              if (bedtime <= newWake) {
                setBedtime(newWake + 0.25);
              }
            }}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Bedtime: {formatTimeDelta(bedtime)} ({formatHours(sleepHours)} of sleep)
          </label>
          <input
            type="range"
            min={wakeTime}
            max="24"
            step="0.25"
            value={bedtime}
            onChange={(e) => setBedtime(Number(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="dst-checkbox"
            checked={dstEnabled}
            onChange={(e) => setDstEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="dst-checkbox" className="ml-2 text-lg font-semibold text-gray-700 cursor-pointer">
            DST
          </label>
        </div>

        <div className="mb-4">
          <label className={`block text-lg font-semibold mb-2 ${dstEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
            DST start: {dayOfYearToDate(dstStart)}{startLocales.length > 0 ? ` (${startLocales.join(', ')})` : ''}
          </label>
          <input
            type="range"
            min="1"
            max="365"
            step="7"
            value={dstStart}
            onChange={(e) => setDstStart(Number(e.target.value))}
            disabled={!dstEnabled}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${dstEnabled ? 'bg-yellow-200' : 'bg-gray-200 opacity-50 cursor-not-allowed'}`}
          />
        </div>

        <div className="mb-4">
          <label className={`block text-lg font-semibold mb-2 ${dstEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
            DST end: {dayOfYearToDate(dstEnd)}{endLocales.length > 0 ? ` (${endLocales.join(', ')})` : ''}
          </label>
          <input
            type="range"
            min="1"
            max="365"
            step="7"
            value={dstEnd}
            onChange={(e) => setDstEnd(Number(e.target.value))}
            disabled={!dstEnabled}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${dstEnabled ? 'bg-orange-200' : 'bg-gray-200 opacity-50 cursor-not-allowed'}`}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">
            Wasted daylight: {Math.round(wastedDaylight)} hours/year <span className="text-sm font-normal text-gray-600">({formatHoursPerDay(wastedDaylight / 365.25)})</span>
          </p>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            DST savings: {formatHoursWithSign(dstSavings)} <span className="text-sm font-normal text-gray-600">({formatHoursPerDay(dstSavings / 365.25)})</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="day" 
              ticks={xAxisTicks}
              tickFormatter={formatXAxis}
            />
            <YAxis 
              domain={[0, 24]}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={CustomTooltip} />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            
            <Area type="monotone" dataKey="darkAsleepMorning" stroke="none" fill="#7c3aed" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="darkAsleepEvening" stroke="none" fill="#7c3aed" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="nightAwakeMorning" stroke="none" fill="#c4b5fd" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="nightAwakeEvening" stroke="none" fill="#c4b5fd" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="daylightAwake" stroke="none" fill="#fbbf24" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="morningWaste" stroke="none" fill="#ef4444" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="eveningWaste" stroke="none" fill="#ef4444" fillOpacity={0.5} isAnimationActive={false} />
            
            <Line type="monotone" dataKey="dawnDelta" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="duskDelta" stroke="#dc2626" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="wakeTime" stroke="#16a34a" strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="sleepTime" stroke="#7c3aed" strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DawnDeltaTool;

// ========== END CLAUDE CODE ==========

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DawnDeltaTool />);