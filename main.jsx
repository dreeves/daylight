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

  // City database: each city has name (nom), latitude, longitude, population,
  // local summer solstice sunrise time WITHOUT DST (sss), and DST observation 
  // flag.
  // This data was collected on 2025-11-06. Cities' populations and whether they
  // observe DST (on their summer solstice) may change.
  const cities = [
    { nom: 'Reykjavik', lat: 64.14, lon: -21.90, pop: 233034, sss: 2.70, dst: false },
    { nom: 'Saint Petersburg', lat: 59.94, lon: 30.32, pop: 5.6e6, sss: 3.78, dst: false },
    { nom: 'Helsinki', lat: 60.17, lon: 24.93, pop: 1.5e6, sss: 2.70, dst: true },
    { nom: 'Oslo', lat: 59.91, lon: 10.75, pop: 1.04e6, sss: 3.70, dst: true },
    { nom: 'Stockholm', lat: 59.33, lon: 18.07, pop: 1.6e6, sss: 2.58, dst: true },
    { nom: 'Moscow', lat: 55.75, lon: 37.62, pop: 13.2e6, sss: 3.72, dst: false },
    { nom: 'Copenhagen', lat: 55.68, lon: 12.57, pop: 2.1e6, sss: 3.43, dst: true },
    { nom: 'Edinburgh', lat: 55.95, lon: -3.19, pop: 1.4e6, sss: 3.43, dst: true },
    { nom: 'Hamburg', lat: 53.55, lon: 10.00, pop: 5.1e6, sss: 3.83, dst: true },
    { nom: 'Dublin', lat: 53.35, lon: -6.26, pop: 1.9e6, sss: 4.02, dst: true },
    { nom: 'Berlin', lat: 52.52, lon: 13.40, pop: 6.1e6, sss: 3.70, dst: true },
    { nom: 'Warsaw', lat: 52.24, lon: 21.01, pop: 3.1e6, sss: 3.70, dst: true },
    { nom: 'Amsterdam', lat: 52.37, lon: 4.89, pop: 2.4e6, sss: 3.70, dst: true },
    { nom: 'London', lat: 51.51, lon: -0.13, pop: 14.3e6, sss: 3.72, dst: true },
    { nom: 'Calgary', lat: 51.05, lon: -114.07, pop: 1.6e6, sss: 4.37, dst: true },
    { nom: 'Frankfurt', lat: 50.11, lon: 8.68, pop: 5.9e6, sss: 3.70, dst: true },
    { nom: 'Prague', lat: 50.08, lon: 14.43, pop: 2.7e6, sss: 3.70, dst: true },
    { nom: 'Vancouver', lat: 49.28, lon: -123.12, pop: 2.6e6, sss: 4.12, dst: true },
    { nom: 'Paris', lat: 48.86, lon: 2.35, pop: 11.2e6, sss: 3.70, dst: true },
    { nom: 'Munich', lat: 48.13, lon: 11.57, pop: 6.1e6, sss: 3.70, dst: true },
    { nom: 'Seattle', lat: 47.61, lon: -122.33, pop: 4.0e6, sss: 4.18, dst: true },
    { nom: 'Vienna', lat: 48.21, lon: 16.37, pop: 2.9e6, sss: 3.70, dst: true },
    { nom: 'Montreal', lat: 45.50, lon: -73.57, pop: 4.3e6, sss: 4.40, dst: true },
    { nom: 'Portland', lat: 45.52, lon: -122.68, pop: 2.5e6, sss: 4.43, dst: true },
    { nom: 'Milan', lat: 45.48, lon: 9.18, pop: 7.6e6, sss: 4.42, dst: true },
    { nom: 'Minneapolis', lat: 44.98, lon: -93.27, pop: 3.7e6, sss: 4.28, dst: true },
    { nom: 'Toronto', lat: 43.70, lon: -79.40, pop: 6.4e6, sss: 4.50, dst: true },
    { nom: 'Boston', lat: 42.36, lon: -71.06, pop: 4.9e6, sss: 4.23, dst: true },
    { nom: 'Marseille', lat: 43.30, lon: 5.40, pop: 1.9e6, sss: 5.00, dst: true },
    { nom: 'Rome', lat: 41.90, lon: 12.50, pop: 4.3e6, sss: 4.50, dst: true },
    { nom: 'Chicago', lat: 41.88, lon: -87.63, pop: 9.6e6, sss: 4.30, dst: true },
    { nom: 'New York', lat: 40.71, lon: -74.01, pop: 19.5e6, sss: 4.42, dst: true },
    { nom: 'Istanbul', lat: 41.00, lon: 28.97, pop: 15.8e6, sss: 4.70, dst: true },
    { nom: 'Madrid', lat: 40.42, lon: -3.70, pop: 6.7e6, sss: 5.70, dst: true },
    { nom: 'Beijing', lat: 39.90, lon: 116.40, pop: 21.5e6, sss: 5.07, dst: false },
    { nom: 'Philadelphia', lat: 39.95, lon: -75.17, pop: 6.2e6, sss: 4.55, dst: true },
    { nom: 'Washington DC', lat: 38.90, lon: -77.04, pop: 6.4e6, sss: 4.55, dst: true },
    { nom: 'Ankara', lat: 39.93, lon: 32.86, pop: 5.7e6, sss: 4.70, dst: true },
    { nom: 'Seoul', lat: 37.56, lon: 126.98, pop: 25.5e6, sss: 5.07, dst: false },
    { nom: 'San Francisco', lat: 37.77, lon: -122.42, pop: 4.7e6, sss: 4.70, dst: true },
    { nom: 'Athens', lat: 37.98, lon: 23.72, pop: 3.1e6, sss: 4.70, dst: true },
    { nom: 'Los Angeles', lat: 34.05, lon: -118.25, pop: 13.3e6, sss: 4.70, dst: true },
    { nom: 'Tokyo', lat: 35.68, lon: 139.76, pop: 37.3e6, sss: 4.42, dst: false },
    { nom: 'Las Vegas', lat: 36.17, lon: -115.14, pop: 2.3e6, sss: 4.38, dst: true },
    { nom: 'Baghdad', lat: 33.34, lon: 44.40, pop: 7.2e6, sss: 5.17, dst: false },
    { nom: 'Dallas', lat: 32.78, lon: -96.80, pop: 7.6e6, sss: 5.32, dst: true },
    { nom: 'San Diego', lat: 32.72, lon: -117.16, pop: 3.3e6, sss: 4.67, dst: true },
    { nom: 'Phoenix', lat: 33.45, lon: -112.07, pop: 4.9e6, sss: 5.30, dst: false },
    { nom: 'Shanghai', lat: 31.23, lon: 121.47, pop: 29.2e6, sss: 4.70, dst: false },
    { nom: 'Cairo', lat: 30.04, lon: 31.24, pop: 21.3e6, sss: 5.70, dst: false },
    { nom: 'Houston', lat: 29.76, lon: -95.37, pop: 7.1e6, sss: 5.33, dst: true },
    { nom: 'New Orleans', lat: 29.95, lon: -90.07, pop: 1.3e6, sss: 5.12, dst: true },
    { nom: 'Delhi', lat: 28.61, lon: 77.21, pop: 32.9e6, sss: 5.42, dst: false },
    { nom: 'Miami', lat: 25.77, lon: -80.19, pop: 6.2e6, sss: 5.47, dst: true },
    { nom: 'Karachi', lat: 24.86, lon: 66.99, pop: 16.9e6, sss: 6.00, dst: false },
    { nom: 'Riyadh', lat: 24.69, lon: 46.72, pop: 7.7e6, sss: 5.70, dst: false },
    { nom: 'Taipei', lat: 25.03, lon: 121.56, pop: 7.0e6, sss: 5.12, dst: false },
    { nom: 'Havana', lat: 23.11, lon: -82.36, pop: 2.1e6, sss: 5.40, dst: true },
    { nom: 'Dhaka', lat: 23.81, lon: 90.41, pop: 23.9e6, sss: 5.17, dst: false },
    { nom: 'Kolkata', lat: 22.57, lon: 88.36, pop: 15.1e6, sss: 5.27, dst: false },
    { nom: 'Mumbai', lat: 19.07, lon: 72.88, pop: 23.4e6, sss: 6.00, dst: false },
    { nom: 'Mexico City', lat: 19.43, lon: -99.13, pop: 22.0e6, sss: 5.97, dst: false },
    { nom: 'Manila', lat: 14.60, lon: 120.98, pop: 14.7e6, sss: 5.47, dst: false },
    { nom: 'Bangkok', lat: 13.75, lon: 100.50, pop: 17.1e6, sss: 5.83, dst: false },
    { nom: 'Lagos', lat: 6.52, lon: 3.38, pop: 15.4e6, sss: 5.48, dst: false },
    { nom: 'Bogotá', lat: 4.65, lon: -74.06, pop: 11.5e6, sss: 5.67, dst: false },
    { nom: 'Singapore', lat: 1.35, lon: 103.82, pop: 5.9e6, sss: 7.12, dst: false },
    { nom: 'Quito', lat: -0.18, lon: -78.47, pop: 2.9e6, sss: 6.05, dst: false },
    { nom: 'Nairobi', lat: -1.29, lon: 36.82, pop: 5.1e6, sss: 5.70, dst: false },
    { nom: 'Jakarta', lat: -6.21, lon: 106.85, pop: 34.5e6, sss: 5.42, dst: false },
    { nom: 'Lima', lat: -12.04, lon: -77.03, pop: 11.2e6, sss: 5.55, dst: false },
    { nom: 'São Paulo', lat: -23.55, lon: -46.63, pop: 22.6e6, sss: 4.28, dst: true },
    { nom: 'Rio de Janeiro', lat: -22.91, lon: -43.20, pop: 13.7e6, sss: 4.07, dst: true },
    { nom: 'Johannesburg', lat: -26.20, lon: 28.05, pop: 10.0e6, sss: 6.87, dst: false },
    { nom: 'Durban', lat: -29.86, lon: 31.02, pop: 3.7e6, sss: 6.83, dst: false },
    { nom: 'Santiago', lat: -33.45, lon: -70.67, pop: 6.8e6, sss: 5.50, dst: true },
    { nom: 'Sydney', lat: -33.87, lon: 151.21, pop: 5.3e6, sss: 4.67, dst: true },
    { nom: 'Buenos Aires', lat: -34.60, lon: -58.38, pop: 15.6e6, sss: 5.62, dst: false },
    { nom: 'Cape Town', lat: -33.55, lon: 18.25, pop: 4.7e6, sss: 7.75, dst: false },
    { nom: 'Melbourne', lat: -37.81, lon: 144.96, pop: 5.1e6, sss: 4.90, dst: true },
    { nom: 'Wellington', lat: -41.29, lon: 174.78, pop: 415000, sss: 4.72, dst: true },
    { nom: 'Dunedin', lat: -45.87, lon: 170.50, pop: 130000, sss: 4.72, dst: true },
    { nom: 'Punta Arenas', lat: -53.16, lon: -70.92, pop: 130000, sss: 5.50, dst: true },
  ];

  // Pre-compute hash map from rounded latitude to cities (computed once)
  const cityByLatitude = useMemo(() => {
    const map = {};
    cities.forEach(city => {
      const roundedLat = Math.round(city.lat);
      if (!map[roundedLat]) map[roundedLat] = [];
      map[roundedLat].push(city);
    });
    // Sort by population and take top 3 for each latitude
    Object.keys(map).forEach(lat => {
      map[lat] = map[lat]
        .sort((a, b) => b.pop - a.pop)
        .slice(0, 3)
        .map(city => ({ name: city.nom, pop: city.pop, sunrise: city.sss }));
    });
    return map;
  }, []);

  const getCitiesForLatitude = useCallback((lat) => {
    const roundedLat = Math.round(lat);
    return cityByLatitude[roundedLat] || [];
  }, [cityByLatitude]);

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

  // Format sunrise times for display with DST adjustment
  const cityDisplayData = useMemo(() => {
    const cities = getCitiesForLatitude(latitude);
    if (cities.length === 0) return [];
    
    const totalDays = 365;
    const summerSolsticeDay = latitude >= 0 ? 172 : 355;
    const isDST = dstEnabled && isDSTActive(summerSolsticeDay, false);
    const dstOffset = isDST ? 1 : 0;
    
    return cities.map(city => {
      const localClockTime = (city.sunrise + dstOffset) % 24;
      
      const hours = Math.floor(localClockTime);
      const minutes = Math.round((localClockTime - hours) * 60);
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      
      return {
        name: city.name,
        time: `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`
      };
    });
  }, [latitude, getCitiesForLatitude, dstEnabled, isDSTActive]);

  // Format wake times for cities (sunrise + wakeTime offset)
  const cityWakeDisplayData = useMemo(() => {
    const cities = getCitiesForLatitude(latitude);
    if (cities.length === 0) return [];
    
    const totalDays = 365;
    const summerSolsticeDay = latitude >= 0 ? 172 : 355;
    const isDST = dstEnabled && isDSTActive(summerSolsticeDay, false);
    const dstOffset = isDST ? 1 : 0;
    
    return cities.map(city => {
      const wakeClockTime = (city.sunrise + dstOffset + wakeTime) % 24;
      
      const hours = Math.floor(wakeClockTime);
      const minutes = Math.round((wakeClockTime - hours) * 60);
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      
      return {
        name: city.name,
        time: `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`
      };
    });
  }, [latitude, getCitiesForLatitude, dstEnabled, isDSTActive, wakeTime]);

  const calculateYearData = useCallback((isLeapYear, useDST) => {
    const totalDays = isLeapYear ? 366 : 365;
    // For Northern Hemisphere: summer solstice in June (day 172/173)
    // For Southern Hemisphere: summer solstice in December (day 355/356)
    const summerSolsticeDay = latitude >= 0 
      ? (isLeapYear ? 173 : 172)  // June 21
      : (isLeapYear ? 356 : 355); // December 21
    const summerSolsticeSunrise = calculateSunrise(summerSolsticeDay, latitude, totalDays);
    
    const result = [];
    
    for (let day = 1; day <= totalDays; day++) {
      const sunrise = calculateSunrise(day, latitude, totalDays);
      const sunset = calculateSunset(day, latitude, totalDays);
      
      const dawnDelta = (sunrise !== null && summerSolsticeSunrise !== null) 
        ? sunrise - summerSolsticeSunrise 
        : null;
      
      const duskDelta = (sunset !== null && summerSolsticeSunrise !== null)
        ? sunset - summerSolsticeSunrise
        : null;
      
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
      
      // Handle sleep during darkness (before wake and after sleep)
      const darkAsleepMorning = adjustedWakeTime > 0 ? [0, Math.min(adjustedWakeTime, dawnDelta ?? adjustedWakeTime)] : null;
      const darkAsleepEvening = sleepTime < 24 ? [Math.max(sleepTime, duskDelta ?? sleepTime), 24] : null;
      
      const nightAwakeMorning = (dawnDelta !== null && adjustedWakeTime < dawnDelta && dawnDelta < sleepTime) ? [adjustedWakeTime, dawnDelta] : null;
      const nightAwakeEvening = (duskDelta !== null && adjustedWakeTime < duskDelta && duskDelta < sleepTime) ? [duskDelta, sleepTime] : null;
      
      // Handle cases where person is awake entirely during darkness (no overlap with daylight)
      // Case 1: Wake after dusk and sleep after dusk (entire wake period in evening darkness)
      const nightAwakeAfterDusk = (duskDelta !== null && adjustedWakeTime >= duskDelta && sleepTime > duskDelta && adjustedWakeTime < sleepTime) ? [adjustedWakeTime, sleepTime] : null;
      // Case 2: Wake before dawn and sleep before dawn (entire wake period in morning darkness)
      const nightAwakeBeforeDawn = (dawnDelta !== null && adjustedWakeTime < dawnDelta && sleepTime <= dawnDelta && adjustedWakeTime < sleepTime) ? [adjustedWakeTime, sleepTime] : null;
      // Case 3: Polar night (no sunrise/sunset) - entire wake period is in darkness
      const nightAwakePolarNight = (dawnDelta === null || duskDelta === null) && adjustedWakeTime < sleepTime ? [adjustedWakeTime, sleepTime] : null;
      
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
        nightAwakeEvening,
        nightAwakeAfterDusk,
        nightAwakeBeforeDawn,
        nightAwakePolarNight
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
    const h = Math.floor(Math.abs(totalMinutes) / 60);
    const m = Math.abs(totalMinutes) % 60;
    const sign = totalMinutes >= 0 ? '' : '−';
    return `${sign}${h}h\u2009${m}m per day`;
  }, []);

  const CustomTooltip = useCallback(({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(2024, 0, data.day);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthDay = `${months[date.getMonth()]} ${date.getDate()}`;
      
      // Calculate daylight and night hours
      const daylightHours = Math.max(0, data.duskDelta - data.dawnDelta);
      const nightHours = 24 - daylightHours;
      
      // Calculate sleep during night and day
      const awakeHours = data.sleepTime - data.wakeTime;
      const sleepHours = 24 - awakeHours;
      
      // Sleep during night (before sunrise and after sunset)
      const sleepBeforeDawn = Math.max(0, Math.min(data.wakeTime, data.dawnDelta));
      const sleepAfterDusk = Math.max(0, Math.min(24 - data.sleepTime, 24 - data.duskDelta));
      const sleepDuringNight = sleepBeforeDawn + sleepAfterDusk;
      
      // Sleep during day (wasted daylight)
      const sleepDuringDay = sleepHours - sleepDuringNight;
      
      const wasteColor = sleepDuringDay > 0 ? 'text-red-600' : 'text-green-600';

      // leaving the following out for now:
      /*
      <p className="text-sm">Sunset @ {formatTimeDelta(data.duskDelta)}</p>
      <p className="text-sm">Wake @ {formatTimeDelta(data.wakeTime)}</p>
      <p className="text-sm">Bedtime @ {formatTimeDelta(data.sleepTime)}</p>
      */

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold mb-2">{monthDay}</p>
          <p className="text-sm">🌅 {formatTimeDelta(data.dawnDelta)}</p>
          <p className="text-sm mt-1">{formatHours(daylightHours)} ☀️ &nbsp; {formatHours(nightHours)} 🌙</p>
          <p>&nbsp;</p>
          <p className="text-sm">Night vs daytime sleep 💤</p>
          <p className="text-sm">🟢 {formatHours(sleepDuringNight)} 🌙</p>
          <p className="text-sm">🔴 <span className={wasteColor}>{formatHours(sleepDuringDay)}</span> ☀️</p>
        </div>
      );
    }
    return null;
  }, [formatTimeDelta, formatHours]);

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
                <div className="mb-4">Treat Summer Solstice's Sunrise (<b>SSS</b>) as the earliest time of day to care about.
                    The y-axis of the graph starts there.

                </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Latitude: {latitude}°{cityDisplayData.length > 0 ? (
              <span>
                {' '}({cityDisplayData.map(city => `${city.name} ${city.time ? `🌅 ${city.time}` : ''}`).join(', ')})
              </span>
            ) : ''}
          </label>
          <input
            type="range"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>South Pole</span>
            <span>Equator</span>
            <span>North Pole</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Wake: SSS {formatTimeDelta(wakeTime)} {cityWakeDisplayData.length > 0 ? (
              <span>
                {' '}({cityWakeDisplayData.map(city => `${city.name} ⏰ ${city.time}`).join(', ')})
              </span>
            ) : ''}
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
            Bedtime: {formatTimeDelta(bedtime)} (💤 {formatHours(sleepHours)})
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
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${dstEnabled ? 'bg-yellow-200' : 'bg-gray-200 opacity-50'}`}
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
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${dstEnabled ? 'bg-orange-200' : 'bg-gray-200 opacity-50'}`}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700 flex items-center">
            <span className="inline-block w-4 h-4 bg-red-500 bg-opacity-50 rounded mr-2"></span>
            Wasted daylight (💤&nbsp;∩&nbsp;☀️): <span className={`ml-1 ${wastedDaylight > 0 ? 'text-red-600' : 'text-green-600'}`}>{Math.round(wastedDaylight)}</span>{' '}&nbsp;hours/year <span className="text-sm font-normal text-gray-600 ml-1"> ({formatHoursPerDay(wastedDaylight / 365.25)})</span>
          </p>
          <p className="text-lg font-semibold text-gray-700 mt-2 flex items-center">
            <span className="mr-2">🏦</span>
            DST savings: <span className={`ml-1 ${dstSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatHoursWithSign(dstSavings)}</span> <span className="text-sm font-normal text-gray-600 ml-1"> ({formatHoursPerDay(dstSavings / 365.25)})</span>
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
            <Area type="monotone" dataKey="nightAwakeAfterDusk" stroke="none" fill="#c4b5fd" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="nightAwakeBeforeDawn" stroke="none" fill="#c4b5fd" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="nightAwakePolarNight" stroke="none" fill="#c4b5fd" fillOpacity={0.5} isAnimationActive={false} />
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

      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Exposition</h2>


<div className="mb-4">
<p className="text-gray-700">
There is so much confusion and wrongness in debates about whether Daylight Saving Time is a horrific wrong-headed abomination.
I wanted to demonstrate that DST does have an upside to counterbalance the downsides.
It's kind of,
depending on the latitude of where you live, 
like teleporting an hour of daylight from 5am when no one wants it to 8pm when... 
everyone except the kind of people I seem to argue with about this do.
</p>
</div>

<div className="mb-4">
<h3 className="text-lg font-semibold mb-2 text-gray-700">Sunrise times 🌅</h3>
<p className="text-gray-700">
First confusing thing about this tool: 
the sunrise times shown for cities next to the latitude slider are 
the local time of sunrise 
on the summer solstice in each city 
{dstEnabled ? ' WITH ' : ' WITHOUT '} 
DST, used as the baseline (+0:00) on the graph.
Notice how these times of day respect how you checked the DST checkbox, <i>regardless of whether the city actually uses DST</i>.
The point of this tool is to look at hypothetical scenarios.
</p>
</div>

<div className="mb-4">
<h3 className="text-lg font-semibold mb-2 text-gray-700">Crunch crunch crunch</h3>
<p className="text-gray-700">
What this is supposedly doing is walking through every day of the year, using the parameters you've picked to add up the total amount of time you spend asleep during daylight hours.
It does that with and without Daylight Savings Time and shows the difference as DST savings in green 
(or in red if you've slid the sliders to some nonsensical combination that makes DST cause you to waste <i>more</i> daylight).
</p>
<p className="text-gray-700">
<br></br>
For sheer persnickitude it even does that for both leap and non-leap years and computes a 25/75 weighted average.
I'm not sure how many seconds difference it might make to average over the full 400-year Gregorian cycle.
</p>
<p className="text-gray-700">
<br></br>
And I say "supposedly" because Claude (Sonnet 4.5) did all the coding and the math.
It all seems plausibly correct, but.
</p>
</div>

<div className="mb-4">
<h3 className="text-lg font-semibold mb-2 text-gray-700">Technical note on DST start/end dates</h3>
<p className="text-gray-700 mb-2">
You definitely don't have to care about this but
DST rules like "last Sunday in March" are converted to average dates over the 400-year Gregorian cycle. 
GPT-5-Thinking derived these, 🤞:
</p>
<ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
<li>The kth [day-of-week] of a month averages to day <strong>7k−3</strong></li>
<li>(When k=1 that's just 4 which makes sense because the first Saturday, say, is equally likely to fall on the 1st through 7th of the month and the average of 1-7 is 4.)</li>
<li>The last [day-of-week] averages to day <strong>L−3</strong>, where L is the month length (using 28.2425 for February, averaging over the whole 400-year cycle of the Gregorian calendar).</li>
</ul>
</div>

<div className="mb-4">
<h3 className="text-lg font-semibold mb-2 text-gray-700">Even more technical note on Summer Solstice's Sunrise (SSS)</h3>
<p className="text-gray-700 mb-2">
Even though summer solstice is the longest day of the year, that doesn't mean it has the earliest sunrise time.
The reason has to do with solar noon drifting, and, y'know what, this really doesn't matter.
GPT-5, which I'm choosing to believe, is saying the difference is 2-5 minutes for typical mid-latitude cities.
(I spot-checked that for Sydney, Australia -- 3 minutes.)
And I guess at worst 15-17 minutes near the equator? 
But none of this matters near the equator.
For now, we'll stick with the approximation that SSS is the earliest sunrise of the year.
</p>
</div>


<div className="mb-4">
<h3 className="text-lg font-semibold mb-2 text-gray-700">Related reading</h3>
<ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
<li><a href="https://www.lesswrong.com/posts/JrzxrsfbjNTZyZgMW/body-time-and-daylight-savings-apologetics">Body Time and Daylight Savings Apologetics</a></li>
<li><a href="https://andywoodruff.com/blog/where-to-hate-daylight-saving-time-and-where-to-love-it/">Where to Hate Daylight Saving Time and Where to Love It</a></li>
</ul>
</div>


      </div>
    </div>
  );
};

export default DawnDeltaTool;

// ========== END CLAUDE CODE ==========

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DawnDeltaTool />);