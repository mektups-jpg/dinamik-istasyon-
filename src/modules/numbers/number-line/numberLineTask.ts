export interface NumberLineTask {
  startNum: number;
  jumpNum: number;
  targetNum: number;
}

export const NUMBER_LINE_MAX_NUMBER = 10;

const MIN_START_NUMBER = 1;
const MAX_START_NUMBER = 6;
const MAX_JUMP_COUNT = 4;

export function createNumberLineTask(previousTask?: NumberLineTask): NumberLineTask {
  const previousKey = previousTask ? taskKey(previousTask) : '';

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const startNum = randomInt(MIN_START_NUMBER, MAX_START_NUMBER);
    const jumpNum = randomInt(1, Math.min(MAX_JUMP_COUNT, NUMBER_LINE_MAX_NUMBER - startNum));
    const task = { startNum, jumpNum, targetNum: startNum + jumpNum };

    if (taskKey(task) !== previousKey) return task;
  }

  const fallbackStart = previousTask?.startNum === MAX_START_NUMBER ? MIN_START_NUMBER : (previousTask?.startNum ?? 2) + 1;
  const fallbackJump = Math.min(previousTask?.jumpNum ?? 2, NUMBER_LINE_MAX_NUMBER - fallbackStart);

  return {
    startNum: fallbackStart,
    jumpNum: fallbackJump,
    targetNum: fallbackStart + fallbackJump,
  };
}

function taskKey(task: NumberLineTask): string {
  return `${task.startNum}-${task.jumpNum}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
