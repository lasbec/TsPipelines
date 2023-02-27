/**
 * Deterministic Finite Automata
 */
import { describe, expect, it } from "vitest";
import { DFA } from "../src/Automata/DeterministicFiniteAutomata";
import { asChar } from "../src/Utils/String/Char";


describe("DFA",()=>{
    // ^aA+Ende$
    const testDfa = new DFA(
        "s",
        new Set(["s", "a", "A", "E", "n", "d", "e"]),
        [
            ["s", asChar("a"), "a"],
            ["a", asChar("A"), "A"],
            ["A", asChar("a"), "a"],
            ["A", asChar("E"), "E"],
            ["E", asChar("n"), "n"],
            ["n", asChar("d"), "d"],
            ["d", asChar("e"), "e"],
            ["e", "", {accepted:true}]
        ]
    )

    it("1", ()=>{
        expect(testDfa.test("aAEnde")).toEqual({accepted:true});
    })
    it("2", ()=>{
        expect(testDfa.test("aAaAEnde")).toEqual({accepted:true});
    })
    it("3", ()=>{
        expect(testDfa.test("Ende")).toEqual({accepted:false});
    })
})