/* eslint-disable @typescript-eslint/camelcase */

import axios from '../../assets/ts/axios-config'

/**
 *
 */
export const getAuthUrl = () => axios.get('/apis/v1/api/auth/goto_auth_url?authType=1')

/**
 *
 * @param {string} mallId
 * @param {string} auth_code
 */
export const setAuthCode = (mallId: string, auth_code: string) => axios.get(`/apis/v1/api/auth/jump?mallId=${ mallId }&type=2&auth_code=${ auth_code }`)
