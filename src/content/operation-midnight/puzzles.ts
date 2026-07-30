import { puzzleDefinitions } from "./canonical";

export const puzzles = Object.entries(puzzleDefinitions).map(([slug, puzzle]) => ({
  slug,
  maxAttempts: puzzle.maxAttempts,
  hints: puzzle.hints,
}));
