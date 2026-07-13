import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Add FAQAccordion import
import_stmt = 'import { FAQAccordion } from "@/components/faq-accordion";\n'
if import_stmt not in content:
    content = content.replace('import { Suspense } from "react";', 'import { Suspense } from "react";\n' + import_stmt)

# Extract and replace FAQ mapping
old_faq_pattern = r'\{\[\s*\{\s*q:\s*"Are all tools free to use\?".*?\}\)\)\}'
new_faq_content = """<FAQAccordion faqs={[
              { question: "Are all tools free to use?", answer: "Yes, the core functionality of all our tools is completely free. We may introduce premium features for heavy users in the future." },
              { question: "Do you store my uploaded files?", answer: "No. Most of our tools process data locally in your browser. For tools that require server processing, files are deleted immediately after." },
              { question: "How often are new tools added?", answer: "We add new tools weekly based on community requests and emerging technologies." }
            ]} />"""

content = re.sub(old_faq_pattern, new_faq_content, content, flags=re.DOTALL)

with open('app/page.tsx', 'w') as f:
    f.write(content)
