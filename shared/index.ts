export * from "./src/anotherFile";
export * from "./src/enum/statusCode.enum";
export * from "./src/dto/config.dto";
export * from "./src/dto/device.dto";
export * from "./src/dto/deviceType.dto";
export * from "./src/dto/error.dto";
export * from "./src/dto/runnerLog.dto";
export * from "./src/enum/runnerLogTypes.enum";

export function greet(name: string): string {
    return `Hello, ${name}! (from shared)`;
}
