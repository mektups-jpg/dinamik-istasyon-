export interface NumberLineSubTask {
  startNum: number;
  jumpNum: number;
  targetNum: number;
}

export const NUMBER_LINE_SUB_MAX_NUMBER = 15;

const MIN_START_NUMBER = 5;
const MAX_START_NUMBER = 14;
const MAX_BACKWARD_JUMP = 5;

export function createNumberLineSubTask(previousTask?: NumberLineSubTask): NumberLineSubTask {
  const previousKey = previousTask ? taskKey(previousTask) : '';

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const startNum = randomInt(MIN_START_NUMBER, MAX_START_NUMBER);
    const jumpNum = randomInt(1, Math.min(MAX_BACKWARD_JUMP, startNum - 1));
    const task = { startNum, jumpNum, targetNum: startNum - jumpNum };

    if (taskKey(task) !== previousKey) return task;
  }

  const fallbackStart = previousTask?.startNum === MAX_START_NUMBER ? MIN_START_NUMBER : (previousTask?.startNum ?? 7) + 1;
  const fallbackJump = Math.min(previousTask?.jumpNum ?? 2, fallbackStart - 1);

  return {
    startNum: fallbackStart,
    jumpNum: fallbackJump,
    targetNum: fallbackStart - fallbackJump,
  };
}

function taskKey(task: NumberLineSubTask): string {
  return `${task.startNum}-${task.jumpNum}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
