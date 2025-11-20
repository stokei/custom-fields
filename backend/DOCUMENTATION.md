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

### 1.2 Listar campos de um contexto


```http
GET /v1/fields/{context}
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

---

### 1.3 Atualizar metadados do campo

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
  "active": true,
  "options": [
    // Quando tiver opções, mandar todas opções
    // Quando for array vazio, serão apagadas todas opções
    {
      "value": "",
      "label": "",
      "active": false
    }
  ]
}
```

## 2) Values – valores de campos (`FieldValue`)

Aqui a ideia é: **guardar o valor de cada field para uma entidade do cliente**

### 2.1 Salvar/atualizar os valores de uma entidade

```http
PUT /v1/values/{context}/{entityId}
Headers:
  X-Tenant-Id: <tenantId>
  X-Org-Id: <organizationId>

Body:
{
  "values": [
    {
      "key": "status",
      "value": ["active"]
    },
    {
      "key": "notes",
      "value": ["Cliente bom pagador"]
    },
    {
      "key": "tags",
      "value": ["vip", "newsletter"]
    }
  ]
}
```

Resposta:

```json
{
  "context": "CUSTOMER",
  "entityId": "123",
  "values": [
    {
      "key": "status",
      "value": ["active"]
    },
    {
      "key": "notes",
      "value": ["Cliente bom pagador"]
    },
    {
      "key": "tags",
      "value": ["vip", "newsletter"]
    }
  ],
  "updatedAt": "2025-11-18T17:31:00.000Z"
}
```

---

### 2.2 Buscar valores de uma entidade

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
  "values": [
    {
      "key": "status",
      "value": ["active"]
    },
    {
      "key": "notes",
      "value": ["Cliente bom pagador"]
    },
    {
      "key": "tags",
      "value": ["vip", "newsletter"]
    }
  ]
}
```
