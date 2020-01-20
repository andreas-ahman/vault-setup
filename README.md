# Vault Login

Install the dependencies

```bash
yarn install
```

Build the typescript

```bash
yarn build
```

## Usage

Login to vault with approle/secret and retrieve a token.

The token is saved to `.vault_token`

```yaml
- name: Login to Vault
  uses: andreas-ahman/vault-login
  with:
    url: https://vault.mycompany.fake
    namespace: my_own_namespace
    role_id: ${{ secrets.ROLE_ID }}
    secret_id: ${{ secrets.SECRET_ID }}
```
