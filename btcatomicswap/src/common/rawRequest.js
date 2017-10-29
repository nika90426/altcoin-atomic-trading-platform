const axios = require('axios');
import {configuration} from '../config/config';

const url =
  configuration.protocol + '://' +
  configuration.user + ':' +
  configuration.pass + '@' +
  configuration.host + ':' +
  configuration.port;

export const getRawChangeAddress = async () => {
  const data = {
    "method": "getrawchangeaddress",
    "rpcuser": configuration.user,
    "rpcpassword": configuration.pass,
  };
  try {
    const response = await axios.post(
      url,
      data,
    );
    return response.data.result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 *
 * @param tx
 * @param feePerKb
 * @returns fundedTransaction, fee
 */
export const fundRawTransaction = async (tx, feePerKb,) => {
  return await axios.post(
    url,
    {
      "rpcuser": configuration.user,
      "rpcpassword": configuration.pass,
      "method": "fundrawtransaction",
      "params": [
        tx,
        {"feeRate": feePerKb},
      ],
    },
  );
};


export const estimateFee = async () => {
  return await axios.post(
    url,
    {
      "rpcuser": configuration.user,
      "rpcpassword": configuration.pass,
      "method": "estimatefee",
      "params": [6],
    },
  );
};