import os
import re

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply semantic replacements
    replacements = [
        (r'bg-white/\[0\.05\]', 'bg-card border border-border'),
        (r'bg-white/\[0\.04\]', 'bg-muted border border-border'),
        (r'border-white/\[0\.12\]', 'border-border'),
        (r'border-white/\[0\.06\]', 'border-border'),
        (r'border-\[\#f0f0f0\]', 'border-border'),
        (r'text-white/60', 'text-muted-foreground'),
        (r'text-white/50', 'text-muted-foreground'),
        (r'text-white/40', 'text-muted-foreground'),
        (r'text-white/20', 'text-muted-foreground'),
        (r'"text-white"', '"text-foreground"'),
        (r'text-white ', 'text-foreground '),
        (r'bg-\[\#02030E\]', 'bg-background'),
        # Specific fixes
        (r'bg-\[\#2e3843\] px-4', 'bg-card border-b border-border px-4'),
        (r'text-\[\#d8dce2\]', 'text-muted-foreground'),
    ]

    new_content = content
    for old, new in replacements:
        new_content = re.sub(old, new, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

update_file(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\agency\page.tsx')
update_file(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\production\page.tsx')
update_file(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\talent\page.tsx')
update_file(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\page.tsx')

print("Done")
