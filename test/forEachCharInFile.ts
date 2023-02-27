import { describe, expect, it } from "vitest";
import { forEachCharInFile } from "../src/ForEachCharInFile";
import * as fs from "fs/promises";

describe("forEachCharInFile", ()=>{
    it("should do the same as forEach", async ()=>{
        const  path = "test/testInput.csv";
        let  myResult = "";
        await forEachCharInFile(path, (char)=>{
            myResult += char;
            return "continue";
        })

        let originalResult = ""
        const content = await fs.readFile(path, "utf-8");
        [...content].forEach((char)=>{
            originalResult += char;
        })

        expect(myResult).toEqual(originalResult);
    })
})