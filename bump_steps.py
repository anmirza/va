import re

file_path = r'c:\Users\zainy\OneDrive\Desktop\FREELANCE\requisti-v0\app\signup\production\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("{ id: 4, label: 'Contacts' },", "{ id: 4, label: 'About' },\n  { id: 5, label: 'Contacts' },")
c = c.replace("{ id: 5, label: 'Social Media' },", "{ id: 6, label: 'Social Media' },")
c = c.replace("{ id: 6, label: 'Turnover & Clients' },", "{ id: 7, label: 'Turnover & Clients' },")
c = c.replace("{ id: 7, label: 'Competencies' },", "{ id: 8, label: 'Competencies' },")
c = c.replace("{ id: 8, label: 'Sectors' },", "{ id: 9, label: 'Sectors' },")
c = c.replace("{ id: 9, label: 'Post-Production' },", "{ id: 10, label: 'Post-Production' },")
c = c.replace("{ id: 10, label: 'People & Directors' },", "{ id: 11, label: 'People & Directors' },")
c = c.replace("{ id: 11, label: 'Awards & CSR' },", "{ id: 12, label: 'Awards & CSR' },")
c = c.replace("{ id: 12, label: 'About & AI' },", "{ id: 13, label: 'Governance & AI' },")
c = c.replace("{ id: 13, label: 'Attachments' },", "{ id: 14, label: 'Attachments' },")

for step in range(13, 3, -1):
    c = c.replace(f"step === {step}", f"step === {step + 1}")
    c = c.replace(f"STEP {step} —", f"STEP {step + 1} —")

c = c.replace("step < 13", "step < 14")
# The loop will have changed `step === 13 ? handleSubmit` to `step === 14 ? handleSubmit`. This is correct since step 14 is the new last step.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(c)

print('Done')
