const bb = require("bluebird")

import { State, AccountEntity } from "../index";

const newState = new State();
const accountEntity = new AccountEntity(newState);


bb.try(async () => {
    await newState.initialize();
    await accountEntity.login("", "");
})
