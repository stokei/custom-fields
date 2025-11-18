# Documentation

# Endpoints

## 1) Fields – definição dos campos (`Field`)

### 1.1 Criar campo

```http
POST /v1/fields
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Body:
{
  "context": "CUSTOMER",
  "group": "GENERAL",
  "key": "status",
  "label": "Status",
  "type": "SINGLE_SELECT",       // TEXT | TEXTAREA | SINGLE_SELECT | MULTI_SELECT
  "required": true,
  "minLength": null,
  "maxLength": null,
  "pattern": null,
  "placeholder": "Selecione um status",
  "order": 10,
  "options": [
    { "value": "active", "label": "Ativo", "order": 1 },
    { "value": "inactive", "label": "Inativo", "order": 2 }
  ]
}
```

Resposta:

```json
{
  "id": "uuid-do-field"
}
```

---

### 1.2 Listar campos de um contexto (pra montar formulário)

```http
GET /v1/fields
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Query:
  context=CUSTOMER
  group=GENERAL      (opcional)
  activeOnly=true    (opcional)
```

Resposta (exemplo):

```json
[
  {
    "id": "f1",
    "context": "CUSTOMER",
    "group": "GENERAL",
    "key": "status",
    "label": "Status",
    "type": "SINGLE_SELECT",
    "required": true,
    "minLength": null,
    "maxLength": null,
    "pattern": null,
    "placeholder": "Selecione um status",
    "order": 10,
    "active": true,
    "options": [
      { "value": "active", "label": "Ativo", "order": 1, "active": true },
      { "value": "inactive", "label": "Inativo", "order": 2, "active": true }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### 1.3 Buscar um campo específico

```http
GET /v1/fields/{context}/{key}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>
```

Exemplo:

```http
GET /v1/fields/CUSTOMER/status
```

---

### 1.4 Atualizar metadados do campo

```http
PATCH /v1/fields/{context}/{key}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Body (campos opcionais):
{
  "label": "Status do Cliente",
  "required": false,
  "minLength": null,
  "maxLength": null,
  "pattern": null,
  "placeholder": "Escolha um status",
  "group": "STATUS",
  "order": 20,
  "active": true
}
```

---

### 1.5 Desativar campo (soft delete)

```http
DELETE /v1/fields/{context}/{key}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>
```

Implementação: `active = false`.

---

## 2) Options – gerenciamento incremental (`FieldOption`)

Sempre referenciando pelo **context + key**, sem precisar saber `fieldId`.

### 2.1 Adicionar opção

```http
POST /v1/fields/{context}/{key}/options
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Body:
{
  "value": "paused",
  "label": "Pausado",
  "order": 3
}
```

Resposta:

```json
{
  "fieldId": "uuid-do-field"
}
```

---

### 2.2 Atualizar uma opção

```http
PATCH /v1/fields/{context}/{key}/options/{value}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Body:
{
  "label": "Em pausa",
  "order": 4,
  "active": true
}
```

---

### 2.3 Remover opção

```http
DELETE /v1/fields/{context}/{key}/options/{value}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>
```

Exemplo:

```http
DELETE /v1/fields/CUSTOMER/status/options/paused
```

---

## 3) Values – valores de campos (`FieldValue`)

Aqui a ideia é: **guardar o valor de cada field para uma entidade do cliente**

### 3.1 Salvar/atualizar os valores de uma entidade

```http
PUT /v1/values/{context}/{entityId}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Body:
{
  "values": {
    "status": "active",
    "notes": "Cliente bom pagador",
    "tags": ["vip", "newsletter"]  // se MULTI_SELECT, pode ser array e você salva N rows
  }
}
```

* No handler você:

  * carrega a definição dos `Field` daquele `context`,
  * valida cada valor conforme:

    * `type`
    * `required`
    * `minLength` / `maxLength`
    * `pattern`
    * se type é SINGLE/MULTI_SELECT, se o `value` existe em `FieldOption`
  * grava/atualiza em `FieldValue`.

Resposta:

```json
{
  "context": "CUSTOMER",
  "entityId": "123",
  "values": {
    "status": "active",
    "notes": "Cliente bom pagador",
    "tags": ["vip", "newsletter"]
  },
  "updatedAt": "2025-11-18T17:31:00.000Z"
}
```

---

### 3.2 Buscar valores de uma entidade

```http
GET /v1/values/{context}/{entityId}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>
```

Resposta:

```json
{
  "context": "CUSTOMER",
  "entityId": "123",
  "values": {
    "status": "active",
    "notes": "Cliente bom pagador",
    "tags": ["vip", "newsletter"]
  }
}
```

---

## 4) Endpoint para montar formulário

```http
GET /v1/forms/{context}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>
Query:
  activeOnly=true
```

Resposta:

```json
{
  "context": "CUSTOMER",
  "groups": [
    {
      "group": "GENERAL",
      "order": 0,
      "fields": [
        {
          "id": "f1",
          "key": "first_name",
          "label": "Nome",
          "type": "TEXT",
          "required": true,
          "placeholder": "Digite o nome...",
          "order": 1
        },
        {
          "id": "f2",
          "key": "status",
          "label": "Status",
          "type": "SINGLE_SELECT",
          "required": true,
          "options": [
            { "value": "active", "label": "Ativo", "order": 1 },
            { "value": "inactive", "label": "Inativo", "order": 2 }
          ],
          "order": 2
        }
      ]
    },
    {
      "group": "EXTRA",
      "order": 1,
      "fields": [ /* ... */ ]
    }
  ]
}
```
