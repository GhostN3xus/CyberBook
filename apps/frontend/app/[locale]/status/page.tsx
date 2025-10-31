import { createTranslation } from '../../i18n';
import { StatusReloadButton } from '../../../components/status/status-reload-button';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001').replace(/\/$/, '');

type HealthReport = {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database: 'up' | 'down';
  };
  system: {
    nodeVersion: string;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
  };
  metadata?: {
    commitSha?: string | null;
  };
};

async function getHealthReport(): Promise<HealthReport | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: 'no-store',
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }

    return (await response.json()) as HealthReport;
  } catch (error) {
    console.error('Failed to load health report', error);
    return null;
  }
}

function formatUptime(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const secs = Math.floor(seconds % 60);

  return `${hours}h ${minutes}m ${secs}s`;
}

function formatMemory(value: number) {
  return `${value.toFixed(2)} MB`;
}

export default async function StatusPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'status');
  const report = await getHealthReport();

  const formattedTimestamp = report
    ? new Intl.DateTimeFormat(params.locale, {
        dateStyle: 'medium',
        timeStyle: 'medium'
      }).format(new Date(report.timestamp))
    : null;

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
            <p className="max-w-3xl text-lg text-slate-300">{t('intro')}</p>
          </div>
          <StatusReloadButton label={t('labels.retry')} />
        </div>
        {formattedTimestamp && (
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {t('labels.lastUpdate')}: {formattedTimestamp}
          </p>
        )}
      </header>

      {!report ? (
        <p className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-6 text-sm text-amber-200">
          {t('errors.unreachable')}
        </p>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.overall')}</h2>
              <p className="mt-3 text-2xl font-semibold text-brand-neon">{t(`status.${report.status}`)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.version')}</h2>
              <p className="mt-3 text-2xl font-semibold text-brand-neon">{report.version}</p>
              {report.metadata?.commitSha && (
                <p className="mt-2 truncate text-xs text-slate-400">{report.metadata.commitSha}</p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.environment')}</h2>
              <p className="mt-3 text-2xl font-semibold text-brand-neon">{report.environment}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.uptime')}</h3>
              <p className="mt-3 text-lg text-slate-200">{formatUptime(report.uptime)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.checks')}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex items-center justify-between">
                  <span>Database</span>
                  <span className="rounded-full border border-brand-neon/60 px-2 py-1 text-xs text-brand-neon">
                    {report.checks.database === 'up' ? 'UP' : 'DOWN'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.system')}</h3>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Node.js</p>
                <p className="mt-1 text-lg text-slate-200">{report.system.nodeVersion}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('labels.memory')}</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-300">
                  <li>
                    {t('memory.rss')}: {formatMemory(report.system.memory.rss)}
                  </li>
                  <li>
                    {t('memory.heapTotal')}: {formatMemory(report.system.memory.heapTotal)}
                  </li>
                  <li>
                    {t('memory.heapUsed')}: {formatMemory(report.system.memory.heapUsed)}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
