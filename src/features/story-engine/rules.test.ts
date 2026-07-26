import { describe, expect, it } from "vitest";
import { majority, meetsCondition, remainingSeconds } from "./rules";
import { canTransition } from "../../lib/security/session-state";
describe("motor da história",()=>{it("calcula maioria e empate",()=>{expect(majority(["a","a","b"])).toBe("a");expect(majority(["a","b"])).toBeNull()});it("avalia flags sem eval",()=>{expect(meetsCondition({alarm_triggered:true},{flag:"alarm_triggered",operator:"equals",value:true})).toBe(true)});it("calcula timer pelo deadline",()=>{expect(remainingSeconds(11000,1000)).toBe(10)});it("bloqueia saltos de estado",()=>{expect(canTransition("lobby","active")).toBe(false);expect(canTransition("lobby","role_assignment")).toBe(true)})});
