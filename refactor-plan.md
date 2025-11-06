# City Data Refactor Plan

## Goal
Refactor from hash-based to array-based city data structure

## New Structure
```javascript
const cities = [
  { nom: 'New York', lat: 40.7, lon: -74.0, pop: 19.5e6, sss: 4.42, dst: true },
  // ... more cities
];
```

Fields:
- `nom`: City name
- `lat`: Precise latitude (decimal)
- `lon`: Longitude (need to add - can use 0 as placeholder initially)
- `pop`: Population
- `sss`: Summer Solstice Sunrise WITHOUT DST (decimal hours)
- `dst`: Boolean - does this city observe DST?

## Steps

1. **Extract current data to array format**
   - Go through existing cityData hash
   - Create array entry for each city
   - Use rounded latitude as `lat` value (can refine later)
   - Set `lon: null` as placeholder
   - Parse DST info from comments into boolean
   - Deduplicate (keep each city once at its most accurate latitude)

2. **Update getCitiesForLatitude**
   - Change from hash lookup to array filter
   - Filter by `Math.round(city.lat) === roundedLat`
   - Memoize result for performance

3. **Update display calculations**
   - cityDisplayData should use `city.sss` instead of `city.sunrise`
   - Logic for adding DST offset stays the same

4. **Test thoroughly**
   - Verify each latitude shows same cities
   - Verify sunrise times match for DST on/off
   - Check edge cases (southern hemisphere, etc.)

## Questions for User

1. Should I add real longitude values or leave placeholder? 
REAL LONGITUDE
2. For duplicate cities (e.g., Tokyo at 35 and 36), which latitude to keep?
LOOK IT UP AND USE WHAT'S CORRECT
3. OK to proceed with this plan?
YES