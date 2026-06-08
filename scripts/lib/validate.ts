import { CanonicalSeries as CanonicalSeriesSchema, type CanonicalSeries, type IndicatorSpec, type ValidationIssue } from '../../src/lib/data/types.ts';

/* The layered validation framework (DATA.md §7). Each layer returns issues at
   pass | warn | block. A `block` stops publish; `warn`/flag route to human review. */

export function validateSeries(series: CanonicalSeries, spec: IndicatorSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const id = series.indicatorId;
  const push = (layer: string, severity: 'warn' | 'block', message: string) =>
    issues.push({ layer, severity, indicatorId: id, message });

  // 1. Schema
  const parsed = CanonicalSeriesSchema.safeParse(series);
  if (!parsed.success) {
    push('schema', 'block', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
    return issues; // can't trust anything else if the shape is wrong
  }

  // 2. Provenance completeness
  const p = series.provenance;
  for (const k of ['url', 'license', 'vintage', 'definition', 'checksum'] as const) {
    if (!p[k]) push('provenance', 'block', `missing provenance.${k}`);
  }

  // 3. Range / sanity
  for (const pt of series.points) {
    if (spec.validate.min != null && pt.value < spec.validate.min)
      push('range', 'block', `value ${pt.value} at ${pt.t} below min ${spec.validate.min}`);
    if (spec.validate.max != null && pt.value > spec.validate.max)
      push('range', 'block', `value ${pt.value} at ${pt.t} above max ${spec.validate.max}`);
    if (!Number.isFinite(pt.value)) push('range', 'block', `non-finite value at ${pt.t}`);
  }

  // 4. Continuity / anomaly (warn — a real spike is content, not an error)
  const sorted = [...series.points].sort((a, b) => a.t - b.t);
  const seenYears = new Set<number>();
  for (let i = 0; i < sorted.length; i++) {
    if (seenYears.has(sorted[i].t)) push('continuity', 'block', `duplicate year ${sorted[i].t}`);
    seenYears.add(sorted[i].t);
    if (i > 0 && spec.validate.monotonicJump != null) {
      const prev = sorted[i - 1].value, cur = sorted[i].value;
      const base = Math.max(Math.abs(prev), 1);
      if (Math.abs(cur - prev) / base > spec.validate.monotonicJump)
        push('continuity', 'warn', `large jump ${prev}→${cur} at ${sorted[i].t} (review)`);
    }
  }

  // 5. Unit consistency
  if (series.unit !== spec.unit) push('unit', 'block', `unit "${series.unit}" ≠ registry "${spec.unit}"`);

  // 7. Entity present
  if (!series.entity) push('entity', 'block', 'missing canonical entity');

  return issues;
}

export function report(issues: ValidationIssue[]): { blocked: boolean; text: string } {
  const blocks = issues.filter((i) => i.severity === 'block');
  const warns = issues.filter((i) => i.severity === 'warn');
  const lines: string[] = [];
  if (!issues.length) lines.push('  ✓ all checks passed');
  for (const i of blocks) lines.push(`  ✗ [block] ${i.indicatorId} · ${i.layer}: ${i.message}`);
  for (const i of warns) lines.push(`  ⚠ [warn]  ${i.indicatorId} · ${i.layer}: ${i.message}`);
  return { blocked: blocks.length > 0, text: lines.join('\n') };
}
