import { describe, expect, it } from "vitest";
import { PDA } from "../src/Automata/PushdownAutomata";
import { accept, isEndOfInput, reject } from "../src/Automata/Interfaces";

describe("PDA", ()=>{
    const parenthesisOpenToClose= new Map<string, string>([
        ["(", ")"],
        ["[", "]"],
        ["{", "}"],
        ["<", ">"],
    ])
    const parenthesisCloseToOpen= new Map<string, string>([
        [ ")","("],
        [ "]","["],
        [ "}","{"],
        [ ">","<"],
    ])
    const matchings = new Set(["()", "[]", "{}", "<>"]);
    const matchingParenthesis = new PDA<"S", string>(
        "S",
        new Set(["S"]),
(args)=>  {
            if (isEndOfInput(args.char)) {
                return args.stackTop === undefined ? accept() : reject(`some stack left '${args.stackTop}'.`);
            }
            const closing = parenthesisCloseToOpen.has(args.char);
            if(closing){
                const matches = matchings.has(args.stackTop + args.char);
                if(!matches) return reject(`Not matching parenthesis '${args.stackTop}' and '${args.char}'.`);
                return ["S", "pop"]
            }
            if(!parenthesisOpenToClose.has(args.char)) return reject(`illegal character '${args.char}'.`);
            return ["S", {push:args.char}]
        }
    );
    it("1", ()=>{
        expect(matchingParenthesis.test("<{}{}[{{()}}]>()()")).toEqual(accept())
    })
    it("2", ()=>{
        expect(matchingParenthesis.test("<{}{}[{{)}}]>()()")).toEqual(reject("Not matching parenthesis '{' and ')'."))
    })
})