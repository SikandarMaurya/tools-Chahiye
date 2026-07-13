import re

with open('components/image-resizer-client.tsx', 'r') as f:
    content = f.read()

# 1. Update AI Smart Scale toggle (green/red)
ai_toggle_old = r"className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${aiMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}"
ai_toggle_new = r"className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${aiMode ? 'bg-green-500' : 'bg-red-500'}`}"
content = content.replace(ai_toggle_old, ai_toggle_new)

# 2. Update Lock Aspect Ratio button (green/red with borders)
lock_old = r"className={`p-1.5 rounded-md transition-colors ${lockAspectRatio ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}"
lock_new = r"className={`p-1.5 rounded-md transition-all border-2 focus:outline-none focus:ring-2 focus:ring-primary/50 ${lockAspectRatio ? 'bg-green-500/10 text-green-600 border-green-500 shadow-sm' : 'bg-red-500/10 text-red-500 border-red-200 dark:border-red-900/50 hover:bg-red-500/20'}`}"
content = content.replace(lock_old, lock_new)

# 3. Update Custom Width/Height Inputs
width_input_old = r'className="w-full p-2 bg-background border rounded-lg text-sm text-center"'
width_input_new = r'className="w-full p-2 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all dark:bg-muted/20 dark:text-foreground"'
content = content.replace(width_input_old, width_input_new)

# 4. Update Select elements
select_old = r'className="w-full p-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"'
select_new = r'className="w-full p-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all text-sm dark:bg-muted/20 dark:text-foreground"'
content = content.replace(select_old, select_new)

select_mb4_old = r'className="w-full p-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm mb-4"'
select_mb4_new = r'className="w-full p-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all text-sm mb-4 dark:bg-muted/20 dark:text-foreground"'
content = content.replace(select_mb4_old, select_mb4_new)

# Check if replacements were successful
if ai_toggle_new not in content:
    print("Warning: AI toggle replacement failed.")
if lock_new not in content:
    print("Warning: Lock aspect ratio replacement failed.")
if width_input_new not in content:
    print("Warning: Width input replacement failed.")
if select_new not in content:
    print("Warning: Select replacement failed.")
if select_mb4_new not in content:
    print("Warning: Select mb4 replacement failed.")


with open('components/image-resizer-client.tsx', 'w') as f:
    f.write(content)
