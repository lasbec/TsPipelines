import { assertChar, Char } from "../Utils/String/Char";
import {
    endOfInput,
    EndOfInput,
    FinalState,
    isFinalState,
    reject,
} from "./Interfaces";

export type PDA_Operation<StackElement> = { push: Exclude<StackElement, undefined> } | "pop";

export type PDA_Transition<State extends string, StackElement>
    =
    ((args:{state:State, stackTop: StackElement, char:Char | EndOfInput})=> [ State, PDA_Operation<StackElement>] | FinalState)


export class PDA<State extends string, StackElement>{
    constructor(
        readonly start: State,
        readonly states: ReadonlySet<State>,
        readonly transitions: PDA_Transition<State, StackElement | undefined>
    ) {}

    test(input: string): FinalState {
        let state: State = this.start;
        const stack:Array<StackElement> = [];
        for (const char of input) {
            assertChar(char);
            const args = {stackTop:stack[stack.length -1], char, state};
            const transition = this.transitions(args);
            if (!transition) return reject(`Undefined transition for ${JSON.stringify(args)}`);
            if(isFinalState(transition)) return transition;
            const [newState, stackOp] = transition;
            if (stackOp === "pop"){
                stack.pop();
            }else {
                stack.push(stackOp.push);
            }
            state = newState
        }
        const args = {stackTop:stack[stack.length -1], char:endOfInput(), state};
        const transition = this.transitions(args);
        if (!transition) return reject(`Undefined transition for ${JSON.stringify(args)}`);
        if(isFinalState(transition)) return transition;
        return reject(`Ended in state '${transition[0]}'`);
    }
}