import { describe, expect, it } from "vitest";
import { forEachCharInFile } from "../src/main";
import { D, f } from "vitest/dist/types-0373403c";
import * as process from "process";

type Terminal = {terminal:string};
type Nonterminal = string;
type Dot = {dot:true};
type Product = ReadonlyArray<Terminal | Dot | Nonterminal>


function isString(x:unknown):x is string {
    return typeof x === "string";
}

function T(s:string):Terminal{
    return {terminal:s}
}
function Dot():Dot{
    return {dot:true}
}

class DCFG {
    constructor(readonly startSymbol:string, readonly productionRules:Record<string, Product | Product[]>) {}
    get nonterminals(){
        return Object.keys(this.productionRules);
    }
    static normalizeProduct(p:Product | Product[]):Product[]{
        const fst = p[0]
        if(!fst) return [[]];
        if(Array.isArray(fst)) return p as Product[];
        return [p] as Product[];
    }

    get products(): Product[]{
        const values: (Product[] | Product)[] = Object.values(this.productionRules);
        return values.flatMap(DCFG.normalizeProduct);
    }
    get terminals(){
        return this.products.flatMap((p)=>p.filter((s) => !isString(s) && "terminal" in s))
    }

    closeUp(rule:string):DCFG{
        let newProducts:Product[] | Product = DCFG.normalizeProduct(this.productionRules[rule]).map((p) => [Dot(),...p]);
        if(newProducts.length === 1)  {
          newProducts = newProducts[0];
        }
        const newProductionRules = {...this.productionRules}
        newProductionRules[rule] = newProducts;
        return new DCFG(this.startSymbol, newProductionRules)
    }
}

const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
const upperLetters = lowerLetters.toUpperCase();
describe("1", ()=>{
    const jsonObjLang = new DCFG("S", {
        "S": [T("{"), "Mid-Entry" ,T("}")],
        "Start-Entry":[
            [],
            ["Mid-Entry"]
        ],
        "Mid-Entry": [
            ["String", T(":"), "String", T(","), "Mid-Entry"],
            ["End-Entry"]
        ],
        "End-Entry":["String", T(":"), "String"],
        "String": [T('"'), "Inner-String",T('"')],
        "Inner-String": [
            [],
            ...([...lowerLetters].map((l) => [T(l), "Inner-String"])),
            ...([...upperLetters].map((l) => [T(l), "Inner-String"]))
        ]
    })


    it("1", ()=>{
        expect(jsonObjLang.nonterminals).toEqual(["S", "Start-Entry","Mid-Entry","End-Entry", "String", "Inner-String"]);
        expect(jsonObjLang.terminals).toEqual(["{","}", ":",",", ":", '"','"',...lowerLetters, ...upperLetters].map(T))
    })

    it("2", ()=>{
        console.error(jsonObjLang.closeUp("S").productionRules)
        expect(jsonObjLang.closeUp("S").productionRules).toEqual(
            {
                "S": [Dot(),T("{"), "Mid-Entry" ,T("}")],
                "Start-Entry":[
                    [],
                    ["Mid-Entry"]
                ],
                "Mid-Entry": [
                    ["String", T(":"), "String", T(","), "Mid-Entry"],
                    ["End-Entry"]
                ],
                "End-Entry":["String", T(":"), "String"],
                "String": [T('"'), "Inner-String",T('"')],
                "Inner-String": [
                    [],
                    ...([...lowerLetters].map((l) => [T(l), "Inner-String"])),
                    ...([...upperLetters].map((l) => [T(l), "Inner-String"]))
                ]
            }
        )
    })
})