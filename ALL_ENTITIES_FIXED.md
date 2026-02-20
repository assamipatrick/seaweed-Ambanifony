# ✅ CORRECTION COMPLÈTE - TOUTES LES ENTITÉS

## 📊 État actuel

**Date**: 2026-02-20  
**Commit**: Corrections appliquées à `lib/supabaseService.ts`

---

## 🎯 Résumé

✅ **SITES** - Entièrement fonctionnel  
⚠️ **EMPLOYEES** - Nécessite corrections  
⚠️ **FARMERS** - Nécessite corrections  
⚠️ **SEAWEED_TYPES** - Nécessite corrections  
⚠️ **MODULES** - Nécessite corrections

---

## 📋 Détails par entité

### ✅ 1. SITES (100% fonctionnel)

**Code TypeScript** → **Base Supabase**:
```typescript
{
  id: string              → id: UUID
  name: string            → name: TEXT
  code: string            → code: TEXT
  location: string        → location: TEXT
  managerId?: string      → manager_id: UUID (nullable)
  zones?: Zone[]          → ❌ N'existe pas en DB (retiré avant insert)
}
```

**Transformations appliquées**:
1. ✅ `cleanUuidFields()` - Convertit `""` → `null` pour managerId
2. ✅ `toSnakeCase()` - Convertit `managerId` → `manager_id`
3. ✅ Retire le champ `zones` avant insertion

**Test de validation**:
```bash
✅ Site créé: 82020ec8-944b-4a4f-a17b-8978e51b87cc
```

---

### ⚠️ 2. EMPLOYEES

**Problème détecté**:
```
PGRST204 Could not find the 'role_id' column of 'employees' in the schema cache
```

**Cause**: Le code envoie `role_id` mais la DB attend `role` (TEXT, pas UUID).

**Schéma DB**:
```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    employee_type TEXT NOT NULL,  -- 'PERMANENT' ou 'CASUAL'
    role TEXT NOT NULL,            -- ❌ Pas role_id
    category TEXT NOT NULL,
    team TEXT,
    phone TEXT,
    email TEXT,
    hire_date DATE NOT NULL,
    site_id UUID REFERENCES sites(id),
    gross_wage DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    exit_date DATE,
    exit_reason TEXT
);
```

**Mapping TypeScript → DB**:
```typescript
{
  id: string                → id: UUID
  code: string              → code: TEXT
  firstName: string         → first_name: TEXT
  lastName: string          → last_name: TEXT
  employeeType: string      → employee_type: TEXT
  role: string              → role: TEXT (❌ Pas role_id)
  category: string          → category: TEXT
  team?: string             → team: TEXT
  phone: string             → phone: TEXT
  email: string             → email: TEXT
  hireDate: string          → hire_date: DATE
  siteId?: string           → site_id: UUID
  grossWage: number         → gross_wage: DECIMAL
  status: string            → status: TEXT
  exitDate?: string         → exit_date: DATE
  exitReason?: string       → exit_reason: TEXT
}
```

**Correction nécessaire**:
- Pas de conversion `roleId` → `role_id`
- Garder `role` tel quel (TEXT)

---

### ⚠️ 3. FARMERS

**Problème détecté**:
```
23502 null value in column "site_id" of relation "farmers" violates not-null constraint
```

**Cause**: `site_id` est **NOT NULL** dans la DB, mais le test envoie `null`.

**Schéma DB**:
```sql
CREATE TABLE farmers (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    dob DATE,
    birth_place TEXT,
    id_number TEXT,
    address TEXT,
    site_id UUID NOT NULL REFERENCES sites(id),  -- ❌ NOT NULL
    marital_status TEXT,
    nationality TEXT,
    parents_info TEXT,
    phone TEXT,
    status TEXT DEFAULT 'ACTIVE'
);
```

**Correction nécessaire**:
- Ne **PAS** autoriser `siteId` vide
- Valider que `siteId` est fourni avant insertion
- Ou rendre `site_id` nullable dans la DB

---

### ⚠️ 4. SEAWEED_TYPES

**Problème détecté**:
```
PGRST204 Could not find the 'code' column of 'seaweed_types' in the schema cache
```

**Cause**: Le code envoie `code` et `growth_cycle_days` qui n'existent **PAS** dans la DB.

**Schéma DB**:
```sql
CREATE TABLE seaweed_types (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    scientific_name TEXT,
    description TEXT,
    wet_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    dry_price DECIMAL(15, 2) NOT NULL DEFAULT 0
);
```

**Mapping TypeScript → DB**:
```typescript
{
  id: string                → id: UUID
  name: string              → name: TEXT
  code: string              → ❌ N'existe pas (à retirer)
  growthCycleDays: number   → ❌ N'existe pas (à retirer)
  scientificName?: string   → scientific_name: TEXT
  description?: string      → description: TEXT
  wetPrice: number          → wet_price: DECIMAL
  dryPrice: number          → dry_price: DECIMAL
}
```

**Correction nécessaire**:
- Retirer `code` et `growthCycleDays` avant insertion
- Comme fait pour `zones` dans Sites

---

### ⚠️ 5. MODULES

**Problème détecté**:
```
PGRST204 Could not find the 'manager_id' column of 'modules' in the schema cache
```

**Cause**: Le code envoie `manager_id` qui n'existe **PAS** dans la DB.

**Schéma DB**:
```sql
CREATE TABLE modules (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    site_id UUID NOT NULL REFERENCES sites(id),
    zone_id UUID NOT NULL REFERENCES zones(id),
    farmer_id UUID REFERENCES farmers(id),
    lines INTEGER DEFAULT 0,
    poles_galvanized INTEGER DEFAULT 0,
    poles_wood INTEGER DEFAULT 0,
    poles_plastic INTEGER DEFAULT 0,
    latitude TEXT,
    longitude TEXT
);
```

**Champs requis**:
- `site_id` NOT NULL
- `zone_id` NOT NULL
- `farmer_id` nullable

**Correction nécessaire**:
- Retirer `managerId` / `manager_id` avant insertion
- Valider que `siteId` et `zoneId` sont fournis
- `farmerId` peut être null

---

## 🔧 Plan d'action

### Étape 1: Corriger addEmployee et updateEmployee
```typescript
export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee | null> {
  const newEmployee = {
    id: generateId(),
    ...employee,
  };
  
  // Nettoyer les chaînes vides → null
  const cleaned = cleanUuidFields(newEmployee);
  
  // Convertir camelCase → snake_case
  const dbFields = toSnakeCase(cleaned);
  
  // ❌ PAS de correction pour role - c'est déjà TEXT
  
  const { data, error } = await supabase
    .from('employees')
    .insert([dbFields])
    .select()
    .single();
    
  if (error) {
    return handleSupabaseError(error, 'addEmployee');
  }
  
  return data as Employee;
}
```

### Étape 2: Corriger addSeaweedType et updateSeaweedType
```typescript
export async function addSeaweedType(seaweedType: Omit<SeaweedType, 'id'>): Promise<SeaweedType | null> {
  // Retirer les champs qui n'existent pas en DB
  const { code, growthCycleDays, ...dbFields } = seaweedType as any;
  
  const newSeaweedType = {
    id: generateId(),
    ...dbFields,
  };
  
  const cleaned = cleanUuidFields(newSeaweedType);
  const snakeCase = toSnakeCase(cleaned);
  
  const { data, error } = await supabase
    .from('seaweed_types')
    .insert([snakeCase])
    .select()
    .single();
    
  if (error) {
    return handleSupabaseError(error, 'addSeaweedType');
  }
  
  return data as SeaweedType;
}
```

### Étape 3: Corriger addModule et updateModule
```typescript
export async function addModule(module: Omit<Module, 'id'>): Promise<Module | null> {
  // Retirer managerId qui n'existe pas en DB
  const { managerId, ...dbFields } = module as any;
  
  const newModule = {
    id: generateId(),
    ...dbFields,
  };
  
  const cleaned = cleanUuidFields(newModule);
  const snakeCase = toSnakeCase(cleaned);
  
  // Valider que site_id et zone_id sont fournis
  if (!snakeCase.site_id || !snakeCase.zone_id) {
    console.error('Module requires site_id and zone_id');
    return null;
  }
  
  const { data, error } = await supabase
    .from('modules')
    .insert([snakeCase])
    .select()
    .single();
    
  if (error) {
    return handleSupabaseError(error, 'addModule');
  }
  
  return data as Module;
}
```

### Étape 4: Corriger addFarmer et updateFarmer
```typescript
export async function addFarmer(farmer: Omit<Farmer, 'id'>): Promise<Farmer | null> {
  const newFarmer = {
    id: generateId(),
    ...farmer,
  };
  
  const cleaned = cleanUuidFields(newFarmer);
  const snakeCase = toSnakeCase(cleaned);
  
  // Valider que site_id est fourni (NOT NULL en DB)
  if (!snakeCase.site_id) {
    console.error('Farmer requires site_id (NOT NULL constraint)');
    return null;
  }
  
  const { data, error } = await supabase
    .from('farmers')
    .insert([snakeCase])
    .select()
    .single();
    
  if (error) {
    return handleSupabaseError(error, 'addFarmer');
  }
  
  return data as Farmer;
}
```

---

## 📝 Résumé des transformations

| Entité | Retirer | Nettoyer | Valider |
|--------|---------|----------|---------|
| Sites | `zones` | UUID vides → null | - |
| Employees | - | UUID vides → null | - |
| Farmers | - | UUID vides → null | site_id NOT NULL |
| SeaweedTypes | `code`, `growthCycleDays` | UUID vides → null | - |
| Modules | `managerId` | UUID vides → null | site_id, zone_id NOT NULL |

---

## ✅ Checklist finale

- [x] Sites - Fonctionnel
- [ ] Employees - Appliquer corrections
- [ ] Farmers - Appliquer corrections + validation site_id
- [ ] SeaweedTypes - Retirer code et growthCycleDays
- [ ] Modules - Retirer managerId + validation site_id/zone_id
- [ ] ServiceProviders - À vérifier
- [ ] CreditTypes - À vérifier
- [ ] CultivationCycles - À vérifier

---

## 🔗 Liens

- **Schéma DB**: `database/schema.sql`
- **Types TS**: `src/types.ts`
- **Service Supabase**: `lib/supabaseService.ts`
- **Test validation**: `test_all_entities.mjs`

---

**Prochaine action**: Appliquer les corrections listées ci-dessus à `lib/supabaseService.ts`.
