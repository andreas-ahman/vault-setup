"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
function vaultLogin(baseUrl, headers, roleId, secretId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = axios_1.default.create({
            headers,
            baseURL: baseUrl,
        });
        const url = '/v1/auth/approle/login';
        core.debug(`Logging in via ${baseUrl}${url}`);
        const res = yield client.post(url, { role_id: roleId, secret_id: secretId });
        core.debug('Token generated successfully');
        return res.data.auth.client_token;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const vaultToken = yield core.group('Login using approle', () => vaultLogin(url, headers, roleId, secretId));
            core.setSecret(vaultToken);
            core.info('Exporting VAULT env variables:');
            core.info(`VAULT_TOKEN: ${vaultToken}`);
            core.info(`VAULT_ADDR: ${url}`);
            core.info(`VAULT_NAMESPACE: ${namespace}`);
            core.exportVariable('VAULT_TOKEN', vaultToken);
            core.exportVariable('VAULT_ADDR', url);
            core.exportVariable('VAULT_NAMESPACE', namespace);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
