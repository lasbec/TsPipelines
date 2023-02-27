import { assertChar, Char } from "../Utils/String/Char";
import { Automata, FinalState } from "./Interfaces";

export class DFA<State extends string> implements Automata {
    constructor(
        readonly start: State,
        readonly states: ReadonlySet<State>,
        readonly transitions: ReadonlyArray<[State, Char , State | FinalState] | [State, "",  FinalState]>
    ) {
    }

    test(input: string): FinalState {
        let state: State = this.start;
        for (const char of input) {
            assertChar(char);
            const transition = this.transitions.find((t) => t[0] === state && t[1] === char);
            if (!transition) return {accepted: false};
            const newState = transition[2];
            if (typeof newState !== "string") return newState;
            state = newState
        }
        const transition = this.transitions.find((t) => t[0] === state && t[1] === "");
        if (!transition) return {accepted: false};
        const newState = transition[2];
        if (typeof newState !== "string") return newState;
        return {accepted: false};
    }

}