# Article plan — *Are more people learning to read?*

**Status: BUILT 2026-06-21.** Lives at `src/content/questions/are-more-people-learning-to-read.md`
(kicker 10, theme "Education"). Companion to [[NORTH_STAR.md]], [[WRITING.md]], [[CHARTS.md]],
[[DATA.md]].

## The question and the verdict

**Are more people learning to read? — Hope on the threshold, despair beyond it.** Literacy has
risen from about one in eight adults in 1820 to about seven in eight today. The young are ahead
of the old, the gender gap has narrowed, and primary schooling is near universal. But literacy is
only a doorway: a quarter of adolescents never finish lower secondary school, seventy million
primary-age children are out of school, and one in five young people is not in education,
employment or training. The world has won the right to read; it has not finished the school day.

## The spine — literacy, read at three altitudes

The thesis rides on the long-run OWID literacy series and the World Bank adult/youth literacy
pair, because both run from World down to region.

- **World (OWID long-run)**: 1820 12% → 2023 87.4%.
- **World (WB adult 15+)**: 1985 75% → 2024 87.7%.
- **World (WB youth 15-24)**: 1985 83% → 2024 93.1% — the generational lead.
- **Regional adult literacy**: Europe & Central Asia 98.8%, East Asia & Pacific 96.6%, Latin America
  & Caribbean 95.0%, Middle East & North Africa 75.6%, South Asia 78.2%, Sub-Saharan Africa 68.7%.
- **Country spread**: Chad 30.6%, Mali 35.0%, Niger 35.6%, China 97.0%, Brazil 93.0%.

## The counter-melody — beyond the doorway

- **Mean years of schooling**: 1985 5.7 → 2020 8.8 years. The average adult has not yet completed
  lower secondary.
- **Enrollment ladder**: primary 102%, secondary 77%, tertiary 44% (gross rates, 2024).
- **Completion leak**: primary completion 88%, lower-secondary completion 78% (2024) — enrollment
  is not the same as finishing.
- **Out-of-school children**: 71 million primary-age children not in school (2023).
- **Government education spending**: ~4% of GDP before COVID, then dipped to ~3.6% (2023).
- **Youth NEET**: ~20% of 15-24 year-olds not in employment, education or training (2024/27
  modelled).

## The movements (data-backed)

1. **The long climb** (FIG.1, hero line) — `literacy-rate-world`. One in eight → seven in eight.
2. **The generation gap** (FIG.2, two-line) — `adult_literacy-wld` + `youth_literacy-wld`. Youth
   six points ahead of adults.
3. **Who the average hides** (FIG.3, multi-line + country bars) — `adult_literacy-*` regions +
   `literacy-by-country`. Sub-Saharan Africa under seven in ten; Europe/Central Asia near nine in
   ten.
4. **The years beyond the threshold** (FIG.4, line) — `mean-years-schooling-world`. From 5.7 to
   8.8 years.
5. **The enrollment ladder** (FIG.5, multi-line) — `primary-enrollment-wld`,
   `secondary-enrollment-wld`, `tertiary-enrollment-wld`. Primary near universal, tertiary still a
   minority.
6. **The leak** (FIG.6, multi-line) — `primary_completion-wld` +
   `lower_secondary_completion-wld`. Completion lags enrollment by a full rung.
7. **The missing children** (FIG.7, line) — `out-of-school-primary-world`. 71 million primary-age
   children not in school.
8. **The money** (FIG.8, line) — `education-expenditure-world`. ~4% of GDP, post-COVID dip.
9. **The transition** (FIG.9, line) — `youth-neet-world`. One in five young people in neither
   education, employment nor training.
10. **The verdict panel** (no chart, or reuse signals) — summarize the bifocal read.

## Data — what's new vs reused

- **New registry entries** in `education.*`: mean years of schooling, adult/youth literacy by WB
  region, primary/secondary/tertiary enrollment, primary/lower-secondary completion, government
  education expenditure, out-of-school primary, youth NEET.
- **Reused existing adapters**: World Bank WDI, OWID, ILOSTAT. No new adapters built.
- **Generated artifacts**: all derived series and the `literacy-by-country` cross-section bars.

## Gotchas this build hit

- Registry syntax: a trailing `)` typo (`}))))`) prevented TypeScript compilation; fixed to `})))`.
- OWID `mean-years-of-schooling` source column is
  `mf_youth_and_adults__15_64_years__average_years_of_education`, not a plain
  `average_years_of_schooling` column.
- `ONLY=literacy` and `ONLY=neet` in `pnpm data` are substring filters, not regex; this works for
  the new specs.

## Regenerate

```
pnpm data ONLY=literacy
pnpm data ONLY=neet
pnpm data ONLY=expenditure
pnpm verify
```
