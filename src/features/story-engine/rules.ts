export type Flags = Record<string, boolean | number | string>;
export type Condition = { flag: string; operator: "equals" | "not_equals" | "exists"; value?: boolean | number | string };
export function meetsCondition(flags: Flags, condition: Condition): boolean { const current = flags[condition.flag]; if (condition.operator === "exists") return current !== undefined; if (condition.operator === "equals") return current === condition.value; return current !== condition.value; }
export function majority(votes: string[]): string | null { if (!votes.length) return null; const counts = votes.reduce<Record<string, number>>((a,v)=>(a[v]=(a[v]??0)+1,a),{}); const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]); return sorted.length>1 && sorted[0][1]===sorted[1][1] ? null : sorted[0][0]; }
export function remainingSeconds(deadline: number, now = Date.now()): number { return Math.max(0, Math.ceil((deadline-now)/1000)); }
