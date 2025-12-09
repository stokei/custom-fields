# Documentation

# Endpoints

## 1) Fields – definição dos campos (`Field`)

### 1.1 Criar campo

```http
POST /v1/fields
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>

Body:
{
  "context": "CUSTOMER",
  "group": "GENERAL",
  "key": "status",
  "label": "Status",
  "type": "SINGLE_SELECT",       // TEXT | TEXTAREA | RADIO | CHECKBOX | SINGLE_UPLOAD | MULTI_UPLOAD | SINGLE_SELECT | MULTI_SELECT
  "required": true,
  "minLength": null,
  "maxLength": null,
  "pattern": null,
  "placeholder": "Selecione um status",
  "comparator": "EQUALS",  // EQUALS | GREATER_THAN | GREATER_OR_EQUALS_THAN | LESS_THAN | LESS_OR_EQUALS_THAN
  "order": 10,
  "options": [
    { "value": "active", "label": "Ativo" },
    { "value": "inactive", "label": "Inativo" }
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
  x-api-key: <api-key>
  x-organization-id: <organizationId>
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
  x-api-key: <api-key>
  x-organization-id: <organizationId>

Body (campos opcionais):
{
  "label": "Status do Cliente",
  "required": false,
  "minLength": null,
  "maxLength": null,
  "pattern": null,
  "placeholder": "Escolha um status",
  "group": "STATUS",
  "order": 20
}
```

Resposta:

```json
{
  "id": "uuid-do-field"
}
```

### 1.4 Inativar um campo

```http
PATCH /v1/fields/{context}/{key}/deactivate
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>
```

Resposta:

```json
{
  "id": "uuid-do-field"
}
```

### 1.5 Ativar um campo

```http
PATCH /v1/fields/{context}/{key}/activate
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>
```

Resposta:

```json
{
  "id": "uuid-do-field"
}
```

## 2) Field options – Opções de um campo (`FieldOption`)

### 2.1 Adicionar opção em um campo

```http
POST /v1/fields/{context}/{key}/options
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>

Body:
{
  "label": "Minha label",
  "value": "value-da-option"
}
```

Resposta:

```json
{
  "value": "value-da-option"
}
```

### 2.2 Atualizar opção de um campo

```http
PATCH /v1/fields/{context}/{key}/options/{value}
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>

Body:
{
  "label": "Minha label"
}
```

Resposta:

```json
{
  "value": "value-da-option"
}
```

### 2.3 Inativar opção de um campo

```http
PATCH /v1/fields/{context}/{key}/options/{value}/deactivate
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>
```

Resposta:

```json
{
  "value": "value-da-option"
}
```

### 2.4 Ativar opção de um campo

```http
PATCH /v1/fields/{context}/{key}/options/{value}/activate
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>
```

Resposta:

```json
{
  "value": "value-da-option"
}
```

## 3) Values – valores de campos (`FieldValue`)

Aqui a ideia é: **guardar o valor de cada field para uma entidade do cliente**

### 3.1 Salvar/atualizar os valores de uma entidade

```http
PUT /v1/values/{context}/{entityId}
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>

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

### 3.2 Buscar valores de uma entidade

```http
GET /v1/values/{context}/{entityId}
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>
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


### 3.2 Comparar valores de Duas entidades

```http
GET /v1/values/{context}/compare/{entityIdA}/{entityIdB}
Headers:
  x-api-key: <api-key>
  x-organization-id: <organizationId>
```

Resposta:

```json
{
  "context": "CUSTOMER",
  "values": [
    {
      "key": "status",
      "comparator": "=",
      "value": {
        "a": ["active"],
        "b": ["active"]
      }
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
