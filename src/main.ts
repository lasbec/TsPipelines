import * as fs from "fs";
import { Writable } from "stream";

/**
 * Using streams to make reading a file more space efficient.
 * @param path
 * @param fn
 */
export function forEachCharInFile(
    path: string,
    fn: (char: string, indices: { line: number; char: number; totalIndex: number }) => "continue" | "stop iteration"
): Promise<void> {
    return new Promise((resolve) => {
        let totalCount = 0;
        let lineCount = 0;
        let charCount = 0;
        let inProgress = true;
        fs.createReadStream(path).pipe(
            new Writable({
                decodeStrings: true,
                final() {
                    resolve();
                },
                write(chunk: Buffer, encoding, callback) {
                    if (inProgress) {
                        const chunkStr = chunk.toString();
                        for (const char of chunkStr) {
                            if (inProgress) {
                                const result = fn(char, { line: lineCount, char: charCount, totalIndex: totalCount });
                                if (result === "stop iteration") {
                                    inProgress = false;
                                    resolve();
                                }
                                totalCount += 1;
                                charCount += 1;
                                if (char === "\n") {
                                    lineCount += 1;
                                    charCount = 0;
                                }
                            }
                        }
                        callback();
                    }
                },
            })
        );
    });
}