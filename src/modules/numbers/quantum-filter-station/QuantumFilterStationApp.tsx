import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, ChevronLeft, Home, RotateCcw, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AstroBot, BotMessage, BotMessageType } from '../../../components/ui/AstroBot';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';

export type Choice = { id: string; label: string; note: string };
export type MissionKind = 'factors' | 'divisibility' | 'prime-sieve' | 'prime-tree' | 'lcm' | 'gcd';
export type Mission = {
  title: string;
  prompt: string;
  core: string;
  kind: MissionKind;
  multi: boolean;
  shuffleChoices?: boolean;
  choices: Choice[];
  correct: string[];
  atomIds: string[];
  success: string;
  hint: string;
};
export type FocusCard = {
  label: string;
  subtitle: string;
  activeKinds: MissionKind[];
};
export type NumberSelectionWorkshopConfig = {
  moduleId: string;
  title: string;
  atomLabel: string;
  introMessage: string;
  advanceMessage: string;
  completionTitle: string;
  completionMessage: string;
  atoms: string[];
  missions: Mission[];
  missionBanks?: Mission[][];
  focusCards: FocusCard[];
};

const DIVISIBILITY_ATOMS = [
  'MAT.6.1.1.1',
  'MAT.6.1.2.1',
  'MAT.6.1.2.2',
  'MAT.6.1.2.3',
  'MAT.6.1.2.4',
  'MAT.6.1.2.5',
  'MAT.6.1.2.6',
  'MAT.6.1.2.7',
];

const PRIME_ATOMS = ['MAT.6.1.3.1', 'MAT.6.1.3.2'];
const GCD_LCM_ATOMS = ['MAT.6.1.1.2', 'MAT.6.1.4.1', 'MAT.6.1.4.2'];
const LCM_ATOMS = ['MAT.6.1.1.2', 'MAT.6.1.4.1'];
const GCD_ATOMS = ['MAT.6.1.4.2'];

const FACTOR_MISSION: Mission = {
  title: '24 sayısının çarpanlarını seç',
  prompt: '24 sayısını kalansız bölen bütün sayıları seç.',
  core: '24',
  kind: 'factors',
  multi: true,
  choices: [
    { id: '1', label: '1', note: 'Her doğal sayıyı böler.' },
    { id: '2', label: '2', note: '24 çift sayıdır.' },
    { id: '3', label: '3', note: '2 + 4 = 6, 3 ile bölünür.' },
    { id: '4', label: '4', note: '24 / 4 = 6.' },
    { id: '5', label: '5', note: '24 / 5 tam sayı değildir.' },
    { id: '6', label: '6', note: '24 / 6 = 4.' },
    { id: '8', label: '8', note: '24 / 8 = 3.' },
    { id: '12', label: '12', note: '24 / 12 = 2.' },
    { id: '24', label: '24', note: 'Kendisi de çarpandır.' },
  ],
  correct: ['1', '2', '3', '4', '6', '8', '12', '24'],
  atomIds: ['MAT.6.1.1.1'],
  success: '24 sayısının çarpanları doğru seçildi.',
  hint: 'Çarpan olmak için sayı hedefi kalansız bölmeli; 24 / 5 tam sayı değildir.',
};

const DIVISIBILITY_MISSION: Mission = {
  title: "270'in bölünebildiği sayıları seç",
  prompt: 'Son rakam ve rakam toplamı ipuçlarını kullan: 270 hangi sayılara kalansız bölünür?',
  core: '270',
  kind: 'divisibility',
  multi: true,
  choices: [
    { id: '2', label: '2', note: 'Son rakam çift.' },
    { id: '3', label: '3', note: '2 + 7 + 0 = 9.' },
    { id: '5', label: '5', note: 'Son rakam 0.' },
    { id: '6', label: '6', note: 'Hem 2 hem 3 açık.' },
    { id: '9', label: '9', note: 'Rakam toplamı 9.' },
    { id: '10', label: '10', note: 'Son rakam 0.' },
  ],
  correct: ['2', '3', '5', '6', '9', '10'],
  atomIds: ['MAT.6.1.2.1', 'MAT.6.1.2.2', 'MAT.6.1.2.3', 'MAT.6.1.2.4', 'MAT.6.1.2.5', 'MAT.6.1.2.6', 'MAT.6.1.2.7'],
  success: "270'in bölünebildiği sayılar doğru seçildi.",
  hint: '270 çift, 0 ile biter ve rakam toplamı 9 olur. 6 için hem 2 hem 3 kuralı birlikte çalışır.',
};

const FACTOR_MISSIONS: Mission[] = [
  FACTOR_MISSION,
  {
    title: '18 sayısının çarpanlarını seç',
    prompt: '18 sayısını kalansız bölen bütün sayıları seç.',
    core: '18',
    kind: 'factors',
    multi: true,
    choices: [
      { id: '1', label: '1', note: 'Her doğal sayıyı böler.' },
      { id: '2', label: '2', note: '18 çift sayıdır.' },
      { id: '3', label: '3', note: '18 / 3 = 6.' },
      { id: '4', label: '4', note: '18 / 4 tam sayı değildir.' },
      { id: '5', label: '5', note: '18 / 5 tam sayı değildir.' },
      { id: '6', label: '6', note: '18 / 6 = 3.' },
      { id: '9', label: '9', note: '18 / 9 = 2.' },
      { id: '18', label: '18', note: 'Kendisi de çarpandır.' },
    ],
    correct: ['1', '2', '3', '6', '9', '18'],
    atomIds: ['MAT.6.1.1.1'],
    success: '18 sayısının çarpanları doğru seçildi.',
    hint: 'Çarpan olmak için sayı hedefi kalansız bölmeli; 18 / 4 ve 18 / 5 tam sayı değildir.',
  },
  {
    title: '30 sayısının çarpanlarını seç',
    prompt: '30 sayısını kalansız bölen bütün sayıları seç.',
    core: '30',
    kind: 'factors',
    multi: true,
    choices: [
      { id: '1', label: '1', note: 'Her doğal sayıyı böler.' },
      { id: '2', label: '2', note: '30 çift sayıdır.' },
      { id: '3', label: '3', note: '30 / 3 = 10.' },
      { id: '5', label: '5', note: '30 / 5 = 6.' },
      { id: '6', label: '6', note: '30 / 6 = 5.' },
      { id: '9', label: '9', note: '30 / 9 tam sayı değildir.' },
      { id: '10', label: '10', note: '30 / 10 = 3.' },
      { id: '15', label: '15', note: '30 / 15 = 2.' },
      { id: '30', label: '30', note: 'Kendisi de çarpandır.' },
    ],
    correct: ['1', '2', '3', '5', '6', '10', '15', '30'],
    atomIds: ['MAT.6.1.1.1'],
    success: '30 sayısının çarpanları doğru seçildi.',
    hint: '30 sayısını kalansız bölenleri seçmelisin; 9 bu sayı için çarpan değildir.',
  },
  {
    title: '36 sayısının çarpanlarını seç',
    prompt: '36 sayısını kalansız bölen bütün sayıları seç.',
    core: '36',
    kind: 'factors',
    multi: true,
    choices: [
      { id: '1', label: '1', note: 'Her doğal sayıyı böler.' },
      { id: '2', label: '2', note: '36 çift sayıdır.' },
      { id: '3', label: '3', note: '36 / 3 = 12.' },
      { id: '4', label: '4', note: '36 / 4 = 9.' },
      { id: '5', label: '5', note: '36 / 5 tam sayı değildir.' },
      { id: '6', label: '6', note: '36 / 6 = 6.' },
      { id: '9', label: '9', note: '36 / 9 = 4.' },
      { id: '12', label: '12', note: '36 / 12 = 3.' },
      { id: '18', label: '18', note: '36 / 18 = 2.' },
      { id: '36', label: '36', note: 'Kendisi de çarpandır.' },
    ],
    correct: ['1', '2', '3', '4', '6', '9', '12', '18', '36'],
    atomIds: ['MAT.6.1.1.1'],
    success: '36 sayısının çarpanları doğru seçildi.',
    hint: '36 sayısını kalansız bölenleri seçmelisin; 5 bu sayı için çarpan değildir.',
  },
];

const DIVISIBILITY_MISSIONS: Mission[] = [
  DIVISIBILITY_MISSION,
  {
    title: "315'in bölünebildiği sayıları seç",
    prompt: "Son rakam ve rakam toplamı ipuçlarını kullan: 315 hangi sayılara kalansız bölünür?",
    core: '315',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift değil.' },
      { id: '3', label: '3', note: '3 + 1 + 5 = 9.' },
      { id: '5', label: '5', note: 'Son rakam 5.' },
      { id: '6', label: '6', note: '2 kuralı çalışmadığı için olmaz.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['3', '5', '9'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "315'in bölünebildiği sayılar doğru seçildi.",
    hint: '315 için rakam toplamı 9 ve son rakam 5 olur. Çift olmadığı için 2 ve 6 çalışmaz; son rakam 0 olmadığı için 10 çalışmaz.',
  },
  {
    title: "144'ün bölünebildiği sayıları seç",
    prompt: "Son rakam ve rakam toplamı ipuçlarını kullan: 144 hangi sayılara kalansız bölünür?",
    core: '144',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '1 + 4 + 4 = 9.' },
      { id: '5', label: '5', note: 'Son rakam 0 veya 5 değil.' },
      { id: '6', label: '6', note: 'Hem 2 hem 3 açık.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['2', '3', '6', '9'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "144'ün bölünebildiği sayılar doğru seçildi.",
    hint: '144 çift ve rakam toplamı 9 olur. Bu yüzden 2, 3, 6 ve 9 çalışır; 5 ve 10 için son rakam uygun değildir.',
  },
  {
    title: "420'nin bölünebildiği sayıları seç",
    prompt: "Son rakam ve rakam toplamı ipuçlarını kullan: 420 hangi sayılara kalansız bölünür?",
    core: '420',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '4 + 2 + 0 = 6.' },
      { id: '5', label: '5', note: 'Son rakam 0.' },
      { id: '6', label: '6', note: 'Hem 2 hem 3 açık.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9 değil.' },
      { id: '10', label: '10', note: 'Son rakam 0.' },
    ],
    correct: ['2', '3', '5', '6', '10'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "420'nin bölünebildiği sayılar doğru seçildi.",
    hint: '420 çift, 0 ile biter ve rakam toplamı 6 olur. 9 için rakam toplamı 9 veya 9 katı olmalı.',
  },
];

const ENDING_RULE_MISSIONS: Mission[] = [
  {
    title: "250'nin bölünebildiği sayıları seç",
    prompt: "Son rakama bak: 250 hangi sayılara kalansız bölünür?",
    core: '250',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '2 + 5 + 0 = 7.' },
      { id: '5', label: '5', note: 'Son rakam 0.' },
      { id: '6', label: '6', note: '3 kuralı çalışmadığı için olmaz.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9 değil.' },
      { id: '10', label: '10', note: 'Son rakam 0.' },
    ],
    correct: ['2', '5', '10'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "250'nin son rakam kuralları doğru yakalandı.",
    hint: '250 sonu 0 olan çift bir sayıdır. Bu yüzden 2, 5 ve 10 çalışır; rakam toplamı 7 olduğu için 3, 6 ve 9 çalışmaz.',
  },
  {
    title: "125'in bölünebildiği sayıları seç",
    prompt: "Son rakama bak: 125 hangi sayılara kalansız bölünür?",
    core: '125',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift değil.' },
      { id: '3', label: '3', note: '1 + 2 + 5 = 8.' },
      { id: '5', label: '5', note: 'Son rakam 5.' },
      { id: '6', label: '6', note: 'Hem 2 hem 3 gerekirdi.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9 değil.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['5'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "125'in son rakam kuralı doğru seçildi.",
    hint: '125 sonu 5 ile biter; bu yüzden 5 çalışır. 10 için son rakam 0 olmalı, 2 için çift olmalı.',
  },
  {
    title: "80'in bölünebildiği sayıları seç",
    prompt: "Son rakama bak: 80 hangi sayılara kalansız bölünür?",
    core: '80',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '8 + 0 = 8.' },
      { id: '5', label: '5', note: 'Son rakam 0.' },
      { id: '6', label: '6', note: '3 kuralı çalışmadığı için olmaz.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9 değil.' },
      { id: '10', label: '10', note: 'Son rakam 0.' },
    ],
    correct: ['2', '5', '10'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "80'in son rakam kuralları doğru yakalandı.",
    hint: '80 sonu 0 olan çift bir sayıdır. Bu yüzden 2, 5 ve 10 çalışır; rakam toplamı 8 olduğu için 3 ve 9 çalışmaz.',
  },
];

const DIGIT_SUM_RULE_MISSIONS: Mission[] = [
  {
    title: "333'ün bölünebildiği sayıları seç",
    prompt: "Rakam toplamına bak: 333 hangi sayılara kalansız bölünür?",
    core: '333',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift değil.' },
      { id: '3', label: '3', note: '3 + 3 + 3 = 9.' },
      { id: '5', label: '5', note: 'Son rakam 0 veya 5 değil.' },
      { id: '6', label: '6', note: '2 kuralı çalışmadığı için olmaz.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['3', '9'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "333'ün rakam toplamı kuralları doğru seçildi.",
    hint: '333 için rakam toplamı 9 olur. Bu yüzden 3 ve 9 çalışır; 6 için ayrıca çift olmalıydı.',
  },
  {
    title: "306'nın bölünebildiği sayıları seç",
    prompt: "Rakam toplamına bak: 306 hangi sayılara kalansız bölünür?",
    core: '306',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '3 + 0 + 6 = 9.' },
      { id: '5', label: '5', note: 'Son rakam 0 veya 5 değil.' },
      { id: '6', label: '6', note: 'Hem 2 hem 3 açık.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['2', '3', '6', '9'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "306'nın rakam toplamı ve 6 kuralı doğru seçildi.",
    hint: '306 çift ve rakam toplamı 9 olur. Bu yüzden 2, 3, 6 ve 9 çalışır.',
  },
  {
    title: "729'un bölünebildiği sayıları seç",
    prompt: "Rakam toplamına bak: 729 hangi sayılara kalansız bölünür?",
    core: '729',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift değil.' },
      { id: '3', label: '3', note: '7 + 2 + 9 = 18.' },
      { id: '5', label: '5', note: 'Son rakam 0 veya 5 değil.' },
      { id: '6', label: '6', note: '2 kuralı çalışmadığı için olmaz.' },
      { id: '9', label: '9', note: 'Rakam toplamı 18.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['3', '9'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "729'un rakam toplamı kuralları doğru seçildi.",
    hint: '729 için rakam toplamı 18 olur; 18 hem 3 hem 9 katıdır. Çift olmadığı için 2 ve 6 çalışmaz.',
  },
];

const MIXED_DIVISIBILITY_MISSIONS: Mission[] = [
  DIVISIBILITY_MISSION,
  ...DIVISIBILITY_MISSIONS.filter((mission) => mission.core !== DIVISIBILITY_MISSION.core),
  {
    title: "198'in bölünebildiği sayıları seç",
    prompt: "Kuralları birlikte kullan: 198 hangi sayılara kalansız bölünür?",
    core: '198',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '1 + 9 + 8 = 18.' },
      { id: '5', label: '5', note: 'Son rakam 0 veya 5 değil.' },
      { id: '6', label: '6', note: 'Hem 2 hem 3 açık.' },
      { id: '9', label: '9', note: 'Rakam toplamı 18.' },
      { id: '10', label: '10', note: 'Son rakam 0 değil.' },
    ],
    correct: ['2', '3', '6', '9'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "198'in karışık bölünebilme kuralları doğru seçildi.",
    hint: '198 çift ve rakam toplamı 18 olur. Bu yüzden 2, 3, 6 ve 9 çalışır; 5 ve 10 için son rakam uygun değildir.',
  },
  {
    title: "360'ın bölünebildiği sayıları seç",
    prompt: "Kuralları birlikte kullan: 360 hangi sayılara kalansız bölünür?",
    core: '360',
    kind: 'divisibility',
    multi: true,
    choices: [
      { id: '2', label: '2', note: 'Son rakam çift.' },
      { id: '3', label: '3', note: '3 + 6 + 0 = 9.' },
      { id: '5', label: '5', note: 'Son rakam 0.' },
      { id: '6', label: '6', note: 'Hem 2 hem 3 açık.' },
      { id: '9', label: '9', note: 'Rakam toplamı 9.' },
      { id: '10', label: '10', note: 'Son rakam 0.' },
    ],
    correct: ['2', '3', '5', '6', '9', '10'],
    atomIds: DIVISIBILITY_MISSION.atomIds,
    success: "360'ın karışık bölünebilme kuralları doğru seçildi.",
    hint: '360 çift, 0 ile biter ve rakam toplamı 9 olur. Bu yüzden listedeki tüm kurallar çalışır.',
  },
];

const PRIME_SIEVE_MISSION: Mission = {
  title: '1-10 arasındaki asal sayıları seç',
  prompt: 'Yalnız 1 ve kendisine bölünen sayıları seç.',
  core: '1-10',
  kind: 'prime-sieve',
  multi: true,
  choices: [
    { id: '1', label: '1', note: 'Asal değildir.' },
    { id: '2', label: '2', note: 'Tek çift asal.' },
    { id: '3', label: '3', note: 'Yalnız 1 ve 3 böler.' },
    { id: '4', label: '4', note: '2 ile bölünür.' },
    { id: '5', label: '5', note: 'Yalnız 1 ve 5 böler.' },
    { id: '7', label: '7', note: 'Yalnız 1 ve 7 böler.' },
    { id: '9', label: '9', note: '3 ile bölünür.' },
  ],
  correct: ['2', '3', '5', '7'],
  atomIds: ['MAT.6.1.3.1'],
  success: 'Asal sayılar doğru ayrıldı: 2, 3, 5 ve 7.',
  hint: 'Asal sayı yalnız 1 ve kendisine bölünür; 1 asal değildir, 4 ve 9 başka sayılara da bölünür.',
};

const PRIME_BASIC_SIEVE_MISSIONS: Mission[] = [
  PRIME_SIEVE_MISSION,
  {
    title: '1-12 arasındaki asal sayıları seç',
    prompt: '1 asal değildir; yalnız iki böleni olan sayıları seç.',
    core: '1-12',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '1', label: '1', note: 'Tek böleni vardır, asal değildir.' },
      { id: '2', label: '2', note: 'Yalnız 1 ve 2 böler.' },
      { id: '3', label: '3', note: 'Yalnız 1 ve 3 böler.' },
      { id: '5', label: '5', note: 'Yalnız 1 ve 5 böler.' },
      { id: '7', label: '7', note: 'Yalnız 1 ve 7 böler.' },
      { id: '9', label: '9', note: '3 x 3 olur.' },
      { id: '11', label: '11', note: 'Yalnız 1 ve 11 böler.' },
      { id: '12', label: '12', note: '2, 3, 4 ve 6 ile bölünür.' },
    ],
    correct: ['2', '3', '5', '7', '11'],
    atomIds: ['MAT.6.1.3.1'],
    success: '1-12 aralığındaki asal sayıları doğru ayırdın.',
    hint: 'Asal sayı tam iki pozitif bölen ister: 1 ve kendisi. 1 asal değildir.',
  },
  {
    title: '1-15 arasındaki asal sayıları seç',
    prompt: 'Bileşik sayıları ele; yalnız 1 ve kendisine bölünenleri seç.',
    core: '1-15',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '1', label: '1', note: 'Asal değildir.' },
      { id: '2', label: '2', note: 'Yalnız 1 ve 2 böler.' },
      { id: '3', label: '3', note: 'Yalnız 1 ve 3 böler.' },
      { id: '4', label: '4', note: '2 x 2 olur.' },
      { id: '5', label: '5', note: 'Yalnız 1 ve 5 böler.' },
      { id: '7', label: '7', note: 'Yalnız 1 ve 7 böler.' },
      { id: '11', label: '11', note: 'Yalnız 1 ve 11 böler.' },
      { id: '13', label: '13', note: 'Yalnız 1 ve 13 böler.' },
      { id: '15', label: '15', note: '3 x 5 olur.' },
    ],
    correct: ['2', '3', '5', '7', '11', '13'],
    atomIds: ['MAT.6.1.3.1'],
    success: '1-15 aralığında asal sayıları doğru süzdün.',
    hint: '4 ve 15 gibi başka çarpanlara ayrılan sayılar asal değildir.',
  },
  {
    title: '1-18 arasındaki asal sayıları seç',
    prompt: '1 asal değildir; çift ve bileşik sayıları ayır.',
    core: '1-18',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '1', label: '1', note: 'Asal değildir.' },
      { id: '2', label: '2', note: 'Yalnız 1 ve 2 böler.' },
      { id: '3', label: '3', note: 'Yalnız 1 ve 3 böler.' },
      { id: '5', label: '5', note: 'Yalnız 1 ve 5 böler.' },
      { id: '7', label: '7', note: 'Yalnız 1 ve 7 böler.' },
      { id: '11', label: '11', note: 'Yalnız 1 ve 11 böler.' },
      { id: '13', label: '13', note: 'Yalnız 1 ve 13 böler.' },
      { id: '16', label: '16', note: '4 x 4 olur.' },
      { id: '17', label: '17', note: 'Yalnız 1 ve 17 böler.' },
      { id: '18', label: '18', note: '2 x 9 olur.' },
    ],
    correct: ['2', '3', '5', '7', '11', '13', '17'],
    atomIds: ['MAT.6.1.3.1'],
    success: '1-18 aralığındaki asal sayıları doğru ayırdın.',
    hint: '16 ve 18 bileşik sayıdır; asal sayı yalnız iki pozitif bölen taşır.',
  },
];

const PRIME_WIDE_SIEVE_MISSIONS: Mission[] = [
  {
    title: '11-20 arasındaki asal sayıları seç',
    prompt: 'Çiftleri ve 3 ya da 5 ile bölünenleri ele; kalan asal adayları seç.',
    core: '11-20',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '11', label: '11', note: 'Yalnız 1 ve 11 böler.' },
      { id: '12', label: '12', note: 'Çifttir.' },
      { id: '13', label: '13', note: 'Yalnız 1 ve 13 böler.' },
      { id: '15', label: '15', note: '3 ve 5 ile bölünür.' },
      { id: '17', label: '17', note: 'Yalnız 1 ve 17 böler.' },
      { id: '18', label: '18', note: '2 ve 3 ile bölünür.' },
      { id: '19', label: '19', note: 'Yalnız 1 ve 19 böler.' },
      { id: '20', label: '20', note: '2, 4, 5 ve 10 ile bölünür.' },
    ],
    correct: ['11', '13', '17', '19'],
    atomIds: ['MAT.6.1.3.1'],
    success: '11-20 aralığındaki asal adayları doğru süzdün.',
    hint: '11, 13, 17 ve 19 yalnız 1 ve kendisine bölünür; diğerleri başka bölenlere de sahiptir.',
  },
  {
    title: '21-30 arasındaki asal sayıları seç',
    prompt: 'Kalbur gibi düşün: 2, 3 ve 5 ile elenenleri çıkar.',
    core: '21-30',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '21', label: '21', note: '3 x 7 olur.' },
      { id: '22', label: '22', note: '2 x 11 olur.' },
      { id: '23', label: '23', note: 'Yalnız 1 ve 23 böler.' },
      { id: '24', label: '24', note: 'Çifttir.' },
      { id: '25', label: '25', note: '5 x 5 olur.' },
      { id: '27', label: '27', note: '3 x 9 olur.' },
      { id: '29', label: '29', note: 'Yalnız 1 ve 29 böler.' },
      { id: '30', label: '30', note: '2, 3 ve 5 ile bölünür.' },
    ],
    correct: ['23', '29'],
    atomIds: ['MAT.6.1.3.1'],
    success: '21-30 aralığında yalnız 23 ve 29 asal kaldı.',
    hint: '21, 22, 24, 25, 27 ve 30 başka çarpanlara ayrılır; 23 ve 29 asal kalır.',
  },
  {
    title: '31-40 arasındaki asal sayıları seç',
    prompt: '30’dan sonra da kalbur çalışır: bileşik sayıları ele.',
    core: '31-40',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '31', label: '31', note: 'Yalnız 1 ve 31 böler.' },
      { id: '32', label: '32', note: 'Çifttir.' },
      { id: '33', label: '33', note: '3 x 11 olur.' },
      { id: '35', label: '35', note: '5 x 7 olur.' },
      { id: '37', label: '37', note: 'Yalnız 1 ve 37 böler.' },
      { id: '39', label: '39', note: '3 x 13 olur.' },
      { id: '40', label: '40', note: '2, 4, 5, 8 ve 10 ile bölünür.' },
    ],
    correct: ['31', '37'],
    atomIds: ['MAT.6.1.3.1'],
    success: '31-40 aralığında 31 ve 37 asal kaldı.',
    hint: '33, 35 ve 39 başka çarpanlara ayrılır; 31 ve 37 asal kalır.',
  },
  {
    title: '41-50 arasındaki asal sayıları seç',
    prompt: '100’e yaklaşırken kalbur kuralını sürdür; bileşik sayıları ele.',
    core: '41-50',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '41', label: '41', note: 'Yalnız 1 ve 41 böler.' },
      { id: '42', label: '42', note: '2, 3, 6 ve 7 ile bölünür.' },
      { id: '43', label: '43', note: 'Yalnız 1 ve 43 böler.' },
      { id: '45', label: '45', note: '5 ve 9 ile bölünür.' },
      { id: '47', label: '47', note: 'Yalnız 1 ve 47 böler.' },
      { id: '49', label: '49', note: '7 x 7 olur.' },
      { id: '50', label: '50', note: '2, 5, 10 ve 25 ile bölünür.' },
    ],
    correct: ['41', '43', '47'],
    atomIds: ['MAT.6.1.3.1'],
    success: '41-50 aralığındaki asal sayıları doğru buldun.',
    hint: '41, 43 ve 47 asal; 49 ise 7 x 7 olduğu için asal değildir.',
  },
  {
    title: '51-60 arasındaki asal sayıları seç',
    prompt: '3 ve 5 ile bölünenleri çıkar; kalan asal adayları seç.',
    core: '51-60',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '51', label: '51', note: '3 x 17 olur.' },
      { id: '52', label: '52', note: 'Çifttir.' },
      { id: '53', label: '53', note: 'Yalnız 1 ve 53 böler.' },
      { id: '55', label: '55', note: '5 x 11 olur.' },
      { id: '57', label: '57', note: '3 x 19 olur.' },
      { id: '58', label: '58', note: '2 x 29 olur.' },
      { id: '59', label: '59', note: 'Yalnız 1 ve 59 böler.' },
      { id: '60', label: '60', note: '2, 3, 4, 5 ve 6 ile bölünür.' },
    ],
    correct: ['53', '59'],
    atomIds: ['MAT.6.1.3.1'],
    success: '51-60 aralığında 53 ve 59 asal kaldı.',
    hint: '51, 55 ve 57 bileşik; 53 ve 59 yalnız 1 ve kendisine bölünür.',
  },
  {
    title: '71-80 arasındaki asal sayıları seç',
    prompt: 'Son onlukta kalburu sürdür; sadece asal kalanları seç.',
    core: '71-80',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '71', label: '71', note: 'Yalnız 1 ve 71 böler.' },
      { id: '72', label: '72', note: 'Çifttir ve 3 ile bölünür.' },
      { id: '73', label: '73', note: 'Yalnız 1 ve 73 böler.' },
      { id: '75', label: '75', note: '3 x 25 olur.' },
      { id: '77', label: '77', note: '7 x 11 olur.' },
      { id: '78', label: '78', note: '2 x 39 olur.' },
      { id: '79', label: '79', note: 'Yalnız 1 ve 79 böler.' },
      { id: '80', label: '80', note: 'Çifttir.' },
    ],
    correct: ['71', '73', '79'],
    atomIds: ['MAT.6.1.3.1'],
    success: '71-80 aralığında 71, 73 ve 79 asal kaldı.',
    hint: '77 = 7 x 11 olduğu için asal değildir; 71, 73 ve 79 asal kalır.',
  },
  {
    title: '89-100 arasındaki asal sayıları seç',
    prompt: '100’e kadar kalburun son adımını uygula.',
    core: '89-100',
    kind: 'prime-sieve',
    multi: true,
    choices: [
      { id: '89', label: '89', note: 'Yalnız 1 ve 89 böler.' },
      { id: '90', label: '90', note: '2, 3, 5 ve 10 ile bölünür.' },
      { id: '91', label: '91', note: '7 x 13 olur.' },
      { id: '93', label: '93', note: '3 x 31 olur.' },
      { id: '95', label: '95', note: '5 x 19 olur.' },
      { id: '97', label: '97', note: 'Yalnız 1 ve 97 böler.' },
      { id: '99', label: '99', note: '9 x 11 olur.' },
      { id: '100', label: '100', note: 'Çok sayıda böleni vardır.' },
    ],
    correct: ['89', '97'],
    atomIds: ['MAT.6.1.3.1'],
    success: '89-100 aralığında 89 ve 97 asal kaldı.',
    hint: '91, 93, 95 ve 99 bileşik sayılardır; 89 ve 97 asal kalır.',
  },
];

const PRIME_TREE_MISSION: Mission = {
  title: "84'ün asal çarpanlarını seç",
  prompt: '84 sayısını en küçük asal çarpanlarına kadar ayıran zinciri seç.',
  core: '84',
  kind: 'prime-tree',
  multi: false,
  shuffleChoices: true,
  choices: [
    { id: '2-2-3-7', label: '2 x 2 x 3 x 7', note: '84 tam olarak bu asal parçalarla kurulur.' },
    { id: '2-3-14', label: '2 x 3 x 14', note: '14 asal değildir, parçalanmalı.' },
    { id: '4-3-7', label: '4 x 3 x 7', note: '4 asal değildir.' },
  ],
  correct: ['2-2-3-7'],
  atomIds: ['MAT.6.1.3.2'],
  success: '84 asal çarpan ağacı 2 x 2 x 3 x 7 olarak tamamlandı.',
  hint: 'Çözüm en küçük asal parçalara kadar inmeli; 4 ve 14 asal değildir.',
};

const PRIME_TREE_MISSIONS: Mission[] = [
  PRIME_TREE_MISSION,
  {
    title: "60'ın asal çarpanlarını seç",
    prompt: '60 sayısını yalnız asal çarpanlar kalana kadar parçala.',
    core: '60',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-2-3-5', label: '2 x 2 x 3 x 5', note: '60 tam olarak bu asal parçalarla kurulur.' },
      { id: '2-3-10', label: '2 x 3 x 10', note: '10 asal değildir, 2 x 5 olmalı.' },
      { id: '4-3-5', label: '4 x 3 x 5', note: '4 asal değildir.' },
    ],
    correct: ['2-2-3-5'],
    atomIds: ['MAT.6.1.3.2'],
    success: '60 asal çarpanlara 2 x 2 x 3 x 5 olarak ayrıldı.',
    hint: 'Asal çarpan zincirinde 4 ya da 10 gibi parçalanabilen sayı kalmamalı.',
  },
  {
    title: "72'nin asal çarpanlarını seç",
    prompt: '72 sayısını en küçük asal parçalara kadar indir.',
    core: '72',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-2-2-3-3', label: '2 x 2 x 2 x 3 x 3', note: '72 tam olarak bu asal parçalarla kurulur.' },
      { id: '2-3-12', label: '2 x 3 x 12', note: '12 asal değildir.' },
      { id: '8-9', label: '8 x 9', note: '8 ve 9 asal değildir.' },
    ],
    correct: ['2-2-2-3-3'],
    atomIds: ['MAT.6.1.3.2'],
    success: '72 asal çarpanlara 2 x 2 x 2 x 3 x 3 olarak ayrıldı.',
    hint: '8, 9 ve 12 gibi bileşik sayılar zincirde kalırsa işlem tamamlanmaz.',
  },
  {
    title: "90'ın asal çarpanlarını seç",
    prompt: '90 sayısını yalnız asal sayılardan oluşan çarpıma dönüştür.',
    core: '90',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-3-3-5', label: '2 x 3 x 3 x 5', note: '90 tam olarak bu asal parçalarla kurulur.' },
      { id: '2-5-9', label: '2 x 5 x 9', note: '9 asal değildir, 3 x 3 olmalı.' },
      { id: '6-15', label: '6 x 15', note: '6 ve 15 asal değildir.' },
    ],
    correct: ['2-3-3-5'],
    atomIds: ['MAT.6.1.3.2'],
    success: '90 asal çarpanlara 2 x 3 x 3 x 5 olarak ayrıldı.',
    hint: '9, 6 ve 15 gibi bileşik parçalar asal çarpan zincirinde kalamaz.',
  },
  {
    title: "105'in asal çarpanlarını seç",
    prompt: '105 sayısını en küçük asal çarpanlarına ayır.',
    core: '105',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '3-5-7', label: '3 x 5 x 7', note: '105 tam olarak bu asal parçalarla kurulur.' },
      { id: '3-35', label: '3 x 35', note: '35 asal değildir, 5 x 7 olmalı.' },
      { id: '5-21', label: '5 x 21', note: '21 asal değildir, 3 x 7 olmalı.' },
    ],
    correct: ['3-5-7'],
    atomIds: ['MAT.6.1.3.2'],
    success: '105 asal çarpanlara 3 x 5 x 7 olarak ayrıldı.',
    hint: '35 ve 21 bileşik sayıdır; zincirde yalnız asal parçalar kalmalı.',
  },
  {
    title: "36'nın asal çarpanlarını seç",
    prompt: '36 sayısını yalnız asal çarpanlar kalana kadar parçala.',
    core: '36',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-2-3-3', label: '2 x 2 x 3 x 3', note: '36 tam olarak bu asal parçalarla kurulur.' },
      { id: '4-9', label: '4 x 9', note: '4 ve 9 asal değildir.' },
      { id: '2-18', label: '2 x 18', note: '18 asal değildir.' },
    ],
    correct: ['2-2-3-3'],
    atomIds: ['MAT.6.1.3.2'],
    success: '36 asal çarpanlara 2 x 2 x 3 x 3 olarak ayrıldı.',
    hint: '4, 9 ve 18 bileşik parçalar olduğu için zincirde kalamaz.',
  },
  {
    title: "45'in asal çarpanlarını seç",
    prompt: '45 sayısını en küçük asal parçalara indir.',
    core: '45',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '3-3-5', label: '3 x 3 x 5', note: '45 tam olarak bu asal parçalarla kurulur.' },
      { id: '5-9', label: '5 x 9', note: '9 asal değildir.' },
      { id: '3-15', label: '3 x 15', note: '15 asal değildir.' },
    ],
    correct: ['3-3-5'],
    atomIds: ['MAT.6.1.3.2'],
    success: '45 asal çarpanlara 3 x 3 x 5 olarak ayrıldı.',
    hint: '9 ve 15 bileşik sayıdır; en küçük asal parçalara ayrılmalı.',
  },
  {
    title: "56'nın asal çarpanlarını seç",
    prompt: '56 sayısını yalnız asal sayıların çarpımı olarak yaz.',
    core: '56',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-2-2-7', label: '2 x 2 x 2 x 7', note: '56 tam olarak bu asal parçalarla kurulur.' },
      { id: '7-8', label: '7 x 8', note: '8 asal değildir.' },
      { id: '4-14', label: '4 x 14', note: '4 ve 14 asal değildir.' },
    ],
    correct: ['2-2-2-7'],
    atomIds: ['MAT.6.1.3.2'],
    success: '56 asal çarpanlara 2 x 2 x 2 x 7 olarak ayrıldı.',
    hint: '8, 4 ve 14 bileşik parçalar olduğu için devam parçalanmalı.',
  },
  {
    title: "96'nın asal çarpanlarını seç",
    prompt: '96 sayısını en küçük asal çarpanlarına kadar ayır.',
    core: '96',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-2-2-2-2-3', label: '2 x 2 x 2 x 2 x 2 x 3', note: '96 tam olarak bu asal parçalarla kurulur.' },
      { id: '3-32', label: '3 x 32', note: '32 asal değildir.' },
      { id: '12-8', label: '12 x 8', note: '12 ve 8 asal değildir.' },
    ],
    correct: ['2-2-2-2-2-3'],
    atomIds: ['MAT.6.1.3.2'],
    success: '96 asal çarpanlara 2 x 2 x 2 x 2 x 2 x 3 olarak ayrıldı.',
    hint: '32, 12 ve 8 bileşik sayılardır; zincirde yalnız asal sayılar kalmalı.',
  },
  {
    title: "98'in asal çarpanlarını seç",
    prompt: '98 sayısını asal parçalara ayır.',
    core: '98',
    kind: 'prime-tree',
    multi: false,
    shuffleChoices: true,
    choices: [
      { id: '2-7-7', label: '2 x 7 x 7', note: '98 tam olarak bu asal parçalarla kurulur.' },
      { id: '2-49', label: '2 x 49', note: '49 asal değildir, 7 x 7 olmalı.' },
      { id: '14-7', label: '14 x 7', note: '14 asal değildir.' },
    ],
    correct: ['2-7-7'],
    atomIds: ['MAT.6.1.3.2'],
    success: '98 asal çarpanlara 2 x 7 x 7 olarak ayrıldı.',
    hint: '49 ve 14 bileşik parçalar olduğu için asal çarpan zinciri tamamlanmaz.',
  },
];

const LCM_MISSION: Mission = {
  title: 'Zillerin birlikte çalacağı dakikayı bul',
  prompt: '12 ve 18 dakikalık iki alarm ilk kez kaçıncı dakikada birlikte çalar?',
  core: '12 & 18',
  kind: 'lcm',
  multi: false,
  shuffleChoices: true,
  choices: [
    { id: '6', label: '6 dakika', note: 'Bu ortak bölen, ortak kat değil.' },
    { id: '30', label: '30 dakika', note: 'İki ritmin ortak katı değil.' },
    { id: '36', label: '36 dakika', note: '12 ve 18 için en küçük ortak kat.' },
  ],
  correct: ['36'],
  atomIds: ['MAT.6.1.1.2', 'MAT.6.1.4.1'],
  success: "EKOK 36'dır; iki zil 36. dakikada birlikte çalar.",
  hint: 'Birlikte çalma sorusu ortak kat ister; 12 ve 18 için ilk ortak kat 36 olur.',
};

const LCM_MISSION_BANKS: Mission[][] = [
  [
    {
      title: 'İki zilin ilk buluşma dakikasını seç',
      prompt: '4 dakikada ve 6 dakikada bir çalan iki zil ilk kez kaçıncı dakikada birlikte çalar?',
      core: '4 & 6',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '2', label: '2 dakika', note: 'Bu ortak bölen; birlikte çalma zamanı değil.' },
        { id: '10', label: '10 dakika', note: '4 ve 6 için ortak kat değildir.' },
        { id: '12', label: '12 dakika', note: '4 ve 6 sayılarının ilk ortak katıdır.' },
      ],
      correct: ['12'],
      atomIds: LCM_ATOMS,
      success: "EKOK 12'dir; iki zil 12. dakikada birlikte çalar.",
      hint: 'Birlikte tekrar eden olaylarda katlar aranır; ilk ortak kat EKOK olur.',
    },
    {
      title: 'Robot sinyallerinin ilk eşleşmesini seç',
      prompt: '5 saniyede ve 10 saniyede bir sinyal veren iki robot ilk kez kaçıncı saniyede aynı anda yanar?',
      core: '5 & 10',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '5', label: '5 saniye', note: '10 saniyelik robot henüz yanmaz.' },
        { id: '10', label: '10 saniye', note: 'İki robotun ilk ortak sinyalidir.' },
        { id: '15', label: '15 saniye', note: '10 saniyelik robot 15. saniyede yanmaz.' },
      ],
      correct: ['10'],
      atomIds: LCM_ATOMS,
      success: "EKOK 10'dur; iki sinyal 10. saniyede buluşur.",
      hint: 'İki ritmin birlikte olacağı ilk zaman ortak katların en küçüğüdür.',
    },
    {
      title: 'Oyun turlarının ilk buluşmasını seç',
      prompt: '3 dakikada ve 5 dakikada bir başlayan iki oyun turu ilk kez kaçıncı dakikada birlikte başlar?',
      core: '3 & 5',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '3', label: '3 dakika', note: 'Yalnız ilk oyun turu başlar; ikisi birlikte değildir.' },
        { id: '8', label: '8 dakika', note: '3 ve 5 için ortak kat değildir.' },
        { id: '15', label: '15 dakika', note: '3 ve 5 sayılarının ilk ortak katıdır.' },
      ],
      correct: ['15'],
      atomIds: LCM_ATOMS,
      success: "EKOK 15'tir; iki oyun turu 15. dakikada birlikte başlar.",
      hint: 'Birlikte başlama sorusunda iki ritmin ortak katları aranır; ilk ortak kat EKOK olur.',
    },
    {
      title: 'Spor istasyonlarının ilk eşleşmesini seç',
      prompt: '6 dakikada ve 8 dakikada bir değişen iki spor istasyonu ilk kez kaçıncı dakikada aynı anda değişir?',
      core: '6 & 8',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '2', label: '2 dakika', note: 'Bu ortak bölen; değişim zamanı değildir.' },
        { id: '14', label: '14 dakika', note: '8’in katı değildir.' },
        { id: '24', label: '24 dakika', note: '6 ve 8’in ilk ortak katıdır.' },
      ],
      correct: ['24'],
      atomIds: LCM_ATOMS,
      success: "EKOK 24'tür; iki istasyon 24. dakikada aynı anda değişir.",
      hint: 'Düzenli tekrar eden iki olayın ilk eşleşmesi için EKOK seçilir.',
    },
  ],
  [
    {
      title: 'Nöbetlerin aynı saate gelişini seç',
      prompt: '8 dakikada ve 12 dakikada bir kontrol yapan iki görevli ilk kez kaçıncı dakikada birlikte gelir?',
      core: '8 & 12',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '4', label: '4 dakika', note: 'Bu ortak bölen; ortak kat değil.' },
        { id: '20', label: '20 dakika', note: '12’nin katı değildir.' },
        { id: '24', label: '24 dakika', note: '8 ve 12 için ilk ortak kattır.' },
      ],
      correct: ['24'],
      atomIds: LCM_ATOMS,
      success: "EKOK 24'tür; iki görevli 24. dakikada birlikte gelir.",
      hint: 'Nöbet ve ritim soruları birlikte tekrar ister; bu yüzden EKOK aranır.',
    },
    {
      title: 'Işıkların aynı anda yanmasını seç',
      prompt: '6 saniyede ve 15 saniyede bir yanan ışıklar ilk kez kaçıncı saniyede birlikte yanar?',
      core: '6 & 15',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '3', label: '3 saniye', note: 'Bu ortak bölen; iki ışığın yanma zamanı değil.' },
        { id: '21', label: '21 saniye', note: '15’in katı değildir.' },
        { id: '30', label: '30 saniye', note: '6 ve 15’in ilk ortak katıdır.' },
      ],
      correct: ['30'],
      atomIds: LCM_ATOMS,
      success: "EKOK 30'dur; ışıklar 30. saniyede birlikte yanar.",
      hint: 'İki düzenli olayın ilk buluşması için en küçük ortak kat seçilir.',
    },
    {
      title: 'Fıskiyelerin birlikte çalışmasını seç',
      prompt: '7 dakikada ve 14 dakikada bir çalışan iki fıskiye ilk kez kaçıncı dakikada birlikte çalışır?',
      core: '7 & 14',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '7', label: '7 dakika', note: '14 dakikalık fıskiye henüz çalışmaz.' },
        { id: '14', label: '14 dakika', note: '7 ve 14 için ilk ortak kattır.' },
        { id: '28', label: '28 dakika', note: 'Ortak kattır ama ilk buluşma değildir.' },
      ],
      correct: ['14'],
      atomIds: LCM_ATOMS,
      success: "EKOK 14'tür; fıskiyeler 14. dakikada birlikte çalışır.",
      hint: 'EKOK, ortak katların en küçüğünü seçmektir; daha büyük ortak katlar bekletir.',
    },
    {
      title: 'Turnike ışıklarının ilk eşleşmesini seç',
      prompt: '9 saniyede ve 15 saniyede bir yanan iki turnike ışığı ilk kez kaçıncı saniyede birlikte yanar?',
      core: '9 & 15',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '3', label: '3 saniye', note: 'Bu ortak bölen; ortak yanma zamanı değildir.' },
        { id: '30', label: '30 saniye', note: '9’un katı değildir.' },
        { id: '45', label: '45 saniye', note: '9 ve 15’in ilk ortak katıdır.' },
      ],
      correct: ['45'],
      atomIds: LCM_ATOMS,
      success: "EKOK 45'tir; iki ışık 45. saniyede birlikte yanar.",
      hint: 'Aynı anda yanma için iki sayının ortak katları incelenir.',
    },
  ],
  [
    {
      title: 'Otobüslerin aynı anda kalkmasını seç',
      prompt: '9 dakikada ve 12 dakikada bir kalkan iki otobüs ilk kez kaçıncı dakikada birlikte kalkar?',
      core: '9 & 12',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '3', label: '3 dakika', note: 'Bu ortak bölen; kalkış zamanı değil.' },
        { id: '24', label: '24 dakika', note: '9’un katı değildir.' },
        { id: '36', label: '36 dakika', note: '9 ve 12’nin ilk ortak katıdır.' },
      ],
      correct: ['36'],
      atomIds: LCM_ATOMS,
      success: "EKOK 36'dır; otobüsler 36. dakikada birlikte kalkar.",
      hint: 'Aynı ana denk gelme sorularında ortak katlar incelenir.',
    },
    {
      title: 'İlaç saatlerinin çakışmasını seç',
      prompt: '10 saatte ve 15 saatte bir alınan iki ilaç ilk kez kaç saat sonra birlikte alınır?',
      core: '10 & 15',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '5', label: '5 saat', note: 'Bu ortak bölen; iki ilaç da 5. saatte alınmaz.' },
        { id: '25', label: '25 saat', note: '10’un katı değildir.' },
        { id: '30', label: '30 saat', note: '10 ve 15’in ilk ortak katıdır.' },
      ],
      correct: ['30'],
      atomIds: LCM_ATOMS,
      success: "EKOK 30'dur; ilaçlar 30 saat sonra birlikte alınır.",
      hint: 'Tekrarlayan saatlerin ilk çakışması EKOK ile bulunur.',
    },
    {
      title: 'Servislerin aynı anda hareketini seç',
      prompt: '8 dakikada ve 18 dakikada bir hareket eden iki servis ilk kez kaçıncı dakikada birlikte hareket eder?',
      core: '8 & 18',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '2', label: '2 dakika', note: 'Bu ortak bölen; hareket zamanı değildir.' },
        { id: '36', label: '36 dakika', note: '8’in katı değildir.' },
        { id: '72', label: '72 dakika', note: '8 ve 18’in ilk ortak katıdır.' },
      ],
      correct: ['72'],
      atomIds: LCM_ATOMS,
      success: "EKOK 72'dir; servisler 72. dakikada birlikte hareket eder.",
      hint: 'Birlikte hareket edecek ilk dakika, ortak katların en küçüğüdür.',
    },
    {
      title: 'Atölye alarmını eşleştir',
      prompt: '12 dakikada ve 20 dakikada bir çalan iki atölye alarmı ilk kez kaçıncı dakikada birlikte çalar?',
      core: '12 & 20',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '4', label: '4 dakika', note: 'Bu ortak bölen; birlikte çalma zamanı değil.' },
        { id: '32', label: '32 dakika', note: '20’nin katı değildir.' },
        { id: '60', label: '60 dakika', note: '12 ve 20’nin ilk ortak katıdır.' },
      ],
      correct: ['60'],
      atomIds: LCM_ATOMS,
      success: "EKOK 60'tır; iki alarm 60. dakikada birlikte çalar.",
      hint: 'İki alarmın ilk kez birlikte çalması EKOK ile bulunur.',
    },
  ],
  [
    LCM_MISSION,
    {
      title: 'Uyduların aynı anda geçişini seç',
      prompt: '14 dakikada ve 21 dakikada bir geçen iki uydu ilk kez kaçıncı dakikada birlikte görünür?',
      core: '14 & 21',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '7', label: '7 dakika', note: 'Bu ortak bölen; geçiş zamanı değil.' },
        { id: '35', label: '35 dakika', note: '14’ün katı değildir.' },
        { id: '42', label: '42 dakika', note: '14 ve 21’in ilk ortak katıdır.' },
      ],
      correct: ['42'],
      atomIds: LCM_ATOMS,
      success: "EKOK 42'dir; uydular 42. dakikada birlikte görünür.",
      hint: 'İki döngünün ilk buluşması en küçük ortak katla bulunur.',
    },
    {
      title: 'Sensör taramalarının ilk kesişimini seç',
      prompt: '18 saniyede ve 24 saniyede bir tarama yapan iki sensör ilk kez kaçıncı saniyede birlikte tarar?',
      core: '18 & 24',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '6', label: '6 saniye', note: 'Bu ortak bölen; ortak kat değil.' },
        { id: '48', label: '48 saniye', note: '18’in katı değildir.' },
        { id: '72', label: '72 saniye', note: '18 ve 24’ün ilk ortak katıdır.' },
      ],
      correct: ['72'],
      atomIds: LCM_ATOMS,
      success: "EKOK 72'dir; sensörler 72. saniyede birlikte tarar.",
      hint: 'Birlikte çalışma anı için iki sürenin ortak katları aranır.',
    },
    {
      title: 'Kontrol lambalarının ilk kesişimini seç',
      prompt: '16 saniyede ve 20 saniyede bir yanan iki kontrol lambası ilk kez kaçıncı saniyede birlikte yanar?',
      core: '16 & 20',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '4', label: '4 saniye', note: 'Bu ortak bölen; ortak kat değildir.' },
        { id: '40', label: '40 saniye', note: '16’nın katı değildir.' },
        { id: '80', label: '80 saniye', note: '16 ve 20’nin ilk ortak katıdır.' },
      ],
      correct: ['80'],
      atomIds: LCM_ATOMS,
      success: "EKOK 80'dir; lambalar 80. saniyede birlikte yanar.",
      hint: 'İki düzenli lambanın ilk ortak yanma anı en küçük ortak kattır.',
    },
    {
      title: 'Bilet makinelerinin ilk ortak uyarısını seç',
      prompt: '15 dakikada ve 25 dakikada bir uyarı veren iki bilet makinesi ilk kez kaçıncı dakikada birlikte uyarı verir?',
      core: '15 & 25',
      kind: 'lcm',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '5', label: '5 dakika', note: 'Bu ortak bölen; uyarı zamanı değildir.' },
        { id: '50', label: '50 dakika', note: '15’in katı değildir.' },
        { id: '75', label: '75 dakika', note: '15 ve 25’in ilk ortak katıdır.' },
      ],
      correct: ['75'],
      atomIds: LCM_ATOMS,
      success: "EKOK 75'tir; makineler 75. dakikada birlikte uyarı verir.",
      hint: 'İlk ortak uyarı için iki sürenin en küçük ortak katı seçilir.',
    },
  ],
];

const GCD_MISSION: Mission = {
  title: 'Çubukları en büyük eş parçaya böl',
  prompt: '18 cm ve 24 cm çubukları artmadan en büyük eş parçaya böl.',
  core: '18 & 24',
  kind: 'gcd',
  multi: false,
  shuffleChoices: true,
  choices: [
    { id: '3', label: '3 cm', note: 'Böler ama en büyük değildir.' },
    { id: '6', label: '6 cm', note: '18 ve 24 için en büyük ortak bölen.' },
    { id: '12', label: '12 cm', note: '18 cm çubuğu kalansız bölmez.' },
  ],
  correct: ['6'],
  atomIds: ['MAT.6.1.4.2'],
  success: "EBOB 6'dır; en büyük eş parça 6 cm olur.",
  hint: 'En büyük eş parça ortak bölen ister; 6 hem 18 hem 24 sayısını kalansız böler.',
};

const GCD_MISSION_BANKS: Mission[][] = [
  [
    GCD_MISSION,
    {
      title: 'Rafları en büyük eş bölmelere ayır',
      prompt: '12 cm ve 20 cm raflar artmadan en büyük kaç cm’lik eş bölmelere ayrılır?',
      core: '12 & 20',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '2', label: '2 cm', note: 'Böler ama en büyük ortak bölen değildir.' },
        { id: '4', label: '4 cm', note: '12 ve 20 için en büyük ortak bölen.' },
        { id: '6', label: '6 cm', note: '20 cm rafı kalansız bölmez.' },
      ],
      correct: ['4'],
      atomIds: GCD_ATOMS,
      success: "EBOB 4'tür; en büyük eş bölme 4 cm olur.",
      hint: 'Artmadan eş parçalara ayırma sorusu ortak bölen ister; en büyüğü EBOB’dur.',
    },
    {
      title: 'Tahtaları en büyük eş boylara kes',
      prompt: '16 cm ve 28 cm tahtalar artmadan en büyük kaç cm’lik eş boylara kesilir?',
      core: '16 & 28',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '2', label: '2 cm', note: 'İkisini böler ama daha büyük ortak bölen var.' },
        { id: '4', label: '4 cm', note: '16 ve 28 için en büyük ortak bölen.' },
        { id: '8', label: '8 cm', note: '28 cm tahtayı kalansız bölmez.' },
      ],
      correct: ['4'],
      atomIds: GCD_ATOMS,
      success: "EBOB 4'tür; en büyük eş tahta boyu 4 cm olur.",
      hint: 'Artmadan kesme sorusunda iki uzunluğu da bölen en büyük sayı seçilir.',
    },
    {
      title: 'Şeritleri en büyük eş parçalara ayır',
      prompt: '27 cm ve 36 cm şeritler artmadan en büyük kaç cm’lik eş parçalara ayrılır?',
      core: '27 & 36',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '3', label: '3 cm', note: 'Böler ama en büyük değildir.' },
        { id: '9', label: '9 cm', note: '27 ve 36 için en büyük ortak bölen.' },
        { id: '12', label: '12 cm', note: '27 cm şeridi kalansız bölmez.' },
      ],
      correct: ['9'],
      atomIds: GCD_ATOMS,
      success: "EBOB 9'dur; en büyük eş şerit boyu 9 cm olur.",
      hint: 'Eş parçalara ayırırken kalan olmamalı; en büyük ortak bölen aranır.',
    },
  ],
  [
    {
      title: 'Kurdeleleri en büyük eş parçalara böl',
      prompt: '28 cm ve 42 cm kurdeleler artmadan en büyük kaç cm’lik eş parçalara ayrılır?',
      core: '28 & 42',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '7', label: '7 cm', note: 'Böler ama en büyük değildir.' },
        { id: '14', label: '14 cm', note: '28 ve 42 için en büyük ortak bölen.' },
        { id: '21', label: '21 cm', note: '28 cm kurdeleyi kalansız bölmez.' },
      ],
      correct: ['14'],
      atomIds: GCD_ATOMS,
      success: "EBOB 14'tür; en büyük eş parça 14 cm olur.",
      hint: 'En büyük eş parça aranıyorsa ortak bölenlerin en büyüğü seçilir.',
    },
    {
      title: 'Etiketleri en büyük eş paketlere ayır',
      prompt: '30 ve 45 etiketi artmadan eş paketlere koymak için bir pakette en çok kaç etiket olur?',
      core: '30 & 45',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '5', label: '5 etiket', note: 'Böler ama en büyük değildir.' },
        { id: '15', label: '15 etiket', note: '30 ve 45 için en büyük ortak bölen.' },
        { id: '30', label: '30 etiket', note: '45 etiketi kalansız bölmez.' },
      ],
      correct: ['15'],
      atomIds: GCD_ATOMS,
      success: "EBOB 15'tir; en büyük eş paket 15 etiket alır.",
      hint: 'Eş paket ve artmama ifadesi en büyük ortak böleni çağırır.',
    },
    {
      title: 'Kitapları en büyük eş raflara paylaştır',
      prompt: '24 ve 40 kitap artmadan eş raflara konacak. Bir rafta en çok kaç kitap olur?',
      core: '24 & 40',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '4', label: '4 kitap', note: 'Böler ama en büyük ortak bölen değildir.' },
        { id: '8', label: '8 kitap', note: '24 ve 40 için en büyük ortak bölen.' },
        { id: '12', label: '12 kitap', note: '40 kitabı kalansız bölmez.' },
      ],
      correct: ['8'],
      atomIds: GCD_ATOMS,
      success: "EBOB 8'dir; bir rafta en çok 8 kitap olur.",
      hint: 'En çok kaç eş grup sorusu EBOB ister.',
    },
    {
      title: 'Boncukları en büyük eş kutulara koy',
      prompt: '36 ve 60 boncuk artmadan eş kutulara ayrılacak. Bir kutuda en çok kaç boncuk olur?',
      core: '36 & 60',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '6', label: '6 boncuk', note: 'Böler ama daha büyük ortak bölen var.' },
        { id: '12', label: '12 boncuk', note: '36 ve 60 için en büyük ortak bölen.' },
        { id: '18', label: '18 boncuk', note: '60 boncuğu kalansız bölmez.' },
      ],
      correct: ['12'],
      atomIds: GCD_ATOMS,
      success: "EBOB 12'dir; bir kutuda en çok 12 boncuk olur.",
      hint: 'Artmadan eş kutulara ayırmak için ortak bölenlerin en büyüğü seçilir.',
    },
  ],
  [
    {
      title: 'Şişeleri en büyük eş kolilere koy',
      prompt: '36 ve 48 şişe artmadan eş kolilere ayrılacak. Bir kolide en çok kaç şişe olur?',
      core: '36 & 48',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '6', label: '6 şişe', note: 'Böler ama en büyük değildir.' },
        { id: '12', label: '12 şişe', note: '36 ve 48 için en büyük ortak bölen.' },
        { id: '18', label: '18 şişe', note: '48 şişeyi kalansız bölmez.' },
      ],
      correct: ['12'],
      atomIds: GCD_ATOMS,
      success: "EBOB 12'dir; bir kolide en çok 12 şişe olur.",
      hint: 'En büyük eş grup için ortak bölenlerin en büyüğü gerekir.',
    },
    {
      title: 'Kabloları en büyük eş uzunluklara böl',
      prompt: '40 m ve 64 m kablolar artmadan en büyük kaç metrelik eş parçalara bölünür?',
      core: '40 & 64',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '4', label: '4 m', note: 'Böler ama daha büyük ortak bölen var.' },
        { id: '8', label: '8 m', note: '40 ve 64 için en büyük ortak bölen.' },
        { id: '16', label: '16 m', note: '40 m kabloyu kalansız bölmez.' },
      ],
      correct: ['8'],
      atomIds: GCD_ATOMS,
      success: "EBOB 8'dir; en büyük eş kablo uzunluğu 8 m olur.",
      hint: 'Kablo kesme ve artmama sorusu EBOB ister.',
    },
    {
      title: 'Fideleri en büyük eş sıralara dik',
      prompt: '45 ve 75 fide artmadan eş sıralara dikilecek. Bir sırada en çok kaç fide olur?',
      core: '45 & 75',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '5', label: '5 fide', note: 'Böler ama en büyük ortak bölen değildir.' },
        { id: '15', label: '15 fide', note: '45 ve 75 için en büyük ortak bölen.' },
        { id: '25', label: '25 fide', note: '45 fideyi kalansız bölmez.' },
      ],
      correct: ['15'],
      atomIds: GCD_ATOMS,
      success: "EBOB 15'tir; bir sırada en çok 15 fide olur.",
      hint: 'En büyük eş sıra için iki sayının da ortak bölenleri düşünülür.',
    },
    {
      title: 'Kartları en büyük eş destelere ayır',
      prompt: '63 ve 81 kart artmadan eş destelere ayrılacak. Bir destede en çok kaç kart olur?',
      core: '63 & 81',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '3', label: '3 kart', note: 'Böler ama daha büyük ortak bölen var.' },
        { id: '9', label: '9 kart', note: '63 ve 81 için en büyük ortak bölen.' },
        { id: '18', label: '18 kart', note: '63 kartı kalansız bölmez.' },
      ],
      correct: ['9'],
      atomIds: GCD_ATOMS,
      success: "EBOB 9'dur; bir destede en çok 9 kart olur.",
      hint: 'Eş deste ve artmama ipucu en büyük ortak böleni çağırır.',
    },
  ],
  [
    {
      title: 'Taşları en büyük eş dizilere ayır',
      prompt: '54 ve 72 taş artmadan eş dizilere ayrılacak. Bir dizide en çok kaç taş olur?',
      core: '54 & 72',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '9', label: '9 taş', note: 'Böler ama en büyük değildir.' },
        { id: '18', label: '18 taş', note: '54 ve 72 için en büyük ortak bölen.' },
        { id: '27', label: '27 taş', note: '72 taşı kalansız bölmez.' },
      ],
      correct: ['18'],
      atomIds: GCD_ATOMS,
      success: "EBOB 18'dir; bir dizide en çok 18 taş olur.",
      hint: 'En çok kaç eş parça/grup sorusu EBOB ile çözülür.',
    },
    {
      title: 'Çubukları en büyük eş boylara kes',
      prompt: '42 cm ve 56 cm çubuklar artmadan en büyük kaç cm’lik eş boylara kesilir?',
      core: '42 & 56',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '7', label: '7 cm', note: 'Böler ama en büyük değildir.' },
        { id: '14', label: '14 cm', note: '42 ve 56 için en büyük ortak bölen.' },
        { id: '28', label: '28 cm', note: '42 cm çubuğu kalansız bölmez.' },
      ],
      correct: ['14'],
      atomIds: GCD_ATOMS,
      success: "EBOB 14'tür; en büyük eş çubuk boyu 14 cm olur.",
      hint: 'Kesme ve artmadan bölme ifadesi en büyük ortak böleni ister.',
    },
    {
      title: 'Tuğlaları en büyük eş dizilere ayır',
      prompt: '48 ve 80 tuğla artmadan eş dizilere ayrılacak. Bir dizide en çok kaç tuğla olur?',
      core: '48 & 80',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '8', label: '8 tuğla', note: 'Böler ama en büyük değildir.' },
        { id: '16', label: '16 tuğla', note: '48 ve 80 için en büyük ortak bölen.' },
        { id: '24', label: '24 tuğla', note: '80 tuğlayı kalansız bölmez.' },
      ],
      correct: ['16'],
      atomIds: GCD_ATOMS,
      success: "EBOB 16'dır; bir dizide en çok 16 tuğla olur.",
      hint: 'En çok kaç eş dizi sorusu ortak bölenlerin en büyüğünü ister.',
    },
    {
      title: 'Metal parçaları en büyük eş kutulara koy',
      prompt: '66 ve 88 metal parça artmadan eş kutulara ayrılacak. Bir kutuda en çok kaç parça olur?',
      core: '66 & 88',
      kind: 'gcd',
      multi: false,
      shuffleChoices: true,
      choices: [
        { id: '11', label: '11 parça', note: 'Böler ama daha büyük ortak bölen var.' },
        { id: '22', label: '22 parça', note: '66 ve 88 için en büyük ortak bölen.' },
        { id: '33', label: '33 parça', note: '88 parçayı kalansız bölmez.' },
      ],
      correct: ['22'],
      atomIds: GCD_ATOMS,
      success: "EBOB 22'dir; bir kutuda en çok 22 parça olur.",
      hint: 'Artmadan eş kutulara ayırmada iki miktarı da bölen en büyük sayı seçilir.',
    },
  ],
];

export const DIVISIBILITY_WORKSHOP_CONFIG: NumberSelectionWorkshopConfig = {
  moduleId: 'divisibility-workshop',
  title: 'Bölünebilme Atölyesi',
  atomLabel: 'MAT.6.1.1 - MAT.6.1.2',
  introMessage: 'Hedef sayıya bak, çarpan veya bölünebilme kuralına uyan bütün seçenekleri seç.',
  advanceMessage: 'Yeni hedef geldi. Sorudaki kurala göre bütün doğru seçenekleri seç.',
  completionTitle: 'Bölünebilme tamam',
  completionMessage: 'Çarpanları ve bölünebilme kurallarını hedef sayı üzerinden doğru ayırdın.',
  atoms: DIVISIBILITY_ATOMS,
  missions: [FACTOR_MISSION, ENDING_RULE_MISSIONS[0], DIGIT_SUM_RULE_MISSIONS[0], DIVISIBILITY_MISSION],
  missionBanks: [FACTOR_MISSIONS, ENDING_RULE_MISSIONS, DIGIT_SUM_RULE_MISSIONS, MIXED_DIVISIBILITY_MISSIONS],
  focusCards: [
    { label: 'Çarpanlar', subtitle: 'kalansız bölenler', activeKinds: ['factors'] },
    { label: 'Bölünebilme', subtitle: 'son rakam + rakam toplamı', activeKinds: ['divisibility'] },
  ],
};

export const PRIME_NUMBERS_WORKSHOP_CONFIG: NumberSelectionWorkshopConfig = {
  moduleId: 'prime-numbers-workshop',
  title: 'Asal Sayılar Atölyesi',
  atomLabel: 'MAT.6.1.3',
  introMessage: 'Hedef aralığı oku; asal olanları ya da asal çarpan zincirini seç.',
  advanceMessage: 'Yeni hedef geldi. Bu kez sayıyı en küçük asal parçalara kadar ayır.',
  completionTitle: 'Asal sayılar tamam',
  completionMessage: 'Asal sayıları ayırdın ve asal çarpan zincirini doğru kurdun.',
  atoms: PRIME_ATOMS,
  missions: [PRIME_SIEVE_MISSION, PRIME_WIDE_SIEVE_MISSIONS[0], PRIME_TREE_MISSION],
  missionBanks: [PRIME_BASIC_SIEVE_MISSIONS, PRIME_WIDE_SIEVE_MISSIONS, PRIME_TREE_MISSIONS],
  focusCards: [
    { label: 'Asal Sayı', subtitle: 'yalnız 1 ve kendisi', activeKinds: ['prime-sieve'] },
    { label: 'Asal Çarpan', subtitle: 'en küçük asal parçalar', activeKinds: ['prime-tree'] },
  ],
};

export const GCD_LCM_WORKSHOP_CONFIG: NumberSelectionWorkshopConfig = {
  moduleId: 'gcd-lcm-workshop',
  title: 'EBOB-EKOK Atölyesi',
  atomLabel: 'MAT.6.1.1 - MAT.6.1.4',
  introMessage: 'Problemi oku: birlikte tekrar ediyorsa EKOK, en büyük eş parça gerekiyorsa EBOB düşün.',
  advanceMessage: 'Yeni problem geldi. Ortak kat mı, ortak bölen mi istediğini ayırt et.',
  completionTitle: 'EBOB-EKOK tamam',
  completionMessage: 'Ortak kat ve ortak bölen problemlerini doğru ayırdın.',
  atoms: GCD_LCM_ATOMS,
  missions: [LCM_MISSION, GCD_MISSION],
  focusCards: [
    { label: 'EKOK', subtitle: 'ilk ortak kat', activeKinds: ['lcm'] },
    { label: 'EBOB', subtitle: 'en büyük ortak bölen', activeKinds: ['gcd'] },
  ],
};

export const LCM_WORKSHOP_CONFIG: NumberSelectionWorkshopConfig = {
  moduleId: 'lcm-workshop',
  title: 'EKOK Ritim Atölyesi',
  atomLabel: 'MAT.6.1.1.2 · MAT.6.1.4.1',
  introMessage: 'Tekrarlayan iki ritmin ilk birlikte olduğu zamanı bul. Bu EKOK görevidir.',
  advanceMessage: 'Yeni ritim geldi. İlk ortak zamanı bulmak için ortak katları düşün.',
  completionTitle: 'EKOK ritimleri tamam',
  completionMessage: 'Tekrarlayan olaylarda ilk ortak zamanı EKOK ile doğru buldun.',
  atoms: LCM_ATOMS,
  missions: [LCM_MISSION_BANKS[0][0], LCM_MISSION_BANKS[1][0], LCM_MISSION_BANKS[2][0], LCM_MISSION_BANKS[3][0]],
  missionBanks: LCM_MISSION_BANKS,
  focusCards: [
    { label: 'Ortak Kat', subtitle: 'iki ritmin ortak zamanı', activeKinds: ['lcm'] },
    { label: 'EKOK', subtitle: 'ilk ortak kat', activeKinds: ['lcm'] },
  ],
};

export const GCD_WORKSHOP_CONFIG: NumberSelectionWorkshopConfig = {
  moduleId: 'gcd-workshop',
  title: 'EBOB Parça Atölyesi',
  atomLabel: 'MAT.6.1.4.2',
  introMessage: 'Artmadan en büyük eş parçayı bul. Bu EBOB görevidir.',
  advanceMessage: 'Yeni paylaşım geldi. En büyük eş parça için ortak bölenleri düşün.',
  completionTitle: 'EBOB parçaları tamam',
  completionMessage: 'Eş parça ve artmadan paylaşma problemlerinde EBOB’u doğru kullandın.',
  atoms: GCD_ATOMS,
  missions: [GCD_MISSION_BANKS[0][0], GCD_MISSION_BANKS[1][0], GCD_MISSION_BANKS[2][0], GCD_MISSION_BANKS[3][0]],
  missionBanks: GCD_MISSION_BANKS,
  focusCards: [
    { label: 'Ortak Bölen', subtitle: 'iki miktarı da böler', activeKinds: ['gcd'] },
    { label: 'EBOB', subtitle: 'en büyük eş parça', activeKinds: ['gcd'] },
  ],
};

const makeMessage = (text: string, type: BotMessageType, id: number): BotMessage => ({ text, type, id });
const sorted = (values: string[]) => [...values].sort((a, b) => a.localeCompare(b));
const sameSet = (left: string[], right: string[]) => sorted(left).join('|') === sorted(right).join('|');
const RECENT_CORE_LIMIT = 12;
const recentCoreKey = (moduleId: string) => `number-workshop:${moduleId}:recent-cores`;

const mergeMissionRunCores = (missions: Mission[], previousCores: string[] = []) => {
  const nextCores: string[] = [];

  for (const core of [...missions.map((mission) => mission.core), ...previousCores]) {
    if (!nextCores.includes(core)) nextCores.push(core);
    if (nextCores.length >= RECENT_CORE_LIMIT) break;
  }

  return nextCores;
};

const readRecentMissionCores = (moduleId: string) => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.sessionStorage.getItem(recentCoreKey(moduleId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((core): core is string => typeof core === 'string') : [];
  } catch {
    return [];
  }
};

const rememberMissionRun = (moduleId: string, missions: Mission[]) => {
  if (typeof window === 'undefined') return;

  const nextCores = mergeMissionRunCores(missions, readRecentMissionCores(moduleId));

  try {
    window.sessionStorage.setItem(recentCoreKey(moduleId), JSON.stringify(nextCores));
  } catch {
    // If browser storage is unavailable, mission variety still falls back to in-run randomization.
  }
};

const choiceLabels = (mission: Mission, ids: string[]) =>
  ids.map((id) => mission.choices.find((choice) => choice.id === id)?.label ?? id).join(', ');

const explainSelectionError = (mission: Mission, selected: string[]) => {
  const missing = mission.correct.filter((id) => !selected.includes(id));
  const extra = selected.filter((id) => !mission.correct.includes(id));

  if (!mission.multi && extra.length > 0) return `${choiceLabels(mission, extra)} doğru cevap değil. ${mission.hint}`;
  if (missing.length > 0 && extra.length === 0) {
    return `Seçtiklerin doğru ama eksik: ${choiceLabels(mission, missing)} de seçilmeli. Soruda "bütün" dendiği için tüm doğru seçenekleri seçmelisin.`;
  }
  if (missing.length > 0 && extra.length > 0) {
    return `${choiceLabels(mission, extra)} doğru seçenek değil. Ayrıca eksik olanlar: ${choiceLabels(mission, missing)}. ${mission.hint}`;
  }
  return mission.hint;
};

const pickMission = (bank: Mission[], previous?: Mission, blockedCores: string[] = []) => {
  const blockedCoreSet = new Set(blockedCores);
  const candidates = bank.filter((mission) => mission.core !== previous?.core && !blockedCoreSet.has(mission.core));
  const safeCandidates = candidates.length > 0 ? candidates : bank;
  const mission = safeCandidates[Math.floor(Math.random() * safeCandidates.length)];
  if (!mission.shuffleChoices) return mission;

  const shuffledChoices = [...mission.choices];
  for (let index = shuffledChoices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledChoices[index], shuffledChoices[swapIndex]] = [shuffledChoices[swapIndex], shuffledChoices[index]];
  }

  return { ...mission, choices: shuffledChoices };
};

const createMissionRun = (
  config: NumberSelectionWorkshopConfig,
  previousRun?: Mission[],
  blockedCores = readRecentMissionCores(config.moduleId)
) => {
  if (!config.missionBanks) return config.missions;

  const currentCores = new Set<string>();

  return config.missionBanks.map((bank, index) => {
    const mission = pickMission(bank, previousRun?.[index], [...blockedCores, ...currentCores]);
    currentCores.add(mission.core);
    return mission;
  });
};

export function NumberSelectionWorkshop({ config }: { config: NumberSelectionWorkshopConfig }) {
  const navigate = useNavigate();
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const recentCoresRef = useRef<string[]>(readRecentMissionCores(config.moduleId));
  const [activeMissions, setActiveMissions] = useState<Mission[]>(() =>
    createMissionRun(config, undefined, recentCoresRef.current)
  );
  const [missionIndex, setMissionIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: BotMessageType } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [botMessage, setBotMessage] = useState<BotMessage>(makeMessage(config.introMessage, 'info', 0));

  useEffect(() => {
    recentCoresRef.current = mergeMissionRunCores(activeMissions, recentCoresRef.current);
    rememberMissionRun(config.moduleId, activeMissions);
  }, [activeMissions, config.moduleId]);

  const mission = activeMissions[missionIndex];
  const progress = completed ? 100 : Math.round((missionIndex / activeMissions.length) * 100);
  const isCorrect = useMemo(() => sameSet(selected, mission.correct), [mission.correct, selected]);
  const focusGridClass = config.focusCards.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  const speak = (text: string, type: BotMessageType = 'info') => {
    setMessageId((id) => {
      const nextId = id + 1;
      setBotMessage(makeMessage(text, type, nextId));
      return nextId;
    });
  };

  const reset = () => {
    setActiveMissions((current) => createMissionRun(config, current, recentCoresRef.current));
    setMissionIndex(0);
    setSelected([]);
    setFeedback(null);
    setCompleted(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    speak(config.introMessage, 'info');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleChoice = (id: string) => {
    if (completed) return;
    setFeedback(null);
    setSelected((current) => {
      if (!mission.multi) return [id];
      return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const lock = () => {
    if (completed) return;
    if (!isCorrect) {
      const text = selected.length === 0 ? 'Önce en az bir seçenek seçmelisin.' : explainSelectionError(mission, selected);
      setFeedback({ text, type: 'error' });
      speak(text, 'error');
      return;
    }

    mission.atomIds.forEach((atomId) => unlockAtom(atomId));
    setFeedback({ text: mission.success, type: 'success' });
    speak(mission.success, 'success');
    const isLast = missionIndex === activeMissions.length - 1;

    window.setTimeout(() => {
      if (isLast) {
        config.atoms.forEach((atomId) => unlockAtom(atomId));
        unlockModule(config.moduleId);
        addScore(90);
        setCompleted(true);
        speak(config.completionMessage, 'success');
      } else {
        setMissionIndex((index) => index + 1);
        setSelected([]);
        setFeedback(null);
        speak(config.advanceMessage, 'info');
      }
    }, 850);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#050510] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.045)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] bg-violet-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-4">
          <button aria-label="Ana merkeze dön" onClick={() => navigate('/')} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-cyan-200">{config.atomLabel}</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">{config.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">İlerleme</p>
            <p data-testid="quantum-filter-progress" className="text-xl font-black text-cyan-100">%{progress}</p>
          </div>
          <button data-testid="quantum-filter-reset" aria-keyshortcuts="Home" onClick={reset} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15">
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section data-testid="quantum-filter-stage" className="rounded-[32px] border border-cyan-300/20 bg-slate-950/72 p-5 shadow-[0_30px_90px_rgba(0,229,255,0.12)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-cyan-100">Ana oyuncak: hedef sayı ve seçenek panosu</p>
              <h2 className="mt-1 text-2xl font-black">{mission.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-300">{mission.prompt}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
              <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white/50">Görev</p>
              <p className="mt-1 text-4xl font-black text-cyan-100">{missionIndex + 1}/{activeMissions.length}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div data-testid="quantum-filter-scene" className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-cyan-200/15 bg-slate-950/85 p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.2),transparent_28%),linear-gradient(135deg,rgba(20,184,166,0.12),transparent_45%,rgba(168,85,247,0.12))]" />
              <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between">
                <div className={`grid gap-3 ${focusGridClass}`}>
                  {config.focusCards.map((card) => (
                    <FilterGate key={card.label} active={card.activeKinds.includes(mission.kind)} label={card.label} subtitle={card.subtitle} />
                  ))}
                </div>

                <motion.div
                  data-testid="quantum-filter-core"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 1.5, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                  className="mx-auto my-5 grid h-40 w-40 place-items-center rounded-[38px] border border-cyan-200/40 bg-cyan-300/15 text-center shadow-[0_0_60px_rgba(34,211,238,0.28)]"
                >
                  <div>
                    <Sparkles className="mx-auto mb-2 h-7 w-7 text-cyan-100" />
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-cyan-100">Hedef</p>
                    <p className="mt-1 text-4xl font-black text-white">{mission.core}</p>
                  </div>
                </motion.div>

                <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">Seçtiğin cevaplar</p>
                  <p className="mt-2 min-h-8 text-lg font-black text-white">{selected.length > 0 ? selected.join(' · ') : 'Henüz seçim yok'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-100">Seçenekler</p>
              <div className={`mt-4 grid gap-2 ${mission.choices.length > 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {mission.choices.map((choice, index) => {
                  const active = selected.includes(choice.id);
                  const denseChoice = mission.choices.length > 4;
                  return (
                    <button
                      key={choice.id}
                      data-testid={`quantum-option-${index}`}
                      onClick={() => toggleChoice(choice.id)}
                      className={`rounded-2xl border text-left transition ${denseChoice ? 'min-h-[72px] px-3 py-2' : 'min-h-14 px-4 py-2.5'} ${active ? 'border-cyan-200/60 bg-cyan-300/18 text-white shadow-[0_0_24px_rgba(34,211,238,0.16)]' : 'border-white/10 bg-slate-950/70 text-white/75 hover:border-cyan-200/30 hover:bg-white/8'}`}
                    >
                      <span className="block text-lg font-black">{choice.label}</span>
                      <span className="mt-0.5 block text-[10px] font-bold leading-snug text-white/52">{choice.note}</span>
                    </button>
                  );
                })}
              </div>
              <button data-testid="quantum-filter-lock" onClick={lock} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 transition hover:bg-white">
                <ScanLine className="h-5 w-5" />
                Cevabı kontrol et
              </button>
            </div>
          </div>

          {feedback && !completed && (
            <div data-testid="quantum-filter-feedback" className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${feedback.type === 'error' ? 'border-rose-400/40 bg-rose-500/10 text-rose-100' : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'}`}>
              {feedback.text}
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[28px] border border-cyan-300/30 bg-cyan-950/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Canlı durum</p>
            <h2 className="mt-3 text-2xl font-black">{completed ? 'Atölye tamam' : 'AstroBot hazır'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{botMessage.text}</p>
          </section>
          <section className="rounded-[28px] border border-white/15 bg-white/[0.07] p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-100">Görev zinciri</p>
            <div className="mt-4 space-y-3">
              {activeMissions.map((item, index) => (
                <div key={item.title} className={`rounded-2xl border px-4 py-3 text-sm font-bold ${index < missionIndex || completed ? 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100' : index === missionIndex ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-50' : 'border-white/10 bg-slate-950/45 text-white/55'}`}>
                  <div className="flex items-center gap-2">
                    {index < missionIndex || completed ? <CheckCircle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>

      {completed && <CompletionPanel config={config} onReplay={reset} />}
      {!completed && <AstroBot message={botMessage} />}
    </div>
  );
}

function FilterGate({ active, label, subtitle }: { active: boolean; label: string; subtitle: string }) {
  return (
    <div className={`rounded-3xl border px-4 py-3 ${active ? 'border-cyan-200/55 bg-cyan-300/16 text-cyan-50' : 'border-white/10 bg-white/[0.04] text-white/45'}`}>
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]">{label}</p>
      <p className="mt-1 text-xs font-bold">{subtitle}</p>
    </div>
  );
}

function CompletionPanel({ config, onReplay }: { config: NumberSelectionWorkshopConfig; onReplay: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl rounded-[36px] border border-cyan-200/30 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(0,229,255,0.22)]">
        <ShieldCheck className="mx-auto h-20 w-20 text-cyan-300" />
        <h2 className="mt-5 text-4xl font-black">{config.completionTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">{config.completionMessage}</p>
        <div className="mt-6 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-left">
          <p className="font-mono text-sm font-black text-cyan-100">{config.atomLabel}</p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button data-testid="quantum-filter-replay" onClick={onReplay} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
            Tekrar oyna
          </button>
          <Link data-testid="quantum-filter-home" to="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/15">
            Ana merkeze dön <Home className="h-5 w-5" /> <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function QuantumFilterStationApp() {
  return <Navigate to="/embed/numbers/divisibility-workshop" replace />;
}
