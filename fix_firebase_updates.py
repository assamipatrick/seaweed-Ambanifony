#!/usr/bin/env python3
"""
Fix all update* functions in firebaseService.ts to store complete objects including 'id'.
This prevents data loss when syncing from Firebase.
"""

import re

# Read the file
with open('lib/firebaseService.ts', 'r') as f:
    content = f.read()

# Pattern to match update functions that destructure id
# Example: const { id, ...updates } = site;
pattern = r'(export async function update\w+\([^)]+: (\w+)\): Promise<\2 \| null> \{\s+try \{\s+)const \{ id, \.\.\.updates \} = \w+;\s+(const \w+Ref = ref\(database, `[^`]+`\);\s+)await update\(\w+Ref, updates\);'

# Replacement - use set() with complete object instead of update() with partial object
def replacement(match):
    func_start = match.group(1)  # "export async function updateSite(site: Site)... try {"
    type_name = match.group(2).lower()  # "site" or "farmer" etc
    ref_line = match.group(3)     # "const siteRef = ref(...);"
    
    # Extract the parameter name from the function signature
    param_match = re.search(r'update\w+\((\w+):', func_start)
    param_name = param_match.group(1) if param_match else 'item'
    
    # Build replacement
    return f"{func_start}{ref_line}\n    // Store the complete object including the id\n    await set({param_name}Ref, {param_name});"

# Replace all occurrences
new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Count replacements
original_updates = len(re.findall(r'await update\(\w+Ref, updates\);', content))
new_sets = len(re.findall(r'// Store the complete object including the id\s+await set\(', new_content))

print(f"✅ Fixed {new_sets} update functions (found {original_updates} total)")

# Write back
with open('lib/firebaseService.ts', 'w') as f:
    f.write(new_content)

print("✅ firebaseService.ts updated successfully!")
