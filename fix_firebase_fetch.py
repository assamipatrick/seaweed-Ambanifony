#!/usr/bin/env python3
"""
Fix all fetch* functions in firebaseService.ts to preserve original 'id' field.
This prevents overwriting the stored ID with Firebase keys.
"""

import re

# Read the file
with open('lib/firebaseService.ts', 'r') as f:
    content = f.read()

# Pattern to match fetch functions that overwrite id with Firebase key
# Example:
#   return Object.keys(data).map(key => ({
#     id: key,
#     ...data[key]
#   }));
pattern = r'return Object\.keys\(data\)\.map\(key => \(\{\s+id: key,\s+\.\.\.data\[key\]\s+\}\)\);'

# Replacement - preserve original id field if it exists
replacement = '''return Object.keys(data).map(key => {
        const item = data[key];
        // Preserve the original 'id' field if it exists, otherwise use Firebase key
        return item.id ? item : { id: key, ...item };
      });'''

# Replace all occurrences
new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Count replacements
original_count = len(re.findall(pattern, content, flags=re.MULTILINE))

print(f"✅ Fixed {original_count} fetch functions")

# Write back
with open('lib/firebaseService.ts', 'w') as f:
    f.write(new_content)

print("✅ firebaseService.ts updated successfully!")
