def build_prompt(ticket, template, examples):
    # Convert template to plain English instructions instead of raw JSON
    template_text = "Follow this structure:\n"
    if "greeting" in template: template_text += f"- Start with: {template['greeting']}\n"
    if "opening" in template: template_text += f"- Opening: {template['opening']}\n"
    if "action_heading" in template: template_text += f"- Ask for details: {template['action_heading']}\n"
    if "closing" in template: template_text += f"- End with: {template['closing']}\n"

    # Format training examples safely
    examples_str = ""
    for ex in examples:
        examples_str += f"\nExample Ticket: {ex['description']}\nExample Perfect Response:\n{ex['response']}\n---\n"

    prompt = f"""You are a Senior Technical Support Engineer at DNIF SIEM. Your job is to write a highly professional, human-sounding first response to a Jira ticket.

STRICT RULES:
1. Output ONLY the plain text email/ticket response.
2. DO NOT output JSON. DO NOT use brackets {{ }}. 
3. DO NOT output literal "\\n" characters. Use actual line breaks to separate paragraphs.
4. Keep it concise (150-200 words).
5. Use DNIF terms naturally where appropriate.

{template_text}

PAST EXAMPLES TO LEARN FROM:{examples_str}

NEW TICKET DETAILS:
Type: {ticket['ticket_type']}
Priority: {ticket['priority']}
Customer: {ticket['customer_name']}
Title: {ticket['title']}
Description: {ticket['description']}

YOUR RESPONSE:
"""
    return prompt