import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Replace the FAQ array mapping entirely
old_faq_pattern = r'\{\[\s*\{\s*q:\s*"Are all tools free to use\?".*?\}\)\)\}'
# Wait, let's use a simpler string replacement using a known bound.
start_idx = content.find('{[\n              {\n                q: "Are all tools free to use?"')
if start_idx == -1:
    start_idx = content.find('{[')

# It's better to just regex the whole array map structure.
pattern = r'\{\[\s*\{\s*q:\s*"Are all tools free to use\?".*?\}\)\)\}'

new_faq_content = """<FAQAccordion faqs={[
              { question: "Are all tools free to use?", answer: "Yes, the core functionality of all our tools is completely free. We may introduce premium features for heavy users in the future." },
              { question: "Do you store my uploaded files?", answer: "No. Most of our tools process data locally in your browser. For tools that require server processing, files are deleted immediately after." },
              { question: "How often are new tools added?", answer: "We add new tools weekly based on community requests and emerging technologies." }
            ]} />"""

# We'll just replace everything between `<div className="space-y-4">` and `</div>\n        </div>\n      </section>`
content = re.sub(
    r'<div className="space-y-4">.*?</div>\n        </div>\n      </section>',
    f'<div className="space-y-4">\n            {new_faq_content}\n          </div>\n        </div>\n      </section>',
    content,
    flags=re.DOTALL
)

with open('app/page.tsx', 'w') as f:
    f.write(content)
