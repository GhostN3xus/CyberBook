'use client';

import { useMemo, useState } from 'react';
import type { UseCase } from '../../data/use-cases';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface Labels {
  sector: string;
  maturity: string;
  outcomes: string;
  outcomesEmpty: string;
  metadata: string;
}

interface FilterLabels {
  all: string;
  sector: string;
  maturity: string;
}

interface MaturityLabels {
  initial: string;
  intermediate: string;
  advanced: string;
}

interface UseCaseExplorerProps {
  cases: UseCase[];
  locale: 'pt' | 'en';
  labels: Labels;
  filterLabels: FilterLabels;
  maturityLabels: MaturityLabels;
  emptyMessage: string;
}

export function UseCaseExplorer({
  cases,
  locale,
  labels,
  filterLabels,
  maturityLabels,
  emptyMessage
}: UseCaseExplorerProps) {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('all');

  const sectors = useMemo(
    () => Array.from(new Set(cases.map((item) => item.sector))).sort(),
    [cases]
  );

  const maturities = useMemo(
    () => Array.from(new Set(cases.map((item) => item.maturity))).sort(),
    [cases]
  );

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const sectorMatches = selectedSector === 'all' || item.sector === selectedSector;
      const maturityMatches = selectedMaturity === 'all' || item.maturity === selectedMaturity;
      return sectorMatches && maturityMatches;
    });
  }, [cases, selectedSector, selectedMaturity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">{filterLabels.sector}</span>
          <Button
            size="sm"
            variant={selectedSector === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedSector('all')}
          >
            {filterLabels.all}
          </Button>
          {sectors.map((sector) => (
            <Button
              key={sector}
              size="sm"
              variant={selectedSector === sector ? 'default' : 'outline'}
              onClick={() => setSelectedSector(sector)}
            >
              {sector}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">{filterLabels.maturity}</span>
          <Button
            size="sm"
            variant={selectedMaturity === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedMaturity('all')}
          >
            {filterLabels.all}
          </Button>
          {maturities.map((maturity) => (
            <Button
              key={maturity}
              size="sm"
              variant={selectedMaturity === maturity ? 'default' : 'outline'}
              onClick={() => setSelectedMaturity(maturity)}
            >
              {maturityLabels[maturity as keyof MaturityLabels]}
            </Button>
          ))}
        </div>
      </div>

      {filteredCases.length === 0 ? (
        <p className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">{emptyMessage}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCases.map((item) => (
            <article key={item.slug} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <header className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-brand-neon">
                  <span className="rounded-full border border-brand-neon/60 px-3 py-1">
                    {labels.sector}: {item.sector}
                  </span>
                  <span className="rounded-full border border-brand-neon/60 px-3 py-1">
                    {labels.maturity}: {maturityLabels[item.maturity]}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100">
                  {typeof item.title === 'string' ? item.title : item.title[locale]}
                </h3>
                <p className="text-sm text-slate-300">
                  {typeof item.summary === 'string' ? item.summary : item.summary[locale]}
                </p>
              </header>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-brand-neon">{labels.outcomes}</h4>
                {item.outcomes?.length ? (
                  <ul className="space-y-2 text-sm text-slate-300">
                    {item.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-neon" aria-hidden />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">{labels.outcomesEmpty}</p>
                )}
              </section>

              {item.metadata && (
                <dl className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <dt className="font-semibold uppercase tracking-wide text-slate-500">{labels.metadata}</dt>
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <dd
                      key={key}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-slate-200"
                    >
                      <span className="uppercase text-[10px] tracking-wide text-slate-500">{key}</span>
                      <span>{String(value)}</span>
                    </dd>
                  ))}
                </dl>
              )}

              {item.tags && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {item.tags.map((tag) => (
                    <span key={tag} className={cn('rounded-full bg-slate-800 px-2 py-1 text-slate-300')}>{`#${tag}`}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
