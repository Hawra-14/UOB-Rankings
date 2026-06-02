const db = require('./db');

async function seedQuestions() {
    console.log('Seeding QS Sustainability questions with full item structure...');

    const CYCLE_ID = 2;

    // Questions with their items
    const questions = [
        // ── ANNUAL REPORT ──────────────────────────────────────────
        {
            code: 'AR1', theme: 'Annual Report', question_type: 'yesno', is_synced: true,
            title: 'Does your institution publish an annual report?',
            description: 'An annual report for a higher education institution is an official document that summarizes financial performance, academic achievements, and strategic goals over the past year.',
            items: []
        },
        {
            code: 'AR2', theme: 'Annual Report', question_type: 'url', is_synced: true,
            title: 'If Yes, Please upload/provide the link to your last annual report.',
            description: 'An annual report for a higher education institution is an official document that summarizes financial performance, academic achievements, and strategic goals over the past year.',
            items: [
                { item_number: '1', label: 'Link or PDF report', answer_type: 'url', max_words: null }
            ]
        },

        // ── ENVIRONMENTAL SUSTAINABILITY ───────────────────────────
        {
            code: 'ES1', theme: 'Environmental Impact', question_type: 'checkbox',
            title: "Link to your institution's sustainability/climate action policy.",
            description: 'Policy or strategy on how your institution plans to mitigate the impact of their operations on the climate and the environment.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES2', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your institution provide mandatory annual dedicated training on environmental aspects of sustainability for staff members (faculty and professional staff members)? Please insert link to training/evidence description:',
            description: 'This refers to annual hours of mandatory staff training (per employee) on environmental aspects of sustainability. Please provide an estimate if exact numbers are not possible to calculate.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Which of the following groups receive this training? — Students', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Which of the following groups receive this training? — Staff', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Which of the following groups receive this training? — Both', answer_type: 'checkbox', max_words: null },
                { item_number: '5', label: 'Please provide evidence to support your answers for the above', answer_type: 'richtext', max_words: 200 }
            ]
        },
        {
            code: 'ES3', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your institution have an assessment tool for assessing sustainability literacy and knowledge of all staff (Academic and Professional)?',
            description: 'A formal assessment tool to measure sustainability literacy of all academic and professional staff.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'If yes, is this tool Sulitest TASK?', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'If no, please provide evidence of the assessment tool used', answer_type: 'richtext', max_words: 100 }
            ]
        },
        {
            code: 'ES4', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your institution have an assessment tool for assessing sustainability literacy and knowledge of all students?',
            description: 'A formal assessment tool to measure sustainability literacy of all students.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'If yes, is this tool Sulitest TASK?', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'If no, please provide evidence of the assessment tool used', answer_type: 'richtext', max_words: 100 }
            ]
        },
        {
            code: 'ES5', theme: 'Environmental Impact', question_type: 'checkbox',
            title: "Link to your institution's sustainable procurement/purchasing policy.",
            description: 'A publicly accessible policy (e.g. on an institution\'s website, or as part of an annual report) that sets out how the university plans to procure (purchase) in a sustainable manner, by, for example, purchasing from local suppliers, or using only recycled materials in building work. This is a key feature of corporate social responsibility.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES6', theme: 'Environmental Impact', question_type: 'checkbox',
            title: "Link to your institution's sustainable investment policy.",
            description: 'A publicly accessible policy (e.g. on an institution\'s website, or as part of an annual report) that sets out how the university invests in a sustainable manner, by, for example, investing in renewable energies or in medicines to tackle global health crises. Socially responsible investing is a key feature of corporate social responsibility.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES7', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Link to student led society whose purpose is to engage with sustainability.',
            description: 'The presence of a student-led society on issues of sustainability provides future students the opportunity to be part of a likeminded group on this issue, and demonstrates a supportive campus atmosphere. We ask for proof as a link to the society, or a link to a document that outlines the structure, governance and key stakeholders of the society.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES8', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your university report its carbon emissions in line with the GHG Protocol Corporate Standard or another commonly used standard?',
            description: 'For more information please visit Environmental Sustainability (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Please provide evidence of the last conducted inventory', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES9', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please provide the total Scope 1 and 2 carbon emissions in tCO2e (tonnes (t) of carbon dioxide (CO2) equivalent (e)). Please see instructions.',
            description: 'For more information please visit Environmental Sustainability (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Total Scope 1 & 2 emissions in tCO2e', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'If you also report on Scope 3 emissions, please list your estimate here, in tCO2e', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'Please also provide a URL that supports the above figures', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES10', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please enter the year you began recording your emissions to GHG standards - see the definition tab for more detail.',
            description: 'This should be the year, no earlier than 2005, which you consider your baseline year to measure progress against your net zero commitment. By baseline year we mean the point in history where you started to track emissions to GHG standards (or closest equivalent) and their progress/changes. Your default baseline year will be the first year (no earlier than 2005) for which you produced 12 months of full data.',
            items: [
                { item_number: '1', label: 'Baseline year', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Total Scope 1 & 2 for the baseline year, in tco2e', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES11', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your university have a carbon reduction target covering Scope 1 & 2 emissions by at least 2050? If not, please leave the evidence field blank.',
            description: 'For more information please visit Environmental Sustainability (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES12', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please add the amount of energy generated in campus through renewable sources, in kWh, for the last reporting year. This would include energy consumed, stored or sold on.',
            description: 'For more information please visit Environmental Sustainability (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Total energy from renewables', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES13', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please submit your total campus building footprint. See instructions.',
            description: 'For more information please visit Environmental Sustainability (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Total campus building footprint in square meters (sq^2)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES14', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please provide the year your institution has publicly committed to reaching net-zero. If you have not committed to this, please leave the evidence field blank.',
            description: 'For more information please visit Environmental Sustainability (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Year', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },

        // ── ENVIRONMENTAL EDUCATION ────────────────────────────────
        {
            code: 'EE1', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Do you offer courses that teach specifically on climate science and/or environmental sustainability?',
            description: 'The emphasis and resource that an institution puts towards climate literacy can be assessed through the variety of courses on offer, and what those courses lead to. For more information, please visit Environmental Education (Edition 2) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'We offer these courses and they are linked to officially recognised credits (e.g., European Credit Transfer and Accumulation System - ECTS, in Europe)', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'They lead to the award of an officially recognised qualification that specifically refers to climate science and environmental sustainability (e.g., MSc in Climate Change: Science, Society and Solutions at the University of Manchester in the UK; BSc in Climate Science and Adaptation at the University of Newcastle, Australia)', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },

        // ── ENVIRONMENTAL RESEARCH ─────────────────────────────────
        {
            code: 'ER1', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Presence of a Research Centre with a specific focus on environmental sustainability.',
            description: 'Please provide a public link or written statement to show the existence of a research centre with a specific focus on environmental sustainability within your institution. For more information please visit Environmental Research (2nd Edition) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'The Research Centre has dedicated FTE staff.', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'This Research Centre contributes (through curriculum, teaching and supervision) to the teaching of undergraduate programmes and/or postgraduate programmes.', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide evidence or supporting statement', answer_type: 'richtext', max_words: 100 }
            ]
        },

        // ── EQUALITY (Social Impact) ───────────────────────────────
        {
            code: 'EQ1', theme: 'Social Impact', question_type: 'number', is_synced: true,
            title: 'Faculty Staff Male',
            description: 'The number of academic faculty staff employed by your institution who are male.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ2', theme: 'Social Impact', question_type: 'number', is_synced: true,
            title: 'Faculty Staff Female',
            description: 'The number of academic faculty staff employed by your institution who are female.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ3', theme: 'Social Impact', question_type: 'number', is_synced: true,
            title: 'Students Female',
            description: 'Number of students who are female out of the total number of students studying at your university.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ5', theme: 'Social Impact', question_type: 'number',
            title: 'Number of members in your senior leadership team',
            description: 'The definition of "leadership" here is the executive leader of the university plus the highest level of university management. To draw parallels from the corporate world, it is the "C-Suite" - e.g. the CEO, COO, CFO and so forth. The important point is that these individuals report into the executive manager of the university. In our experience, the total headcount for "leadership" would not much exceed 10 people.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ6', theme: 'Social Impact', question_type: 'number',
            title: 'Number of the above members of your senior leadership team who are male.',
            description: 'Number of male senior executives in your leadership team.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ7', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Does your institution have a current Equality, Diversity and Inclusion (EDI) policy?',
            description: 'For more information please visit Equality (2nd Edition) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'We have a current EDI policy or equivalent', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '3', label: 'Which of the following main protected characteristics are included in this policy? — Age', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Which of the following main protected characteristics are included in this policy? — Gender or gender reassignment', answer_type: 'checkbox', max_words: null },
                { item_number: '5', label: 'Which of the following main protected characteristics are included in this policy? — Disability', answer_type: 'checkbox', max_words: null },
                { item_number: '6', label: 'Which of the following main protected characteristics are included in this policy? — Race', answer_type: 'checkbox', max_words: null },
                { item_number: '7', label: 'Which of the following main protected characteristics are included in this policy? — Religion or belief', answer_type: 'checkbox', max_words: null },
                { item_number: '8', label: 'Which of the following main protected characteristics are included in this policy? — Sexual orientation', answer_type: 'checkbox', max_words: null },
                { item_number: '9', label: 'Which of the following main protected characteristics are included in this policy? — Marriage and civil partnership', answer_type: 'checkbox', max_words: null },
                { item_number: '10', label: 'Which of the following main protected characteristics are included in this policy? — Refugee and asylum seekers', answer_type: 'checkbox', max_words: null },
                { item_number: '11', label: 'Which of the following main protected characteristics are included in this policy? — Pregnancy and maternity', answer_type: 'checkbox', max_words: null }
            ]
        },
        {
            code: 'DI1', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Do you offer support services for people with disabilities?',
            description: 'For more information please visit Equality (2nd Edition) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Existence of Disability Support Office', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '3', label: 'Campus is easily accessible by people with disabilities', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide evidence', answer_type: 'richtext', max_words: 50 },
                { item_number: '5', label: 'Access schemes for people with disabilities such as mentoring or other targeted support', answer_type: 'checkbox', max_words: null },
                { item_number: '6', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '7', label: 'Our university offers on-campus accommodation for people with disabilities.', answer_type: 'checkbox', max_words: null },
                { item_number: '8', label: 'Our university has a policy or strategy that outlines the reasonable adjustments and provisions for people with disabilities, including adequate funding:', answer_type: 'checkbox', max_words: null },
                { item_number: '9', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ST1', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Does your institution provide mandatory annual dedicated training on social aspects of Sustainability for staff members (faculty and professional staff members)? Please insert link to training/evidence description:',
            description: 'This refers to annual hours of mandatory staff training (per employee) on social aspects of sustainability. Please provide an estimate if exact numbers are not possible to calculate.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Which of the following groups receive this training? — Students', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Which of the following groups receive this training? — Staff', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Which of the following groups receive this training? — Both', answer_type: 'checkbox', max_words: null },
                { item_number: '5', label: 'Please provide evidence to support your answers for the above', answer_type: 'richtext', max_words: 200 }
            ]
        },

        // ── KNOWLEDGE EXCHANGE ────────────────────────────────────
        {
            code: 'KE1', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Do you offer, manage or deliver outreach projects (education, health, information services, reading, community engagement, tutorials) for the local community?',
            description: 'For more information please visit Knowledge Exchange (2nd Edition) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'richtext', max_words: 200 }
            ]
        },

        // ── HEALTH & WELLBEING ────────────────────────────────────
        {
            code: 'HW1', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Do you provide on-campus or local health and wellbeing services?',
            description: 'For more information please visit Health and Wellbeing (2nd Edition) – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Provision of healthy and affordable food choices for all on campus', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'richtext', max_words: 200 },
                { item_number: '3', label: 'Access to physical health-care services including information and education services', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '5', label: 'Access to sexual and reproductive health-care services including information and education services', answer_type: 'checkbox', max_words: null },
                { item_number: '6', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '7', label: 'Access to mental health support for both staff and students', answer_type: 'checkbox', max_words: null },
                { item_number: '8', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },

        // ── GOOD GOVERNANCE ───────────────────────────────────────
        {
            code: 'GG1', theme: 'Governance', question_type: 'checkbox',
            title: 'Do you have an equality, diversity and inclusion committee, office or officer (or the equivalent) tasked by the administration or governing body to advise on and implement policies, programmes and trainings related to diversity, equity, inclusion and human rights on campus?',
            description: 'For more information please visit Good Governance – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Existence of committee, office or officer', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '3', label: 'Existence of anti-discrimination and anti-harassment policies', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide Policy URLs', answer_type: 'url', max_words: null },
                { item_number: '5', label: 'Please provide Policy URLs (2)', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'GG2', theme: 'Governance', question_type: 'checkbox',
            title: 'Do you have an Anti-bribery and corruption policy?',
            description: 'For more information please visit Good Governance – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Existence of anti-bribery and corruption policy or equivalent', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '3', label: 'This policy has been reviewed in the last 3 years, i.e. on or after 2020 (tick if apply)', answer_type: 'checkbox', max_words: null }
            ]
        },
        {
            code: 'GG3', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your institution have a dedicated staff member or team whose sole responsibility is to advance sustainable development at the institution? If so, please provide evidence.',
            description: 'Staff member whose sole responsibility is advancing sustainable development at the institution.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'richtext', max_words: 200 }
            ]
        },
        {
            code: 'GG4', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your organisation support and facilitate a holistic ethical organisational culture?',
            description: 'For more information please visit Good Governance – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Our organisation develops clear ethical values (e.g., diversity, honesty, respect, fairness) and these are enshrined in a publicly available strategic document.', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '3', label: 'Our university provides training based on those values at all levels of the organisation.', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '5', label: 'There is an office for ethical compliance within our institution, with a designated official with oversight on ethical matters across the institution.', answer_type: 'checkbox', max_words: null },
                { item_number: '6', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '7', label: 'Our organisation has an internal reporting system to assure the confidentiality of whistleblowers or a grievance procedure for staff concerning an employment matter.', answer_type: 'checkbox', max_words: null },
                { item_number: '8', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'GG5', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your university have a student union?',
            description: 'For more information please visit Good Governance – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Our university has a recognised student union that represents both undergraduate and postgraduate students at university level', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'This student union is connected/affiliated to a wider national student union body', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'The student union elects its leadership, allowing students to vote.', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'GG6', theme: 'Governance', question_type: 'checkbox',
            title: 'Has your institution formed a Sustainability committee?',
            description: 'Sustainability committee with executive leadership member.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Does a member of your executive leadership team sit on this committee?', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Please provide evidence to support your answers for the above', answer_type: 'richtext', max_words: 200 }
            ]
        },
        {
            code: 'GG7', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your institution publish their financial reports on an annual basis? If applicable, please tick as appropriate:',
            description: 'For more information please visit Good Governance – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Financial reports published — Income', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Financial reports published — Expenditure', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Financial reports published — Borrowing', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Financial reports published — Surplus', answer_type: 'checkbox', max_words: null },
                { item_number: '5', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'GG8', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your institution publicly share the decisions taken in your annual general meeting? If so, please share the link to these minutes.',
            description: 'The minutes from your university\'s governance meetings. This would typically be a meeting held by the senate, board or equivalent governing body and be annual or bi-annual. Minutes should be recorded in clear and concise form, and would typically include the formal recommendations, and formal decisions which a committee has made, in line with its terms of reference. The minutes should be publicly available. This is a key feature of good and transparent governance.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'GG9', theme: 'Governance', question_type: 'checkbox',
            title: "Does your university's governing body have student representation? If so, please share the webpage link. If not, please leave blank.",
            description: '"Governing body" to mean any of the following: university senate / university court / academic council / local equivalent. Student representation to mean that (a) permanent seat(s) is provided for a student who has the same rights as the academics on the body. Please note student representation does not refer to a Student Union or Student Club. For more information please visit Good Governance – QS Quacquarelli Symonds.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },

        // ── ADDITIONAL INFORMATION ────────────────────────────────
        {
            code: 'AI1', theme: 'Additional Information', question_type: 'number',
            title: "Your institution's water consumption for the previous reporting year. Please use cubic meters (m3), where 1,000 L = 1 m3.",
            description: 'The total water consumption for all buildings, both academic and residential, for the previous reporting year. This year should match the year used for submitting staff & student data. It should be given in cubic meters (m3). If your institution records this in a different format, please convert to m3 for submission.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AI2', theme: 'Additional Information', question_type: 'number',
            title: "Your institution's energy consumption for the previous reporting year. Please use kWh/year.",
            description: 'The total energy (all electricity and any other energy sources such as biofuel / coal / oil / renewables, excluding natural gas) consumption for all buildings, both academic and residential, for the previous reporting year. This should match the year used for submitting staff & student data.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AI3', theme: 'Additional Information', question_type: 'number', is_synced: true,
            title: 'How many students receive a scholarship covering 100% of their fees?',
            description: 'A grant or payment made to support a student\'s education, awarded on the basis of academic or other achievement, that covers a full academic year for full payment of fees. For rankings purposes, this is for fees only. The fund may come from the university, a private company, or a philanthropic organization.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AI4', theme: 'Additional Information', question_type: 'number', is_synced: true,
            title: 'How many students receive a scholarship covering at least 50% of fees?',
            description: 'A grant or payment made to support a student\'s education, awarded on the basis of academic or other achievement, that covers at least 50% of full fees per academic year. For rankings purposes, this is for fees only. The fund may come from the university, a private company, or a philanthropic organization.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        }
    ];

    let questionCount = 0;
    let itemCount = 0;

    for (const q of questions) {
        // Insert question
        const result = await db.execute({
            sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, is_synced)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [CYCLE_ID, q.code, q.title, q.description, q.question_type, q.theme, q.is_synced ? 1 : 0]
        });
        const questionId = Number(result.lastInsertRowid);
        questionCount++;

        // Insert items
        for (const item of q.items) {
            await db.execute({
                sql: `INSERT INTO question_items (question_id, item_number, label, answer_type, max_words)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [questionId, item.item_number, item.label, item.answer_type, item.max_words]
            });
            itemCount++;
        }

        console.log(`  ✓ ${q.code} — ${q.title.slice(0, 50)}... (${q.items.length} items)`);
    }

    console.log(`\nDone! ${questionCount} questions and ${itemCount} items seeded.`);
    process.exit(0);
}

seedQuestions().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});