# Daylight

How much daylight does Daylight Savings Time save?

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

Static files will be in `dist/` folder.

## GitHub Pages Deployment

1. Push to GitHub
2. Go to repo Settings → Pages → Source: GitHub Actions
3. Every push to `main` auto-deploys to `https://[username].github.io/daylight`

## Local Testing

```bash
npm run build
cd dist && python3 -m http.server 8080
```

Open http://localhost:8080


## Me coaxing Claude Sonnet 4.5 to make the initial version of this

can you make a little tool that has slider for latitude and makes a graph with jan 1 to dec 31 on the x-axis and "dawn delta" on the y-axis, where dawn delta is defined like so: let w by the time of day of dawn on winter solstice for the given latitude. dawn delta for a given day of the year d is the difference, d-w.

_[version 1]_

can you flip the sign so everything's positive? and can you sanity check this by looking up the time of dawn and the time of dusk for some city at a latitude around 45 degrees and tell me what those are?

_[version 2]_

make sure you're getting these times *without* DST so everything is consistent

_[version 3]_

oh, i see why the sign confusion happened. i meant to anchor everything on the time of dawn at *summer* solstice. can you redo this? also can you get all the words out of the UI? exceptions: y-axis label, the word "latitude" for the slider, the words "equator" etc under the slider. and the title can just be "Dawn Delta"

_[version 4]_

can you keep the y-axis fixed at 0-12 hours? and there's a weird gap between jan and feb; can you debug that? also the y-axis label overlaps the numbers slightly. also it's weirdly slow to update the graph as you slide the slider

_[version 5]_

you fixed item 1. everything else seems to be the same or worse. but of course this never works to tell you to try again. you'll just keep throwing spaghetti at the wall forever.

_[version 6]_

this is good now. nice work!
can you also plot the dusk delta (using the same baseline of dawn at summer solstice) on the same graph and shade the range in between yellow?

_[version 7]_

nice. can you add a second slider for "wake time", also measured as the delta from our summer solstice dawn baseline, and plot that as a horizontal line on the graph?

finally, have a checkbox for DST. if it's checked then that horizontal line should jump down an hour during the summer months (using the standard european dates for DST and end-of-DST)

_[version 8]_

nice. can you limit the wake time slider so the earliest it can go is the baseline? also can you change the y-axis label to "Hours after summer solstice dawn"? and change the slider label for wake time to "Wake Time: summer solstice dawn +2h 0m" or whatever amount of time. finally, can you highlight in yellow the area between the orange and red curves?

_[version 9]_

i still see no yellow shading

_[version 10]_

can you make it compute the amount of "wasted daylight", defined as follows:

1. sleep time is 16 hours after wake time
2. for each day of the year, compute the exact amount of time it's daylight while you're asleep
3. add those all up for the whole year
4. report that as total wasted hours
5. recompute it dynamically as you slide the sliders

_[version 11]_

great! small bug report: the y-axis label is starting too low and getting cut off. also, let's generalize that "16 hours" and make it another slider. let's call it "Desired darkness", defaulting to 8 hours. then the "16" used previously is derived as 24 hours minus the desired darkness.

_[version 12]_

can we put another dotted line on the graph that's 24-dd hours above the wake time line? (i'm calling the number of desired darkness hours dd). then ideally we'd darken the region above the top dotted line and below the bottom dotted line, since that's time we're asleep.

to get even fancier, we could pick a bright happy color for the overlap of "daylight" and "awake", a soothing color for the overlap of "dark" and "asleep", and then some harsh bad color for the overlap of "daylight" and "asleep".

_[version 13]_

let's keep the y-axis fixed at 0-24 hours so no rescaling ever happens as we slide the sliders. also the y-axis label is still shifted too far down and is cut off. also, let's change the label for "Desired darkness" to "Bedtime" and show it as a negative number, like this: "Bedtime: wake time -8h 0m" (and use a proper math minus sign). 

also let's tighten the microcopy slightly by changing "summer solstice dawn" to "summer dawn" in both places.

finally, there's something wrong with the shading, i think. let's rethink it:
* daylight AND awake is yellow
* daylight AND asleep is red
* nighttime AND asleep is dark purple
* nighttime AND awake is light purple

sorry, that's a lot at once. review:
1. fixed y-axis range
2. y-axis label shift
3. bedtime slider shown as wake time minus some number of hours
4. drop "solstice" from microcopy
5. new colors for each combination of day/night crossed with awake/asleep

_[version 14]_

now the y-axis label is too high and it overlaps the numbers on the y-axis

_[version 15]_

is there a better way to do that where you just let the charting thing pick where to put things? the y-axis label is not placed very well and it will be too tedious to keep fussing with margins and padding or whatever

_[version 16]_

i still don't love it so, new plan: drop the y-axis label. that leaves a bit more room for the graph.

also, can we prevent any sliding of sliders that makes the y-axis try to go past +24h?

finally, can you double check all the math and make sure it's all impeccable? for example, how should we account for leap years? one answer is to do the calculation twice, once for a 365-day year and once for a 366-day year. then take a weighted average of the two answers, with 75% weight on the answer for the 365-day year.

_[version 17]_

wake/bedtime slider revamp:

for wake time, let's just change the microcopy:

Wake time: +1h 15m from summer dawn

and then for bedtime:

Bedtime: +17h 15m (8h 0m of sleep)

so that +17h 15m is also the delta on summer solstice dawn but we don't try to convey that in the microcopy. it becomes intuitive as you try sliding the slider.

also can we have more leeway for the bedtime slider? anything from the current setting of wake time all the way to +24h.

and new cute feature request: pick the biggest city for every latitude and display it next to the latitude as you drag the slider.

finally, let's change the title to "Daylight Savings"

_[version 18]_

1. can you unfuzz the cities? eg, Los Angeles seems to span 33.7 to 34.3 degrees. we can probably assume every city has a single integer latitude, whatever is listed as official, rounded to the nearest degree. for los angeles presumably that's 34. so only show "(Los Angeles)" if the slider is at 34 degrees latitude.
2. i like the smaller font for hours/day but can it go on the same line as hours/year, wrapping if needed? and change "Wasted Daylight" to "Wasted daylight" for consistency in capitalization.
3. can you add a final line: "DST savings: 155 h 0 m" where the amount of time is calculated as wasted daylight without DST minus wasted daylight with DST. (make sure to show it as negative, with proper minus sign, if it's negative)

_[version 19]_

can we add more cities, and show up to 3, sorted by population, descending, when there are multiple cities with the same latitude? for example Portland Oregon should be 45 or 46. also can you comment the code with the source you're using for this data?

very nitpicky thing: can we use the following type of thin space between hours and minutes in strings like "3h 4m"?

also can you change things like "1.5 hours/day" to "1h 30m per day?

and add a similar parenthetical for per-day to the final DST savings line?

_[version 20]_

let's add 2 more sliders for DST start date and DST end date, defaulting to european. but also look up start dates for other locales and whenever the date matches the date for a locale, show that locale in parentheses. or, hmm, is that easier said than done, since it's not a specific date but rather things like "first sunday in october"? can you think of a way we can canonicalize these start/end dates so that it works to pick them via slider? one idea: for each locale and descriptor like "1st sunday in october", compute the average date that that descriptor describes.

i put GPT-5-Thinking on the case and it believes "first [day-of-week] of the month" averages, over the whole 400-year gregorian cycle, to the 4th of the month, regardless of the day of the week used. in retrospect maybe that one's obvious. in the long run the first whateverday of whatever month is equally likely to be the 1st through the 7th and E[U{1,...,7}] = 4.

more generally it comes up with this:
* the kth whateverday of the month falls, on average, on the 7k-3rd day of the month.
* the last whateverday of the month falls, on average, on the L-3rd day of the month, where L is the number of days in the month in question. for february, use L=28.2425 as the average over the whole 400-year cycle.

does that work for you? can you find the average DST start/end dates for various locales?

_[version 21]_

oops, did you finish? i don't see the new sliders

_[version 22]_

ah, bad design choice [having the sliders only appear when the DST box is checked]. also makes the whole page jump when you check the box. can you just gray out the sliders when DST is unchecked?

_[version 23]_

also can you make sure the locale appears (dynamically) after the DST start date when the start date matches the date for that locale? and same for DST end date. note that they're orthogonal -- totally possible to have DST start chosen so it displays "Europe" and DST end chosen so it displays "USA".

_[version 24]_

perfection. but the tiniest glitch (ONLY fix this if it makes the code cleaner): the knobs for the DST sliders don't ungray until the first time they're hovered over.

_[version 25]_

ah, yes, removing if-statements is always a win! go ahead.

_[version 26]_

much better! that was less tiny than i thought! next requests: 
1. allow latitude all the way to the poles, just to see what that does to the graph.
2. add a red swatch in front of "Wasted daylight" as a sort of legend.
3. to be less northern-hemisphere-centric, the baseline of summer solstice dawn should adapt to negative latitudes. ie, for negative latitudes summer solstice is what northerners call winter solstice.

_[version 26]_

very cool. something glitches slightly when we go inside the arctic and antarctic circles. the red line for sunset is no longer a function (doesn't pass the vertical line test) and it doesn't handle this gracefully. the daylight area is like the opposite of an hourglass with a bulge in the middle, and the red line should hug that bulge. instead it hugs the top but then when it gets to the middle it drops vertically straight down. again, let's not fix by adding complexity. but if you can spot the problem and have a clean fix, that would be nice.

_[version 27]_

your theory sounded good, but the bug persists. whatever you do, don't go into spaghetti-throwing mode.

side issue: the color of the swatch is a brighter red than the shaded area on the graph. can you make them match? and can you put a checkmark emoji in front of the final DST savings line, just so that it matches the layout of the line above?

_[version 28]_

formatting/color stuff looks great! do you want to try thinking extra hard about vertical line issue and see what you come up with? give your probability that it will work first, then we can decide whether to try it.

_[version 29]_

if it's not adding complexity, we can try using nulls like you suggest.

tinier issue i just noticed: use only one minus sign for a negative amount of time. currently i see this: "−86h 1m(-1h -14m per day)".
also i just noticed that there's no space before the open paren. and remember about math minus signs.

_[version 30]_

excellent work. the null trick solved the problem! but somehow i still don't see a space before the open paren in the DST savings line. i do see it on the previous line. are those lines different in some way?

_[version 31]_

_[version 32]_

_[version 33]_

_[version 34]_

_[version 35]_

_[version 36]_

_[version 37]_

_[version 38]_

_[version 39]_


TODO: 

revert if it makes it worse but:
if wake time is at zero and you check the DST checkbox, it should wrap to the top of the graph rather than increase the y-axis range to start at -1 instead +0. basically everything should be graphed mod 24.

give up on this before adding complexity (if you're solving it by adding complexity you're probably doing it wrong) but there's a shading bug for example when wake time is between +12 and around +15 for 45 degrees latitude: it doesn't shade the full width of the graph.

for each displayed city, can we show a sunrise emoji after it and then the time of day like "6:42am" for the time of day _without DST_ of dawn on summer solstice for that city?
then a tooltip can say "local time of dawn on the summer solstice in this city _without DST_, used as the baseline (+0:00) on the graph"
actually, let's have that change dynamically to be with/without depending on if the DST checkbox is checked. that's part of the scenario exploring the tool provides: what time would dawn be with and without DST?

can we have a tooltip explaining how we convert "first sunday in november" or whatever to a specific date by computing the average date that that works out to. you can include the actual formulas that GPT-5 came up with (and give GPT-5 credit).

for codebuff probably:
can we deal with this warning, if it matters?
cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation