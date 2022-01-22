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
  let res = await axios(tokenReq);
  console.log(res.data);

  // let token = 'Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtbnExNWo4Y3AudXMuYXV0aDAuY29tLyJ9..DKL3XgbRoCFIphaU.YCiYos9qwyoMB6pmonjJ5pXpHRqoUtn_dKmQI-T5QyyrHa7Lm11FJodVKiL0Jy8cYzX0AfgiwTJ5XkC3hi0MunIPDWPjqcyb9Jw_nF4BPCCMJHUK32JeWDm5YPkg_TdHuNX4LRRJUa4PdgOrxN58dHeYJaHt6EHhMCOA7E5ESI7IGRep6p8wWX42_vkoPC-rWck63BI1CMB3QjtLh5Au-hBqrOEi7m-MPe3eN9hIaaO2dHTCYkOEXlzPaLcBhTqFFQBFXbdRrd43S0mqiHA6wTaKQnfqClPEvVPkKenxPd2pDWvgaLaWsPpHgS0QAZE_xEH9jju0vadB48oCElLyTek.cuoCYQjYr189PVi1L3gMSQ'


  /**
   * Now try to run the /greet api using the access token
   */
  const greetReq = {
    method: 'GET',
    url: 'http://localhost:3000/greet',
    headers: {
      authorization: `Bearer ${res.data.access_token}`,
      // authorization: token,
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
