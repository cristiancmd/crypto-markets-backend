var axios = require('axios');

/**
 * Please add `auth0-secret.json` for your credentials
 * @example
 * ```json
 * {
 * "client_id": "{CLIENT_ID}",
 * "client_secret": "{CLIENT_SECRET}",
 * "audience": "http://localhost:3000/ping"
 * }
 * ```
 */
const secrets = require('./auth0-secret');

/**
 * Request an access token using client credentials
 */
const tokenReq = {
  method: 'POST',
  url: 'https://dev-nq15j8cp.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  responseType: 'json',
  data: {
    ...secrets,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    grant_type: 'client_credentials'

  },
};

async function main() {
  // let res = await axios(tokenReq);
  // console.log(res.data);

  let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRVMkVObHN1TnR2UkdrUWNXdkpaVyJ9.eyJpc3MiOiJodHRwczovL2Rldi1ucTE1ajhjcC51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjFlOWIzZDhiMTM5MmUwMDY5OWJhZTFjIiwiYXVkIjpbInRlc3QtYXBpLWlhdyIsImh0dHBzOi8vZGV2LW5xMTVqOGNwLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDI4MjI3NTEsImV4cCI6MTY0MjkwOTE1MSwiYXpwIjoiM0JBdWR2bE9XVkJ2dGdpUFhnSWJsTGh0ek9SS1o2VDgiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOltdfQ.OKhSa9zJohCyLFS__nKGpggD4YveL9sSi_TMVMYpQfT8O98Q4R_Fix4Ue7hr8ctlq72PkrL_elfrE31b_66eVywK3a2x22E2DnESXpEGZ0JJiVG_4VwHOqgQgJjlqZ5IkhFmnydSUdqixcxbR4fmidNpEoBsqeTIQNTqNge_dpYYGMW4CCGdkG258WpoLvw8o-bt11aF5_v8IZXB_taB1l0jwA15hXtxm9YCKcFBSBF69VpYi1-NcA8zD4TdTkZpMh5M6KezH_HoPheefzIDIfWbF84dg0XlqmVBulIXP6uk8VvZpdct2Kt4yHTlTQiBoUCngw8LW1TrbBc6g-P2-A'


  /**
   * Now try to run the /greet api using the access token
   */
  const greetReq = {
    method: 'GET',
    url: 'http://localhost:3000/greet',
    headers: {
      // authorization: `Bearer ${res.data.access_token}`,
      authorization: token,
    },
  };

  res = await axios(greetReq);
  console.log('----------------')
  console.log(res.data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
