const bb = require("bluebird")

import { State, AccountEntity, LiveBroadcast } from "../index";

const newState = new State();
const accountEntity = new AccountEntity(newState);
const liveBroadcast = new LiveBroadcast(newState);

bb.try(async () => {
    await newState.initialize();
    await accountEntity.login("", "");
    await bb.delay(2000);
    await liveBroadcast.create();
    await liveBroadcast.start(false);
    console.log("Waiting 10000");
    await bb.delay(10000);
    await liveBroadcast.stop();
});