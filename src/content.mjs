export const services = [
  {
    slug: 'ai-agents',
    title: 'AI Agents',
    summary: 'Task-focused assistants for qualification, support, and internal knowledge, with clear human handoffs.',
    question: 'Can an AI agent help our team without taking decisions out of our hands?',
    answer: 'An AI agent can assist with a defined workflow while your team retains approval over consequential actions. We scope what it may read, suggest, and do, using existing models rather than building or training foundation models. Illustrative example, not completed client work: an internal assistant could draft an answer from approved policy documents, cite its sources, and refer uncertain questions to a staff member. A pilot would test accuracy, permissions, and escalation before wider use; availability and delivery capacity require confirmation.',
    problem: 'Staff repeatedly answer the same questions or collect the same information, but an unrestricted assistant would introduce errors, privacy risks, and unclear accountability.',
    audience: 'Established small and medium businesses with a repeatable task, an accountable workflow owner, and approved information that can be used safely.',
    examples: [
      'Illustrative example, not a client result: a qualification assistant gathers agreed lead details and prepares a sales handoff without promising eligibility or making commitments.',
      'Illustrative example, not a client result: a support assistant drafts replies from approved documentation and escalates missing or conflicting information.',
      'Illustrative example, not a client result: an internal knowledge assistant retrieves relevant procedures while respecting the employee’s access permissions.'
    ],
    deliverables: [
      'Understand: define the task, success checks, permitted actions, data boundaries, and human escalation rules.',
      'Build: configure an assistant using an existing model, approved knowledge sources, and agreed tool access; test representative and failure cases.',
      'Connect: implement only the approved system connections and approval gates, subject to technical feasibility.',
      'Support: provide operating notes, known limitations, and a handover; ongoing monitoring and changes require an agreed support scope.'
    ],
    exclusions: [
      'Building or training foundation models; model research or unlimited model customisation.',
      'Unsupervised high-impact decisions, guaranteed accuracy, or replacing accountable professional judgement.',
      'An immediately available voice-agent product, unrestricted access to business records, or unscoped integrations.',
      'Third-party subscriptions, usage charges, and ongoing support unless explicitly included in the approved proposal.'
    ],
    inputs: [
      'A workflow owner, examples of questions or tasks, and clear acceptance criteria.',
      'Approved source documents, data-use permission, and a classification of personal or confidential information.',
      'Securely provisioned, least-privilege access through an agreed channel; never passwords or API keys in an enquiry.',
      'Staff available to review outputs, test edge cases, and approve escalation and retention rules.'
    ],
    integrations: 'Connections to knowledge stores, help desks, or lead systems are assessed individually. API availability, permissions, rate limits, provider data handling, and logging restrictions must be checked before support for any vendor is promised. Sensitive actions should require approval, and test data should be minimised.',
    support: 'Agent behaviour can change when source documents, tools, or model providers change. An agreed arrangement can cover evaluation checks, document refreshes, incident triage, and scoped improvements. Coverage hours, response expectations, usage costs, and ownership of escalations must be written down; no uptime or accuracy guarantee is implied.',
    faqs: [
      { q: 'How much does an AI agent project cost?', a: 'Prices are pending founder approval; no numerical price or purchasable package is published yet. A scoped proposal must identify currency, taxes, included workflows, model usage, third-party charges, recurring fees, and exclusions. Data preparation, integrations, and evaluation needs affect the quote. Pricing approval is required before public launch of this service page.' },
      { q: 'How long does an agent take to implement?', a: 'A delivery estimate follows workflow and data review. Source quality, access approvals, integration feasibility, evaluation, and staff review determine the schedule. A limited pilot and acceptance checks should precede broader deployment; no universal turnaround is promised.' },
      { q: 'Can the agent use confidential business information?', a: 'Only information approved for the scoped use should be connected. We must agree permissions, provider data handling, retention, and logging before implementation. Access controls and human review reduce risk but do not eliminate it; unsuitable data should remain outside the agent.' },
      { q: 'What support is available after launch?', a: 'Ongoing evaluation, knowledge updates, and maintenance can be scoped separately. The agreement must define coverage, response expectations, change limits, and responsibility for provider issues. An agent is not a promise of continuous availability or error-free answers.' }
    ]
  },
  {
    slug: 'automation-integrations',
    title: 'Automation & Integrations',
    summary: 'Connect existing tools and reduce repetitive handoffs without losing visibility into exceptions.',
    question: 'How can we stop copying information between business tools?',
    answer: 'A scoped automation can move agreed information between compatible tools and route exceptions to a person. We first map the trigger, data ownership, validation, and failure handling rather than automating a broken process. Illustrative example, not completed client work: an approved enquiry could create a lead record, notify its owner, and queue incomplete submissions for review. Whether that workflow is feasible depends on your systems’ access and integration capabilities.',
    problem: 'Manual re-entry, missed notifications, and inconsistent records slow down routine work, while fragile scripts can fail silently or duplicate transactions.',
    audience: 'Established small and medium businesses with repeatable cross-tool workflows, identifiable system owners, and rules that can be documented.',
    examples: [
      'Illustrative example, not a client result: validated website enquiries create lead records and notify a responsible person, with duplicates held for review.',
      'Illustrative example, not a client result: an approved order generates an operations task and status update without bypassing finance approval.',
      'Illustrative example, not a client result: a scheduled reconciliation flags missing records for staff instead of silently overwriting conflicting information.'
    ],
    deliverables: [
      'Understand: map the current handoff, authoritative records, exception rules, and acceptance criteria.',
      'Build: implement agreed triggers, transformations, validation, duplicate protection, and failure handling.',
      'Connect: configure approved endpoints and restricted access, then test normal, duplicate, delayed, and failed events.',
      'Support: hand over workflow documentation and recovery instructions; agree any ongoing monitoring or change work separately.'
    ],
    exclusions: [
      'Building or training foundation models, replacing entire business platforms, or unlimited workflow redesign.',
      'Connections to every vendor, unsupported scraping, bypassing access restrictions, or guaranteed third-party availability.',
      'Unapproved financial transactions, bulk data cleanup, and historical migrations unless explicitly scoped.',
      'Third-party licences, usage charges, and ongoing monitoring unless included in the approved proposal.'
    ],
    inputs: [
      'Workflow diagrams or representative records, business rules, and owners for each connected system.',
      'Approved test records with unnecessary personal information removed.',
      'API or integration documentation, account permissions, and securely provisioned least-privilege credentials.',
      'Decisions on duplicate handling, retries, retention, notification recipients, and who resolves exceptions.'
    ],
    integrations: 'Feasibility depends on supported APIs, webhooks or authorised export methods, account permissions, field mappings, and rate limits. Vendor compatibility is not assumed. Secrets should remain server-side, logs should avoid sensitive payloads, and retry behaviour must not create duplicate side effects.',
    support: 'Connected workflows need an owner when credentials expire, records change, or an upstream service fails. A support agreement can define alert review, recovery, connector maintenance, and change requests. Monitoring is not continuous unless explicitly agreed; response expectations and provider dependencies must be stated.',
    faqs: [
      { q: 'What does an automation project cost?', a: 'Prices are pending founder approval. The quote depends on workflow count, connector feasibility, data transformations, failure handling, and testing. An approved proposal must state currency, taxes, implementation scope, third-party subscriptions or usage charges, and recurring maintenance fees. Approved pricing is a prerequisite for this service page’s public launch.' },
      { q: 'How long does it take to connect our tools?', a: 'The schedule is estimated after reviewing access, interfaces, field mappings, and exception rules. Account approvals and unavailable test environments can delay work. Delivery should include failure and duplicate-event tests, not just a successful first run.' },
      { q: 'Can you connect any software we already use?', a: 'Not every system offers a suitable integration route. We assess documentation, account permissions, and authorised interfaces before committing. If a safe, maintainable connection is unavailable, the scope should change rather than rely on an unsupported workaround.' },
      { q: 'Who fixes a workflow when a connection breaks?', a: 'Responsibility must be assigned in the handover or support agreement. Scoped support can cover triage and connector maintenance; vendor outages, new requirements, and major platform changes may require separate work. Coverage and response expectations are agreed, not assumed.' }
    ]
  },
  {
    slug: 'websites',
    title: 'Websites',
    summary: 'Clear business websites and landing pages with usable enquiry paths and scoped operational connections.',
    question: 'What should a business website do beyond looking good?',
    answer: 'A business website should explain your offer clearly and give visitors a dependable way to enquire. We scope the content, navigation, accessible interaction, and submission path around that purpose. Illustrative example, not completed client work: a service business could publish distinct service pages and send validated enquiries to an approved inbox or lead system, with a usable fallback if enhancement scripts fail. A new site does not guarantee traffic, search rankings, or sales.',
    problem: 'Visitors cannot quickly understand the offer, mobile pages are awkward, or contact forms appear to succeed without delivering an enquiry to the right person.',
    audience: 'Established small and medium businesses that need a credible marketing site, a focused landing page, or a clearer enquiry journey.',
    examples: [
      'Illustrative example, not a client result: a service-company website explains each engagement and routes enquiries to a designated business owner.',
      'Illustrative example, not a client result: a campaign landing page presents one offer and measures successful form submissions without logging message contents.',
      'Illustrative example, not a client result: a content-led site gives staff an agreed editing workflow and provides crawlable service information.'
    ],
    deliverables: [
      'Understand: agree audiences, page inventory, content ownership, enquiry destination, and acceptance checks.',
      'Build: create the scoped page layouts and responsive implementation with accessible navigation and meaningful initial HTML.',
      'Connect: implement and test the agreed server-side enquiry route, including validation, success and failure handling, and appropriate spam controls.',
      'Support: provide deployment and editing notes; define hosting ownership and any maintenance arrangement before handover.'
    ],
    exclusions: [
      'Building or training foundation models; full business applications or ecommerce systems unless separately scoped.',
      'Guaranteed rankings, indexing, traffic, conversion rates, or generated testimonials and client evidence.',
      'Legal advice, policy approval, brand photography, and unlimited copy or design revisions.',
      'Domains, hosting, paid tools, ongoing content work, and maintenance unless expressly included.'
    ],
    inputs: [
      'Approved business facts, service information, brand assets, and permission to use supplied photographs or other materials.',
      'A content approver, page priorities, and real contact details and enquiry destination.',
      'Approved privacy and legal wording reflecting actual data practices.',
      'Securely provisioned domain, hosting, and integration access, plus a decision on analytics and consent requirements.'
    ],
    integrations: 'Inbox delivery, lead systems, content editing, and privacy-appropriate analytics are considered only within an approved scope. Provider feasibility and account permissions must be verified. Form credentials remain server-side, submitted messages must not enter analytics, and successful delivery must be tested rather than simulated.',
    support: 'Agree who owns hosting, renewals, updates, backups where applicable, and enquiry-delivery checks. Ongoing support can cover scoped fixes and content changes, but new pages, redesigns, and provider changes are not automatically included. Accessibility and security need continued attention as content and dependencies change.',
    faqs: [
      { q: 'How much will our website cost?', a: 'Prices are pending founder approval. Page count, content readiness, editing needs, design scope, and integrations affect the quote. Approved pricing must state currency, taxes, revision limits, hosting and domain exclusions, paid tools, and any recurring support fees before this service page launches publicly.' },
      { q: 'When can the website go live?', a: 'A delivery estimate follows agreement on pages, content, hosting, and integrations. Missing assets or delayed approvals affect timing. Launch should wait for real form-delivery tests, accessibility checks, and approved business and policy information; no fixed turnaround is promised.' },
      { q: 'Will we be able to edit the website ourselves?', a: 'An editing workflow can be included if it is part of the agreed scope. We should decide which content staff need to change, who can publish, and whether a content management system is justified. Training and permissions must be specified rather than assumed.' },
      { q: 'What happens after the website launches?', a: 'The handover should identify hosting ownership, renewal responsibilities, and how issues are reported. Maintenance and content updates can be covered by an agreed arrangement with defined coverage and response expectations. Search performance and uninterrupted third-party services are not guaranteed.' }
    ]
  },
  {
    slug: 'ai-consulting',
    title: 'AI Consulting',
    summary: 'Assess where AI is useful, where simpler automation is better, and what a responsible first project needs.',
    question: 'Where should our business start with AI?',
    answer: 'Start with a specific business bottleneck and check whether AI is actually the right tool for it. Consulting compares candidate workflows against data readiness, risk, integration needs, and staff ownership before recommending an implementation path. Illustrative example, not completed client work: a business reviewing incoming requests might find that fixed routing rules solve one step while an AI-assisted draft needs human review. A recommendation can be to use simpler automation or not proceed.',
    problem: 'Teams face broad AI promises but lack a clear use case, realistic dependencies, or a way to distinguish a useful pilot from an expensive distraction.',
    audience: 'Established small and medium businesses evaluating AI investment, reviewing a proposed pilot, or seeking a prioritised plan before commissioning implementation.',
    examples: [
      'Illustrative example, not a client result: a workflow review compares rule-based routing with AI-assisted request classification and documents their limits.',
      'Illustrative example, not a client result: a knowledge-assistant assessment identifies missing permissions and outdated documents before a pilot is commissioned.',
      'Illustrative example, not a client result: a pilot brief defines test cases, staff review, and stop criteria for an AI-assisted drafting workflow.'
    ],
    deliverables: [
      'Understand: review agreed workflows, interview designated stakeholders, and document the current problem and constraints.',
      'Build: produce an assessment of candidate approaches, risks, data gaps, and evidence needed for a decision; implementation is not implied.',
      'Connect: map likely integration dependencies, permissions, and system ownership for the recommended approach.',
      'Support: hand over a prioritised roadmap or pilot brief with acceptance and review criteria; follow-up advisory work requires an agreed scope.'
    ],
    exclusions: [
      'Building or training foundation models, production implementation, or full platform procurement unless separately commissioned.',
      'Legal advice, regulatory certification, formal security assurance, or guaranteed return on investment.',
      'Vendor endorsements, invented benchmark results, or recommendations based on unverified compatibility.',
      'Unlimited workshops, ongoing advisory access, or operational support outside the approved engagement.'
    ],
    inputs: [
      'A business sponsor, workflow owners, and an agreed decision the assessment should support.',
      'Representative process documentation, existing tools, pain points, and available evidence rather than assumed savings.',
      'Data classifications, constraints on provider use, and security or legal requirements from the appropriate owners.',
      'Approved, minimised examples and stakeholder time; production credentials are not needed for a discussion-only assessment.'
    ],
    integrations: 'Consulting identifies dependencies rather than promising working connections. We review available documentation, access constraints, data flows, and ownership; any technical feasibility test must be explicitly scoped. Provider compatibility, retention terms, and security requirements need verification before an implementation commitment.',
    support: 'The engagement can include an agreed review of the roadmap or pilot findings. It is not an ongoing help desk or production monitoring service. Define follow-up sessions, document revisions, and ownership of implementation decisions in the proposal; specialist legal or security review may still be required.',
    faqs: [
      { q: 'What does an AI consulting engagement cost?', a: 'Prices are pending founder approval. The fee depends on the number of workflows, stakeholder sessions, assessment depth, and required outputs. An approved proposal must state currency, taxes, included reviews, exclusions, and any third-party or follow-up costs. Founder-approved pricing is required before public launch of this service page.' },
      { q: 'How long does an assessment take?', a: 'Timing depends on the agreed questions, access to workflow owners, and quality of the available information. A schedule is proposed after scoping. Technical experiments or additional stakeholder reviews can change the timeline and must be agreed.' },
      { q: 'Will you recommend AI for every workflow?', a: 'No. A rules-based automation, improved process, or no change may be more appropriate. Recommendations should explain assumptions, risks, and missing evidence instead of treating AI adoption as the goal.' },
      { q: 'Does consulting include implementation or ongoing support?', a: 'Not by default. Consulting delivers the agreed assessment and plan. A pilot, production build, follow-up advice, or managed support needs a separate or explicitly included scope with its own acceptance criteria and responsibilities.' }
    ]
  },
  {
    slug: 'managed-support',
    title: 'Managed Support',
    summary: 'Scoped maintenance, issue triage, and improvements for systems with clear operational ownership.',
    question: 'Who will look after our systems once the project is delivered?',
    answer: 'An agreed managed-support arrangement can assign maintenance and issue-triage responsibilities for named systems. We review the system, access, documentation, and existing risks before defining coverage. Illustrative example, not completed client work: support for a lead workflow could include checking agreed failure alerts, investigating a broken connection, and documenting a recovery path. That is not a blanket promise of round-the-clock monitoring, immediate fixes, or uninterrupted service.',
    problem: 'After launch, ownership is unclear: credentials expire, dependencies change, errors go unnoticed, and small improvements compete with daily operations.',
    audience: 'Established small and medium businesses that need a defined maintenance arrangement for a documented website, automation, or agent, subject to a suitability review.',
    examples: [
      'Illustrative example, not a client result: review agreed automation-failure alerts, triage duplicate-record issues, and maintain a recovery runbook.',
      'Illustrative example, not a client result: maintain a marketing website’s scoped dependencies and check that its enquiry path still delivers.',
      'Illustrative example, not a client result: refresh approved agent knowledge and rerun agreed evaluation cases after a source or provider change.'
    ],
    deliverables: [
      'Understand: assess the named systems, documentation, ownership, outstanding risks, and suitability for support.',
      'Build: document the agreed service inventory, maintenance tasks, incident route, change limits, and escalation responsibilities.',
      'Connect: set up only approved access and monitoring or notification routes; verify these work before describing them as active.',
      'Support: perform the contracted maintenance and issue-triage tasks, record changes, and review improvement requests within the agreed scope.'
    ],
    exclusions: [
      'Building or training foundation models, unlimited feature development, or a complete system rebuild.',
      'Automatic 24/7 coverage, guaranteed uptime, fixed response deadlines, or instant resolution without an approved agreement.',
      'Ownership of third-party outages, unsupported software, or systems not accepted into the service inventory.',
      'Formal incident-response retainers, penetration testing, compliance certification, and provider fees unless separately scoped.'
    ],
    inputs: [
      'An accurate system inventory, architecture and operating notes, known issues, and accountable business owners.',
      'Secure, least-privilege access and decisions on who authorises production changes.',
      'Existing logs, alert routes, backup and recovery information where applicable, with sensitive data minimised.',
      'Agreed coverage expectations, severity definitions, escalation contacts, maintenance windows, and change priorities.'
    ],
    integrations: 'Support is limited to systems and connections explicitly accepted after review. Access permissions, alert delivery, provider dependencies, data retention, and audit trails must be agreed. Vendor changes can require reassessment; no named provider or inherited system is automatically supported.',
    support: 'The agreement must define coverage hours, reporting channels, response expectations, maintenance tasks, change limits, exclusions, and escalation ownership. Monitoring only exists once configured and tested. Provider outages and complex defects can remain outside direct control; major changes and additional systems require approval.',
    faqs: [
      { q: 'How much does ongoing support cost?', a: 'Prices are pending founder approval. Fees depend on accepted systems, maintenance tasks, coverage, monitoring needs, and included change work. The approved agreement must state currency, taxes, recurring charges, third-party fees, exclusions, and treatment of out-of-scope work. Approved pricing is required before public launch of this service page.' },
      { q: 'How quickly can managed support begin?', a: 'A start date follows a suitability review, agreement, access setup, and handover. Missing documentation or unresolved risks can require remediation first. Support must not be described as active until the agreed reporting and monitoring routes have been verified.' },
      { q: 'Do you provide 24/7 support or guaranteed response times?', a: 'No blanket coverage or response commitment is published. Hours, severity levels, and response expectations must be explicitly agreed before work begins. A response expectation is not a guarantee that an issue or third-party outage will be resolved within that time.' },
      { q: 'Can you maintain a system another provider built?', a: 'Possibly, following a review of its documentation, access, dependencies, and condition. Supportability and any required remediation must be confirmed first. Unsupported components or missing ownership may prevent acceptance; no universal vendor coverage is claimed.' }
    ]
  }
];

export const faqs = [
  {
    q: 'What can Vyoium AI help us build?',
    a: 'We offer scoped projects across AI agents, websites, workflow automation, integrations, and consulting. The right solution depends on your business problem and existing systems.'
  },
  {
    q: 'Who do you work with?',
    a: 'Our initial focus is established small and medium businesses looking to improve digital systems or reduce repetitive operational work.'
  },
  {
    q: 'How does a project start?',
    a: 'Share what you would like help with. We review the enquiry, discuss the requirements, and define a proposed scope before a project begins.'
  },
  {
    q: 'How long does implementation take?',
    a: 'Timelines depend on the workflow, integrations, and testing requirements. A delivery estimate is provided after scoping; no universal turnaround is promised.'
  },
  {
    q: 'Do you offer ongoing support?',
    a: 'Ongoing maintenance and improvement can be included under an agreed support arrangement. Coverage and response expectations are defined in that agreement.'
  }
];
