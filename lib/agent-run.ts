// An illustrative run of the kind of agent Axonvia builds, told as the homepage story: it reads a request,
// checks the business's systems, acts, and hands off when a decision needs a person. The customer and staff
// names are invented, and the section says it is an example.

export type ChatLine = { from: 'customer' | 'agent' | 'system'; text: string }

export type RunStep = {
  time: string
  action: string
  detail: string
  title: string
  story: string
  /** Conversation lines that appear in the console at this step. */
  chat: ChatLine[]
  handoff?: boolean
}

export const RUN: RunStep[] = [
  {
    time: '09:14:02',
    action: 'Message received on WhatsApp',
    detail: '“Can I move Thursday’s appointment to Friday afternoon?”',
    title: 'A customer writes in',
    story: 'A message arrives on WhatsApp at 9:14. Nobody on your team has to see it first.',
    chat: [{ from: 'customer', text: 'Hi! Can I move Thursday’s appointment to Friday afternoon?' }],
  },
  {
    time: '09:14:03',
    action: 'Found the customer in the CRM',
    detail: 'Ayesha Khan, three previous bookings',
    title: 'It knows who is asking',
    story: 'The agent finds her in your CRM — Ayesha Khan, three previous bookings — so the reply starts from her history, not from zero.',
    chat: [],
  },
  {
    time: '09:14:04',
    action: 'Checked the calendar',
    detail: 'Friday 2:30 pm and 4:00 pm are free',
    title: 'It checks the real calendar',
    story: 'It reads your live calendar and finds two free slots on Friday afternoon: 2:30 and 4:00.',
    chat: [],
  },
  {
    time: '09:14:06',
    action: 'Replied with both times',
    detail: 'In the same WhatsApp conversation',
    title: 'It replies in the same thread',
    story: 'Both options go back in the WhatsApp conversation within seconds, in your business’s tone of voice.',
    chat: [{ from: 'agent', text: 'Of course, Ayesha. Friday has 2:30 pm or 4:00 pm free. Which suits you?' }],
  },
  {
    time: '09:15:40',
    action: 'Rebooked for Friday, 4:00 pm',
    detail: 'Calendar updated and confirmation sent',
    title: 'It does the booking',
    story: 'Ayesha picks 4:00. The agent moves the appointment, updates the calendar and sends a confirmation.',
    chat: [
      { from: 'customer', text: '4:00 please!' },
      { from: 'agent', text: 'Done — you’re booked for Friday at 4:00 pm. A confirmation is on its way.' },
    ],
  },
  {
    time: '09:15:41',
    action: 'Handed to Sara at the front desk',
    detail: 'A deposit refund needs a person’s approval',
    title: 'It knows when to hand over',
    story: 'She also asks about her deposit. Refunds need a person, so the agent passes the conversation to Sara at the front desk, with the full history attached.',
    chat: [
      { from: 'customer', text: 'Also, could I get my deposit back?' },
      { from: 'system', text: 'Handed to Sara (front desk) with the full conversation' },
    ],
    handoff: true,
  },
]
