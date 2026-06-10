import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { OperationLabTask } from './operationLab3Tasks';

type FeedbackState = 'idle' | 'success' | 'error';

export function MiniBlocks({ task, feedback }: { task: OperationLabTask; feedback: FeedbackState }) {
  if (task.kind === 'estimate-sum') return <RoundingModel task={task} />;
  if (task.kind === 'borrow') return <BorrowBreakdown task={task} feedback={feedback} />;
  if (task.kind === 'remainder') return <RemainderModel task={task} />;

  return null;
}

function RemainderModel({ task }: { task: OperationLabTask }) {
  const model = getDivisionModel(task.expression);
  if (!model) return null;

  return (
    <div
      data-testid="operation-lab-3-remainder-model"
      className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/24 p-4"
    >
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Kalan modeli</p>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="grid gap-2">
          {Array.from({ length: model.fullGroups }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              data-testid="operation-lab-3-remainder-group"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/40">{groupIndex + 1}. grup</p>
                <p className="text-[11px] font-black text-white/48">{model.groupSize}'li kutu doldu</p>
              </div>
              <div className="mt-2 flex justify-center gap-1.5">
                {Array.from({ length: model.groupSize }).map((__, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="h-5 w-5 rounded-lg border border-white/14"
                    style={{ backgroundColor: `${task.color}34`, boxShadow: `0 0 12px ${task.color}22` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          data-testid="operation-lab-3-remainder-leftovers"
          className="rounded-3xl border border-dashed border-white/18 bg-black/18 p-3 text-center"
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/44">Dışarıda kalan</p>
          <div className="mt-3 flex min-h-16 min-w-28 flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            {Array.from({ length: model.remainder }).map((_, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0.82, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.06 }}
                className="h-7 w-7 rounded-xl border border-white/18"
                style={{ backgroundColor: `${task.color}44`, boxShadow: `0 0 16px ${task.color}33` }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs font-bold text-white/52">Tam gruba giremeyenleri say.</p>
        </div>
      </div>
    </div>
  );
}

function getDivisionModel(expression: string) {
  const match = expression.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return null;
  const total = Number(match[1]);
  const groupSize = Number(match[2]);
  if (!Number.isFinite(total) || !Number.isFinite(groupSize) || groupSize <= 0) return null;
  return {
    fullGroups: Math.floor(total / groupSize),
    groupSize,
    remainder: total % groupSize,
  };
}

function RoundingModel({ task }: { task: OperationLabTask }) {
  const model = getRoundingModel(task.expression);
  if (!model) return null;

  return (
    <div
      data-testid="operation-lab-3-rounding-model"
      className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/24 p-4"
    >
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Yuvarlama modeli</p>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr]">
        <RoundingCard testId="operation-lab-3-rounding-first" value={model.first} color="#22D3EE" />
        <RoundingCard testId="operation-lab-3-rounding-second" value={model.second} color={task.color} />
      </div>
    </div>
  );
}

function RoundingCard({ testId, value, color }: { testId: string; value: number; color: string }) {
  const lowerHundred = Math.floor(value / 100) * 100;
  const upperHundred = lowerHundred + 100;
  const position = Math.min(96, Math.max(4, value - lowerHundred));

  return (
    <div data-testid={testId} className="rounded-3xl border border-white/10 bg-white/[0.05] p-3">
      <p className="text-center font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/42">Yüzlük çizgisi</p>
      <div className="mt-3 rounded-3xl border border-white/10 bg-black/22 px-4 py-3">
        <div className="flex items-center justify-between text-sm font-black text-white/58">
          <span>{lowerHundred}</span>
          <span>{upperHundred}</span>
        </div>
        <div className="relative mt-3 h-3 rounded-full bg-white/12">
          <span
            className="absolute top-1/2 h-6 w-6 rounded-full border-2 border-white/80 shadow-[0_0_22px_rgba(255,255,255,0.18)]"
            style={{ left: `${position}%`, backgroundColor: color, transform: 'translate(-50%, -50%)', boxShadow: `0 0 22px ${color}55` }}
          />
        </div>
        <p className="mt-4 text-center text-3xl font-black leading-none" style={{ color }}>{value}</p>
      </div>
      <p className="mt-2 text-center text-xs font-bold text-white/52">Hangi yüzlüğe daha yakın?</p>
    </div>
  );
}

function getRoundingModel(expression: string) {
  const match = expression.match(/(\d+)\s*\+\s*(\d+)/);
  if (!match) return null;
  const first = Number(match[1]);
  const second = Number(match[2]);
  return {
    first,
    second,
  };
}

function BorrowBreakdown({ task, feedback }: { task: OperationLabTask; feedback: FeedbackState }) {
  const model = getBorrowModel(task.expression);
  if (!model) return null;

  const isSolved = feedback === 'success';
  const color = task.color;
  const afterTens = model.minuendTens - 1;
  const afterOnes = model.minuendOnes + 10;

  return (
    <div
      data-testid="operation-lab-3-borrow-breakdown"
      className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/24 p-4"
    >
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Bozma modeli</p>
      <div className="mt-3 grid gap-3">
        <PlaceValueTray
          testId="operation-lab-3-borrow-before"
          label="Önce"
          equation={`${model.minuend} = ${model.minuendTens} onluk + ${model.minuendOnes} birlik`}
          tens={model.minuendTens}
          ones={model.minuendOnes}
          color="#22D3EE"
          active={!isSolved}
        />
        <motion.div
          data-testid="operation-lab-3-borrow-action"
          animate={feedback === 'error' ? { x: [0, -5, 5, -3, 0] } : isSolved ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.05] px-3 py-3 text-center"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: `${color}22`, color }}>
            <ArrowRight className="h-5 w-5 rotate-90" />
          </div>
          <div>
            <p className="text-sm font-black leading-tight text-white">{isSolved ? 'Dönüşüm açıldı' : 'Birlikler az kaldı'}</p>
            <p className="text-xs font-bold leading-tight text-white/52">{isSolved ? 'Birlik kutusu büyüdü' : 'Onluklara bak'}</p>
          </div>
        </motion.div>
        {isSolved ? (
          <PlaceValueTray
            testId="operation-lab-3-borrow-after"
            label="Sonra"
            equation={`${afterTens} onluk + ${afterOnes} birlik`}
            tens={afterTens}
            ones={afterOnes}
            color={color}
            active
          />
        ) : (
          <BorrowQuestionTray color={color} />
        )}
      </div>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm font-black leading-snug text-white/72">
        {isSolved
          ? `Artık büyüyen birlik kutusundan ${model.subtrahendOnes} çıkarabilirsin.`
          : `${model.minuendOnes} birlikten ${model.subtrahendOnes} çıkmaz. Birlik kutusu için destek ara.`}
      </p>
    </div>
  );
}

function getBorrowModel(expression: string) {
  const match = expression.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  const minuend = Number(match[1]);
  const subtrahend = Number(match[2]);
  if (!Number.isFinite(minuend) || !Number.isFinite(subtrahend)) return null;

  return {
    minuend,
    minuendTens: Math.floor(minuend / 10),
    minuendOnes: minuend % 10,
    subtrahendOnes: subtrahend % 10,
  };
}

function BorrowQuestionTray({ color }: { color: string }) {
  return (
    <div
      data-testid="operation-lab-3-borrow-after"
      className="rounded-3xl border border-dashed border-white/16 bg-black/18 p-3 text-center"
    >
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Hamleden sonra</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {['Onluk', 'Birlik'].map((label) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">{label}</p>
            <p className="mt-2 text-3xl font-black leading-none" style={{ color }}>
              ?
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-bold text-white/52">Birlik kutusu nereden destek alır?</p>
    </div>
  );
}

function PlaceValueTray({
  testId,
  label,
  equation,
  tens,
  ones,
  color,
  active,
}: {
  testId: string;
  label: string;
  equation: string;
  tens: number;
  ones: number;
  color: string;
  active: boolean;
}) {
  return (
    <div
      data-testid={testId}
      className={`rounded-3xl border p-2.5 transition ${
        active ? 'border-white/20 bg-white/[0.08]' : 'border-white/10 bg-black/18 opacity-75'
      }`}
      style={active ? { boxShadow: `0 0 24px ${color}24` } : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/44">{label}</p>
        <p className="text-xs font-black" style={{ color }}>{equation}</p>
      </div>
      <div className="mt-2 grid gap-3 sm:grid-cols-[auto_1fr]">
        <div>
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Onluk</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {Array.from({ length: tens }).map((_, index) => (
              <span
                key={index}
                className="h-10 w-4 rounded-lg border border-white/14"
                style={{ backgroundColor: `${color}2F`, boxShadow: `0 0 12px ${color}22` }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Birlik</p>
          <div className="flex min-h-10 flex-wrap justify-center gap-1.5">
            {Array.from({ length: ones }).map((_, index) => (
              <motion.span
                key={index}
                initial={active ? { scale: 0.9, opacity: 0.72 } : false}
                animate={active ? { scale: 1, opacity: 1 } : { scale: 0.96, opacity: 0.72 }}
                transition={{ delay: Math.min(index * 0.018, 0.18) }}
                className="h-4 w-4 rounded-md border border-white/14"
                style={{ backgroundColor: `${color}36`, boxShadow: `0 0 10px ${color}24` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
