import { Char } from "../Utils/String/Char";

export interface FinalState {
    accepted: boolean;
    reason?: string;
}
export function isFinalState(state: string | FinalState | Array<any>): state is FinalState {
    return typeof  state !== "string" && !Array.isArray(state);
}

export function accept(reason?:string):FinalState{
    return {accepted:true, reason};
}

export function reject(reason?: string):FinalState{
    return {accepted:false, reason};
}

export interface Wildcard {
    wildcard:true;
}
export function isWildcard(inp: Char | Wildcard | EndOfInput):inp is Wildcard{
    return typeof  inp !== "string" && "wildcard" in inp;
}
export function wildcard(): Wildcard {
    return { wildcard: true };
}

export interface EndOfInput {
    endOfInput: true;
}

export function endOfInput(): EndOfInput {
    return {endOfInput: true}
}

export function isEndOfInput(inp: Char | Wildcard | EndOfInput): inp is EndOfInput{
    return typeof  inp !== "string" && "endOfInput" in inp;
}

export interface Automata {
    test(input:string): FinalState;
}

