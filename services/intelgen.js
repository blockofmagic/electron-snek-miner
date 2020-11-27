//#region > Imports
// Request is designed to be the simplest way possible to make http calls
const request = require("request");
const INTEL_SNEK = require("snek-intel/lib/utils/snek").default;

const { SnekClient } = require("snek-client");

const CLIENT_SNEK = new SnekClient("https://engine.snek.at/graphql");

INTEL_SNEK.client = CLIENT_SNEK;
//#endregion

//#region > Functions
async function* fetchProfile() {
  while (true) {
    const auth = await CLIENT_SNEK.session.begin({
      username: process.env.SNEK_USERNAME,
      password: process.env.SNEK_PASSWORD,
    });

    const users = await INTEL_SNEK.person.allBrief();

    for (const index in users) {
      const personName = users[index].slug.split("-")[1];

      const generatedData = await INTEL_SNEK.person.processProfiles({
        personName,
      });

      yield { personName, content: JSON.stringify(generatedData) };
    }
  }
}

//#endregion

//#region > Exports
module.exports.fetchProfile = fetchProfile;
//#endregionnpm

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
