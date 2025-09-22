import { myAutomation } from "src/demo";
import { HA } from "@ha";

const args = process.argv.slice(2);

await HA.connect({
    url: args[0],
    token: args[1],
});

HA.onConnect = myAutomation;
