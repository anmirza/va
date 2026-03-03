import os
import re

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r') as f:
        content = f.read()

    # Apply semantic replacements
    # General Backgrounds
    content = content.replace("bg-[#eef0f3]", "bg-background")
    content = content.replace("bg-white", "bg-card")
    content = content.replace("bg-[#2e3843]", "bg-card border-b border-border") 
    # Text Colors
    content = content.replace("text-white/60 hover:text-white", "text-muted-foreground hover:text-foreground")
    content = content.replace("text-white/40", "text-muted-foreground")
    content = content.replace("text-white font-medium", "text-foreground font-medium")
    content = content.replace("text-white", "text-foreground")
    content = content.replace("text-[#1a1a1a]", "text-foreground")
    content = content.replace("text-[#666]", "text-muted-foreground")
    # Filters & Elements
    content = content.replace("bg-[#f5d742] text-[#1a1a1a]", "bg-accent text-accent-foreground")
    content = content.replace("bg-white/20 text-white hover:bg-white/30", "bg-muted text-foreground hover:bg-muted/80")
    content = content.replace("bg-[#2e3843] text-white", "bg-accent text-accent-foreground")
    content = content.replace("bg-white text-[#666] hover:bg-[#d8dce2]", "bg-card text-muted-foreground hover:bg-muted border border-border")
    # Borders
    content = content.replace("border-[#d8dce2]", "border-border")
    
    # Adjust specific elements in detail page
    content = content.replace("from-[#2e3843] via-[#2e3843]/50", "from-background via-background/50")
    content = content.replace("bg-black/30", "bg-background/80")
    content = content.replace("text-white/80", "text-foreground/80")

    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated {filepath}")

update_file("app/production/page.tsx")
update_file("app/production/[id]/page.tsx")
