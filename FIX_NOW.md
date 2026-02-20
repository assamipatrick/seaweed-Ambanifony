# 🚨 CORRECTIF URGENT - Copier-coller ce SQL

## ❌ Erreur actuelle
```
Failed to load resource: the server responded with a status of 400
[Supabase Error - addSite]
```

**Cause** : Row Level Security (RLS) bloque l'insertion dans Supabase

---

## ✅ SOLUTION EN 3 ÉTAPES

### Étape 1 : Ouvrir Supabase SQL Editor

👉 **Cliquer ici** : https://kxujxjcuyfbvmzahyzcv.supabase.co/project/kxujxjcuyfbvmzahyzcv/editor/sql

(Ou aller manuellement : Dashboard Supabase → SQL Editor ⚡ → + New query)

---

### Étape 2 : Copier-coller ce SQL

```sql
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE farmers DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE seaweed_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE cultivation_cycles DISABLE ROW LEVEL SECURITY;

SELECT 
  tablename, 
  rowsecurity as rls_actif 
FROM pg_tables 
WHERE schemaname='public' 
  AND tablename IN ('sites','employees','farmers','seaweed_types')
ORDER BY tablename;
```

---

### Étape 3 : Cliquer sur "Run" (ou F5)

**Résultat attendu** :

| tablename | rls_actif |
|-----------|-----------|
| employees | **false** |
| farmers | **false** |
| seaweed_types | **false** |
| sites | **false** |

**Si `rls_actif = false`** → ✅ **C'EST BON !**

---

## 🧪 Tester que ça marche

1. **Recharger l'application** : Ctrl+Shift+R
   
2. **Ajouter un nouveau site** :
   - Nom : `Test Sync`
   - Code : `TEST-001`
   - Localisation : `Madagascar`

3. **Vérifier dans Supabase** :
   - Aller dans **Table Editor**
   - Ouvrir la table **sites**
   - Le site `Test Sync` doit apparaître ✅

---

## 📞 Si ça ne marche toujours pas

Copier le résultat de la requête SQL et me l'envoyer.

---

**Application** : https://3000-iw1hbfa3ilo0b15qntvdt-3844e1b6.sandbox.novita.ai
**Supabase** : https://kxujxjcuyfbvmzahyzcv.supabase.co
