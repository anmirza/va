import os
import re

def polish_tabs(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply semantic replacements
    replacements = [
        (r"'bg-\[\#2e3843\] text-white'", "'bg-secondary text-foreground shadow-sm'"),
        (r"'text-muted-foreground hover:text-white'", "'text-muted-foreground hover:bg-muted hover:text-foreground'"),
        (r"text-white/50 hover:text-white", "text-muted-foreground hover:bg-muted hover:text-foreground"),
        (r"'bg-\[\#2e3843\] text-foreground'", "'bg-secondary text-foreground shadow-sm'"),
        (r"'text-muted-foreground hover:text-foreground'", "'text-muted-foreground hover:bg-muted hover:text-foreground'"),
        (r"hover:text-white", "hover:text-foreground"),
        (r"text-white", "text-foreground"),
    ]

    new_content = content
    for old, new in replacements:
        new_content = re.sub(old, new, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Polished {filepath}")
    else:
        print(f"No changes for {filepath}")

polish_tabs(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\agency\page.tsx')
polish_tabs(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\production\page.tsx')
polish_tabs(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\talent\page.tsx')
polish_tabs(r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\dashboard\page.tsx')

print("Done")
