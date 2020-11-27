//#region > Imports
//> Express
// Node.js Framework used to build web applications and APIs
const express = require("express");

//> Additional
// JSON Web Token handler
const jwt = require("jsonwebtoken");
// Express JSON Web Token handler
const exjwt = require("express-jwt");
const config = require("../config");
const router = express.Router();
const sec1 = process.env.AUTH_SEC1;
const sec2 = process.env.AUTH_SEC2;

router.jwtMW = exjwt({
  secret: sec1,
});

function checkRefreshToken(refreshToken) {
  try {
    return jwt.verify(refreshToken, sec2);
  } catch (err) {
    return null;
  }
}

router.post("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "POST");
  if (req.body.hasOwnProperty("refreshToken")) {
    // check if user uses refresh token
    const token = checkRefreshToken(req.body.refreshToken);

    if (token != null) {
      const newToken = jwt.sign(
        { id: token.id, username: token.username },
        sec1,
        { expiresIn: config.durationToken }
      );

      res.status(200).send({
        success: true,
        err: null,
        token: newToken,
        refreshToken: null,
      });
    } else {
      res.status(401).send({
        success: false,
        token: null,
        err: "The refresh token provided is incorrect",
      });
    }
  } else {
    // if not refresh token use username and password
    const { username, password } = req.body;
    if (
      username == process.env.AUTH_USERNAME &&
      password == process.env.AUTH_PASSWORD
    ) {
      const token = jwt.sign({ id: user.id, username: user.username }, sec1, {
        expiresIn: config.durationToken,
      });

      const refreshToken = jwt.sign(
        { id: user.id, username: user.username },
        sec2,
        { expiresIn: config.durationRefreshToken }
      );

      res.status(200).send({
        success: true,
        err: null,
        token,
        refreshToken,
      });

      break;
    } else {
      res.status(401).send({
        success: false,
        token: null,
        err: "Username or password is incorrect",
      });
    }
  }
});

//#region > Exports
module.exports = router;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
