# Vault Setup

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

The token is saved and the following environment variables are set:
* VAULT_TOKEN
* VAULT_ADDR 
* VAULT_NAMESPACE

```yaml
- name: Setup Vault
  uses: andreas-ahman/vault-setup@master
  with:
    url: https://vault.mycompany.fake
    namespace: my_own_namespace
    role_id: ${{ secrets.ROLE_ID }}
    secret_id: ${{ secrets.SECRET_ID }}
- name: get gcp credentials
  uses: docker://vault:latest
  with:
    entrypoint: /bin/sh
    args: |
      -c "vault read -format=yaml /gcp/key/ikea-ice-ref-3 > vault.yaml"
```
