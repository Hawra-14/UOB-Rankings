const db = require('./db');

async function seedQuestions() {
    console.log('Seeding QS Sustainability questions with full item structure...');

    // UPDATE THIS to your QS Sustainability cycle ID
    const CYCLE_ID = 1;

    // Questions with their items
    const questions = [
        // ── ANNUAL REPORT ──────────────────────────────────────────
        {
            code: 'AR1', theme: 'Annual Report', question_type: 'yesno', is_synced: true,
            title: 'Does your institution publish an annual report?',
            description: 'An annual report summarizes financial performance, academic achievements, and strategic goals.',
            items: []
        },
        {
            code: 'AR2', theme: 'Annual Report', question_type: 'url', is_synced: true,
            title: 'If Yes, Please upload/provide the link to your last annual report.',
            description: 'Provide the direct URL or upload the PDF of your most recent annual report.',
            items: [
                { item_number: '1', label: 'Link or PDF report', answer_type: 'url', max_words: null }
            ]
        },

        // ── ENVIRONMENTAL SUSTAINABILITY ───────────────────────────
        {
            code: 'ES1', theme: 'Environmental Impact', question_type: 'checkbox',
            title: "Link to your institution's sustainability/climate action policy.",
            description: 'Provide the URL to your published sustainability or climate action policy.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES2', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your institution provide mandatory annual dedicated training on environmental aspects of sustainability for staff members (faculty and professional staff members)? Please insert link to training/evidence description:',
            description: 'Training for faculty and professional staff on environmental sustainability.',
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
            description: 'URL to your sustainable procurement or purchasing policy.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES6', theme: 'Environmental Impact', question_type: 'checkbox',
            title: "Link to your institution's sustainable investment policy.",
            description: 'URL to your sustainable investment policy.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES7', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Link to student led society whose purpose is to engage with sustainability.',
            description: 'URL to a student-led sustainability society.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES8', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your university report its carbon emissions in line with the GHG Protocol Corporate Standard or another commonly used standard?',
            description: 'Evidence of last conducted GHG inventory.',
            items: [
                { item_number: '1', label: 'Please provide evidence of the last conducted inventory', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES9', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please provide the total Scope 1 and 2 carbon emissions in tCO2e (tonnes (t) of carbon dioxide (CO2) equivalent (e)). Please see instructions.',
            description: 'Total carbon emissions including Scope 3 estimate and supporting URL.',
            items: [
                { item_number: '1', label: 'Total Scope 1 & 2 emissions in tCO2e', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'If you also report on Scope 3 emissions, please list your estimate here, in tCO2e', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'Please also provide a URL that supports the above figures', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES10', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please enter the year you began recording your emissions to GHG standards - see the definition tab for more detail.',
            description: 'Baseline year and total Scope 1 and 2 for the baseline year.',
            items: [
                { item_number: '1', label: 'Baseline year', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Total Scope 1 & 2 for the baseline year, in tco2e', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES11', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Does your university have a carbon reduction target covering Scope 1 & 2 emissions by at least 2050? If not, please leave the evidence field blank.',
            description: 'Evidence URL for carbon reduction target.',
            items: [
                { item_number: '1', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'ES12', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please add the amount of energy generated in campus through renewable sources, in kWh, for the last reporting year. This would include energy consumed, stored or sold on.',
            description: 'Total energy from renewables for the last reporting year.',
            items: [
                { item_number: '1', label: 'Total energy from renewables', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES13', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please submit your total campus building footprint. See instructions.',
            description: 'Total campus building footprint in square meters.',
            items: [
                { item_number: '1', label: 'Total campus building footprint in square meters (sq^2)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES14', theme: 'Environmental Impact', question_type: 'number',
            title: 'Please provide the year your institution has publicly committed to reaching net-zero. If you have not committed to this, please leave the evidence field blank.',
            description: 'Year of net-zero commitment and evidence URL.',
            items: [
                { item_number: '1', label: 'Year', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null }
            ]
        },

        // ── ENVIRONMENTAL EDUCATION ────────────────────────────────
        {
            code: 'EE1', theme: 'Environmental Impact', question_type: 'checkbox',
            title: 'Do you offer courses that teach specifically on climate science and/or environmental sustainability?',
            description: 'Courses linked to official credits or leading to recognised qualifications.',
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
            description: 'Research centre with dedicated FTE staff contributing to teaching.',
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
            description: 'Number of male academic faculty staff (Full Time, Part Time, HC, FTE).',
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
            description: 'Number of female academic faculty staff (Full Time, Part Time, HC, FTE).',
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
            description: 'Total number of female students enrolled at all levels.',
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
            description: 'Total number of individuals in the senior leadership team.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ6', theme: 'Social Impact', question_type: 'number',
            title: 'Number of the above members of your senior leadership team who are male.',
            description: 'Number of male members in senior leadership team.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EQ7', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Does your institution have a current Equality, Diversity and Inclusion (EDI) policy?',
            description: 'Current EDI policy with protected characteristics.',
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
            description: 'Disability support office, accessible campus, mentoring schemes.',
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
            description: 'Training for faculty and professional staff on social sustainability.',
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
            description: 'Education, health, information services, community engagement.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'richtext', max_words: 200 }
            ]
        },

        // ── HEALTH & WELLBEING ────────────────────────────────────
        {
            code: 'HW1', theme: 'Social Impact', question_type: 'checkbox',
            title: 'Do you provide on-campus or local health and wellbeing services?',
            description: 'Food choices, physical health, sexual health, mental health services.',
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
            description: 'EDI committee tasked with implementing policies on diversity and inclusion.',
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
            description: 'Anti-bribery policy reviewed within last 3 years.',
            items: [
                { item_number: '1', label: 'Existence of anti-bribery and corruption policy or equivalent', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'url', max_words: null },
                { item_number: '3', label: 'This policy has been reviewed in the last 3 years, i.e. on or after 2020 (tick if apply)', answer_type: 'checkbox', max_words: null }
            ]
        },
        {
            code: 'GG3', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your institution have a dedicated staff member or team whose sole responsibility is to advance sustainable development at the institution? If so, please provide evidence.',
            description: 'Staff member whose sole responsibility is advancing sustainable development.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Please provide evidence', answer_type: 'richtext', max_words: 200 }
            ]
        },
        {
            code: 'GG4', theme: 'Governance', question_type: 'checkbox',
            title: 'Does your organisation support and facilitate a holistic ethical organisational culture?',
            description: 'Ethical values, training, compliance office, whistleblower system.',
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
            description: 'Recognised student union representing undergraduate and postgraduate students.',
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
            description: 'Income, Expenditure, Borrowing, Surplus.',
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
            description: 'Link to AGM minutes or decisions.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },
        {
            code: 'GG9', theme: 'Governance', question_type: 'checkbox',
            title: "Does your university's governing body have student representation? If so, please share the webpage link. If not, please leave blank.",
            description: 'Student representation on governing body with webpage link.',
            items: [
                { item_number: '1', label: 'Tick if applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'URL', answer_type: 'url', max_words: null }
            ]
        },

        // ── ADDITIONAL INFORMATION ────────────────────────────────
        {
            code: 'AI1', theme: 'Additional Information', question_type: 'number',
            title: "Your institution's water consumption for the previous reporting year. Please use cubic meters (m3), where 1,000 L = 1 m3.",
            description: 'Water consumption in cubic meters (m3).',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AI2', theme: 'Additional Information', question_type: 'number',
            title: "Your institution's energy consumption for the previous reporting year. Please use kWh/year.",
            description: 'Energy consumption in kWh/year.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AI3', theme: 'Additional Information', question_type: 'number', is_synced: true,
            title: 'How many students receive a scholarship covering 100% of their fees?',
            description: 'Number of students with full scholarship.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AI4', theme: 'Additional Information', question_type: 'number', is_synced: true,
            title: 'How many students receive a scholarship covering at least 50% of fees?',
            description: 'Number of students with at least 50% scholarship.',
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