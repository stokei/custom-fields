## Custom Fields

### CASO DE USO

Empresa Panamexico
Eu Panamexico (tenantId), crio a Organização Panamexico Filho (organizationId),
Eu Panamexico (tenantId), crio o grupo de Campos personalizados para a etapa
de "Informações pessoais" (groupId - details) para o serviço de Customers (context)

Contexto: CUSTOMER

Grupos:

- "Informações pessoais"
- "Endereço"
- "Preferências"
- "Dados fiscais"



Excelente pergunta — **context** e **group** resolvem **problemas diferentes** dentro do domínio de custom fields.

Vamos separar de forma clara e objetiva:

---

#### 🧩 1. O que é **context**?

##### ✔️ Context = “onde esse field pertence no sistema”

É a **entidade de negócio** à qual o campo pertence.
Define o **tipo de recurso** ao qual o campo será aplicado.

##### Exemplos reais:

* `CUSTOMER` (cliente)
* `USER` (usuário)
* `ORDER` (pedido)
* `PRODUCT` (produto)
* `INVOICE` (fatura)
* `COMPANY` (empresa)

##### Context responde:

> *"Esse campo é do quê?"*

##### Context separa *modelos de campos totalmente distintos*:

* Campos de cliente ≠ campos de pedido
* Campos de usuário ≠ campos de produto
* Campos de order items ≠ campos de invoices

##### Semântica:

* Níveis macro do sistema
* Modelos distintos
* Tabela lógica/abstração de entidade
* Mutuamente independentes

---

#### 🎛️ 2. O que é **group**?

##### ✔️ Group = organização visual ou lógica *dentro* de um context

Você usa group para **organizar campos dentro do mesmo contexto**.

É puramente:

* organizacional
* estrutural
* para UI ou fluxo lógico

##### Exemplo:

Contexto: `CUSTOMER`

Grupos:

* “Informações pessoais”
* “Endereço”
* “Preferências”
* “Dados fiscais”

##### Context: CUSTOMER

Campos:

* first_name
* last_name
* birth_date
* loyalty_level
* phone
* address_1
* address_2

##### Groups dentro do CUSTOMER:

* **General Info**

  * first_name
  * last_name
  * birth_date
* **Contact**

  * phone
* **Address**

  * address_1
  * address_2
* **Preferences**

  * loyalty_level

##### Context separou o modelo CUSTOMER de outros modelos.

##### Group organizou esses campos dentro do contexto.
