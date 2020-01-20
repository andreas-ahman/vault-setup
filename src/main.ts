import * as core from '@actions/core';
import axios from 'axios';

async function vaultLogin(baseUrl: string, headers, roleId: string, secretId: string) {
  const client = axios.create({
    headers,
    baseURL: baseUrl,
  });
  const url = '/v1/auth/approle/login';
  core.debug(`Logging in via ${baseUrl}${url}`);
  const res = await client.post(url, { role_id: roleId, secret_id: secretId });
  core.debug('Token generated successfully');
  return res.data.auth.client_token;
}

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const roleId = core.getInput('role_id', { required: true });
    const secretId = core.getInput('secret_id', { required: true });
    const namespace = core.getInput('namespace', { required: false });

    core.debug('Loaded variables:');
    core.debug(`- url: ${url}`);
    core.debug(`- role_id: ${roleId}`);
    core.debug(`- secret_id: ${secretId}`);
    core.debug(`- namespace: ${namespace}`);

    const headers = {};
    if (namespace != null) {
      headers['X-Vault-Namespace'] = namespace;
    }
    const vaultToken = await core.group('Login using approle', () =>
      vaultLogin(url, headers, roleId, secretId),
    );
    core.exportVariable('VAULT_TOKEN', vaultToken);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
