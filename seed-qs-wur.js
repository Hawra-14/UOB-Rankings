const db = require('./db');

async function seedWUR() {
    console.log('Seeding QS WUR questions...');

    const CYCLE_ID = 2;

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
            title: 'If Yes, please upload/provide the link to your last annual report.',
            description: 'An annual report for a higher education institution is an official document that summarizes financial performance, academic achievements, and strategic goals over the past year.',
            items: [
                { item_number: '1', label: 'Link or PDF report', answer_type: 'url', max_words: null }
            ]
        },

        // ── FACULTY STAFF ──────────────────────────────────────────
        {
            code: 'FS1', theme: 'Faculty Staff', question_type: 'number', is_synced: false,
            title: 'Faculty Staff',
            description: 'Total number of academic faculty staff who are responsible for planning, directing and undertaking academic teaching only, research only or both academic teaching and research within Higher Education Institutions. Please include: vice-chancellors, deputy vice-chancellors, principals and deputy principals, professors, heads of school, associate professors, assistant professors, principal lecturers, readers, tutors, researchers, research fellows or postdoctoral researchers who contribute to teaching or research or both at your university for a minimum period of at least three months. Please exclude: research assistants, PhD students who contribute to teaching, hospital residents who do not teach and/or undertake research in addition to clinical duties, exchange scholars and visiting faculty staff who are members of a university other than yours.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'FS2', theme: 'Faculty Staff', question_type: 'number', is_synced: true,
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
            code: 'FS3', theme: 'Faculty Staff', question_type: 'number', is_synced: true,
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
            code: 'FS4', theme: 'Faculty Staff', question_type: 'number', is_synced: false,
            title: 'International Faculty Staff',
            description: 'Number of academic faculty staff who contributes to academic teaching or research or both at your university for a minimum period of at least three months and who are of foreign nationality. The term "international" is hereby determined by citizenship. For EU countries, this includes all foreign nationals, even if from another EU state. In Hong Kong, this includes professors from Mainland China. It is important to note that visiting international faculty staff who are of foreign origin but members of a university other than yours should NOT be counted under this category. In case of dual citizenship, the "deciding" criteria should be "citizenship obtained through birth", basically first passport obtained.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'FS5', theme: 'Faculty Staff', question_type: 'number', is_synced: false,
            title: 'Staff with PhD',
            description: 'Number of academic faculty staff working at your institution during the last annual reporting period that have been awarded a PhD or equivalent terminal degree. The annual reporting period is the last complete academic, financial or calendar year. Please supply whichever is easier to collect. A terminal degree is the highest academic qualification in a given field.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },

        // ── STUDENTS - UNDERGRADUATE ───────────────────────────────
        {
            code: 'UG1', theme: 'Students - Undergraduate', question_type: 'number', is_synced: false,
            title: 'Undergraduate Students',
            description: 'Total number of students pursuing a Bachelor\'s level or equivalent degree. This includes programmes designed to provide intermediate academic and/or professional knowledge, skills and competencies leading to a first tertiary degree or equivalent qualification (UNESCO ISCED-2011 Level 6). This excludes certificates/diplomas and associate\'s degrees.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'UG2', theme: 'Students - Undergraduate', question_type: 'number', is_synced: false,
            title: 'Undergraduate International Students',
            description: 'Number of undergraduate students who are foreign nationals and who spend at least three months at your university. The term "international" is hereby determined by citizenship. For EU countries, this includes all foreign nationals, even nationals of other EU states. In Hong Kong, this includes students from Mainland China. In case of dual citizenship, the "deciding" criteria should be "citizenship obtained through birth", basically first passport obtained. Please exclude all exchange, off-shore, and distance learning students.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'UG3', theme: 'Students - Undergraduate', question_type: 'number', is_synced: false,
            title: 'Undergraduate Exchange Students - Inbound',
            description: 'Number of undergraduate students (physically present) attending your university on international exchange programmes for at least one semester during the annual reporting period. The annual reporting period is the last complete academic, financial or calendar year. Please supply whichever is easier to collect. Exchange programmes that give out credit points but are less than one semester in duration are to be excluded. The student exchange must be academic in nature and acknowledged by a formal agreement between the two Higher Education Providers.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'UG4', theme: 'Students - Undergraduate', question_type: 'number', is_synced: false,
            title: 'Undergraduate Exchange Students - Outbound',
            description: 'Number of undergraduate students (physically present) registered at your university who have attended another university abroad on international exchange programmes for at least one semester during the annual reporting period. The annual reporting period is the last complete academic, financial or calendar year. Please supply whichever is easier to collect. Exchange programmes that give out credit points but are less than one semester in duration are to be excluded. The student exchange must be academic in nature and acknowledged by a formal agreement between the two Higher Education Providers. The international exchange programme must be between universities, NOT between a university and a company or corporation.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },

        // ── STUDENTS - GRADUATE/POSTGRADUATE ──────────────────────
        {
            code: 'PG1', theme: 'Students - Graduate/Postgraduate', question_type: 'number', is_synced: false,
            title: 'Graduate/Postgraduate Students',
            description: 'Total number of students pursuing a higher-level degree (Master and Doctorate), including both taught and research postgraduates (e.g. PhD students). That refers to programmes designed to provide advanced academic and/or professional knowledge, skills and competencies leading to a second tertiary degree or equivalent qualification (UNESCO ISCED-2011 Level 7) and programmes designed primarily to lead to an advanced research qualification, usually concluding with the submission and defence of a substantive dissertation of publishable quality based on original research (UNESCO ISCED-2011 Level 8).',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'PG2', theme: 'Students - Graduate/Postgraduate', question_type: 'number', is_synced: false,
            title: 'Graduate/Postgraduate International Students',
            description: 'Number of graduate/postgraduate students who are foreign nationals and who spend at least three months at your university. The term "international" is hereby determined by citizenship. For EU countries, this includes all foreign nationals, even nationals of other EU states. In Hong Kong, this includes students from Mainland China. In case of dual citizenship, the "deciding" criteria should be "citizenship obtained through birth", basically first passport obtained. Please exclude all exchange, off-shore and distance learning students.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'PG3', theme: 'Students - Graduate/Postgraduate', question_type: 'number', is_synced: false,
            title: 'Graduate/Postgraduate Inbound Exchange Students',
            description: 'Number of graduate/postgraduate students (physically present) attending your university on international exchange programmes for at least one semester during the annual reporting period. The annual reporting period is the last complete academic, financial or calendar year. Please supply whichever is easier to collect. Exchange programmes that give out credit points but are less than one semester in duration are to be excluded. The student exchange must be academic in nature and acknowledged by a formal agreement between the two Higher Education Providers.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'PG4', theme: 'Students - Graduate/Postgraduate', question_type: 'number', is_synced: false,
            title: 'Graduate/Postgraduate Outbound Exchange Students',
            description: 'Number of graduate/postgraduate students (physically present) registered at your university who have attended another university abroad on international exchange programmes for at least one semester during the annual reporting period. The annual reporting period is the last complete academic, financial or calendar year. Please supply whichever is easier to collect. Exchange programmes that give out credit points but are less than one semester in duration are to be excluded. The student exchange must be academic in nature and acknowledged by a formal agreement between the two Higher Education Providers. The international exchange programme must be between universities, NOT between a university and a company or corporation or a university with its international/offshore campuses.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },

        // ── STUDENTS - OVERALL ─────────────────────────────────────
        {
            code: 'SO1', theme: 'Students - Overall', question_type: 'number', is_synced: false,
            title: 'Students - Overall',
            description: 'Total number of students. Where possible, please only include students pursuing degree level programs or higher. Exclude all students who are not currently active and distance learning students.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'SO2', theme: 'Students - Overall', question_type: 'number', is_synced: false,
            title: 'International Students - Overall',
            description: 'Number of students who are foreign nationals. The term "international" is hereby determined by citizenship. EU countries: include all foreign nationals, even nationals of other EU states. Hong Kong: include students from Mainland China. Include permanent residents. The "deciding" criteria for "dual citizenship" should be "citizenship obtained through birth", i.e., first passport obtained.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'SO3', theme: 'Students - Overall', question_type: 'number', is_synced: false,
            title: 'Students - Distance',
            description: 'Distance here means that the student is registered with the provider (institution) but spends the majority of the year studying "at distance" from that provider. This should be within the same country, i.e., following the criteria that you would use to determine a domestic student. The defining feature should be that online delivery is the primary method of content delivery and interaction.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'SO4', theme: 'Students - Overall', question_type: 'number', is_synced: false,
            title: 'International Students - Distance',
            description: 'Distance here means that the student is registered with the provider (institution) but spends the majority of year studying "at distance" from that provider. The student should also fulfil the criteria for "international student" in this instance, i.e., the student\'s passport is different to the country of study. The defining feature should be that online delivery is the primary method of content delivery and interaction.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'SO5', theme: 'Students - Overall', question_type: 'number', is_synced: false,
            title: 'Exchange Students - Inbound',
            description: 'Total number of students (physically present) registered, who have attended your university on an exchange program for at least 1 semester in the last annual reporting period.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'SO6', theme: 'Students - Overall', question_type: 'number', is_synced: false,
            title: 'Exchange Students - Outbound',
            description: 'Total number of students (physically present) registered, who have attended another university on an exchange program for at least 1 semester in the last annual reporting period.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },

        // ── STUDENT DEMOGRAPHICS ───────────────────────────────────
        {
            code: 'SD1', theme: 'Student Demographics', question_type: 'number', is_synced: false,
            title: 'Students Male',
            description: 'Number of students who are male out of the total number of students studying at your university.',
            items: [
                { item_number: '1', label: 'Full Time', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Part Time', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'HC', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'FTE', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'SD2', theme: 'Student Demographics', question_type: 'number', is_synced: true,
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
            code: 'SD3', theme: 'Student Demographics', question_type: 'number', is_synced: false,
            title: 'Count of places of origin',
            description: 'The total number of places of origin studying at your institution who satisfy the definitions for students. Please make sure your total number of international students match the total number of students mentioned in the uploaded excel.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },

        // ── ADDITIONAL STATISTICS ──────────────────────────────────
        {
            code: 'AS1', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Number of total undergraduate degree programs offered',
            description: 'Total number of distinct degree programs offered at undergraduate level. Distinct degree program names should be used as a criteria for deciding, so e.g. BSc in Chemistry and BSc in Biochemistry, or BA in History and BA in European History. Only full degrees should be counted.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS2', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Number of total postgraduate degree programs offered',
            description: 'Total number of distinct degree programs offered at postgraduate level. Distinct degree program names should be used as a criteria for deciding, so e.g. MA in Chemistry and MA in Biochemistry, or MPhil in History and MPhil in European History. Only full postgraduate degrees should be counted.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS3', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Number of total undergraduate degree programs offered online',
            description: 'Number of the above degree programs which are delivered fully online.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS4', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Student Continuation Rate (in %)',
            description: 'The percentage of undergraduates who complete their degree and go on to postgraduate study at the same or another university within 2 years of graduating.',
            items: [
                { item_number: '1', label: 'Percentage (%)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS5', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Number of total postgraduate degree programs offered online',
            description: 'Number of the above degree programs which are delivered fully online.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS6', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Student Retention Rate (in %)',
            description: 'The percentage of first-year full-time undergraduate students who continue to their second year of study.',
            items: [
                { item_number: '1', label: 'Percentage (%)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS7', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Completion Rate (in %)',
            description: 'The percentage of Undergraduate students from the initial enrolment cohort that completed the degree course through to graduation in 100% of the allocated time.',
            items: [
                { item_number: '1', label: 'Percentage (%)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS8', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'First Generation Learners',
            description: 'The percentage of students whose primary guardians (parent(s)/caregiver) did not complete an undergraduate college or university degree. Please submit the percentage to be based on the FTE (full-time equivalent) figure, which will be used across all forms where this field appears.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'AS9', theme: 'Additional Statistics', question_type: 'number', is_synced: false,
            title: 'Total number of non-degree courses offered online (e.g. micro credentials / vocational courses) that allow transfer of credits to degrees',
            description: 'Total number of distinct non-degree credentials offered at the university. Distinct credential names should be used as a criteria for deciding, so e.g. Certificate in Artificial Intelligence and Certificate in Machine Learning, or Module in International Studies and Module in American Studies. These must lead to a recognized credential e.g. Coursera Certificate or Vocational License.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },

        // ── AVERAGE TUITION FEES ───────────────────────────────────
        {
            code: 'TF1', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'Undergraduate Fees - Domestic',
            description: 'Average tuition fees per academic year (usually two semesters) that a domestic student would be expected to pay for an undergraduate program, with "program" referring to the complete range of courses contributing to a degree. Please include all compulsory annual fees a domestic undergraduate student is expected to pay.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF2', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'Undergraduate Fees - International',
            description: 'Average tuition fees per academic year (usually two semesters) that an international student would be expected to pay for an undergraduate program, with "program" referring to the complete range of courses contributing to a degree. Please include all compulsory annual fees an international undergraduate student is expected to pay.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF3', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'Graduate/Postgraduate Fees - Domestic',
            description: 'Average tuition fees per academic year (usually two semesters) that a domestic student would be expected to pay for a graduate/postgraduate program, with "program" referring to the complete range of courses contributing to a degree. Please include all compulsory annual fees a domestic postgraduate student is expected to pay.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF4', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'Graduate/Postgraduate Fees - International',
            description: 'Average tuition fees per academic year (usually two semesters) that an international student would be expected to pay for a graduate/postgraduate program, with "program" referring to the complete range of courses contributing to a degree. Please include all compulsory annual fees an international postgraduate student is expected to pay.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF5', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'Overall Student Fees - Domestic',
            description: 'Average tuition fees per academic year (two semesters) that a domestic student would be expected to pay for any program, with program referring to the complete range of courses contributing to a degree. Please include all compulsory annual fees a domestic student is expected to pay.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF6', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'Overall Student Fees - International',
            description: 'Average tuition fees per academic year (two semesters) that an international student would be expected to pay for a program, with program referring to the complete range of courses contributing to a degree. Please include all compulsory annual fees an international student is expected to pay.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF7', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'How many students receive a scholarship covering 100% of their fees?',
            description: 'A grant or payment made to support a student\'s education, awarded on the basis of academic or other achievement, that covers a full academic year for full payment of fees. For rankings purposes, this is for fees only. The fund may come from the university, a private company, or a philanthropic organization.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'TF8', theme: 'Average Tuition Fees', question_type: 'number', is_synced: false,
            title: 'How many students receive a scholarship covering at least 50% of fees?',
            description: 'A grant or payment made to support a student\'s education, awarded on the basis of academic or other achievement, that covers at least 50% of full fees per academic year. For rankings purposes, this is for fees only. The fund may come from the university, a private company, or a philanthropic organization.',
            items: [
                { item_number: '1', label: 'Total number', answer_type: 'number', max_words: null }
            ]
        },

        // ── EMPLOYMENT STATISTICS ──────────────────────────────────
        {
            code: 'ES1', theme: 'Employment Statistics', question_type: 'number', is_synced: false,
            title: 'Number of Students',
            description: 'Total number of graduates used as the pool for employment statistics.',
            items: [
                { item_number: '1', label: 'Total grad students', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Total respondents', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'Employed grads', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'Unemployed', answer_type: 'number', max_words: null },
                { item_number: '5', label: 'In FT further study', answer_type: 'number', max_words: null },
                { item_number: '6', label: 'Unavailable for work', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES2', theme: 'Employment Statistics', question_type: 'number', is_synced: false,
            title: 'Median Grad Salary (USD)',
            description: 'Please provide the median starting salary a graduate can expect within 12 months of their graduation, excluding any bonuses.',
            items: [
                { item_number: '1', label: 'Amount (USD)', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'ES3', theme: 'Employment Statistics', question_type: 'number', is_synced: false,
            title: 'Percentage (Auto) %',
            description: 'Auto-calculated percentage based on employment statistics. This field is read-only.',
            items: [
                { item_number: '1', label: 'Percentage (Auto) %', answer_type: 'calculated', max_words: null }
            ]
        },
        {
            code: 'ES4', theme: 'Employment Statistics', question_type: 'number', is_synced: false,
            title: 'QS Employment Rate (Auto) %',
            description: 'Proportion of graduates (excluding those opting to pursue further study or unavailable to work) in full or part time employment within 15 months of graduation. This field is auto-calculated and read-only.',
            items: [
                { item_number: '1', label: 'QS Employment Rate (Auto) %', answer_type: 'calculated', max_words: null }
            ]
        },

        // ── EMPLOYMENT STATISTICS EVIDENCE ────────────────────────
        {
            code: 'EE1', theme: 'Employment Statistics Evidence', question_type: 'select', is_synced: false,
            title: 'When was the survey shared with students?',
            description: 'Timeframe after graduation when the employment survey was distributed to students.',
            items: [
                {
                    item_number: '1', label: 'Timeframe', answer_type: 'select', max_words: null,
                    options: '6 months or less after graduation,7-11 months after graduation,12-15 months after graduation,more than 15 months after graduation (please describe in a message)'
                }
            ]
        },
        {
            code: 'EE2', theme: 'Employment Statistics Evidence', question_type: 'number', is_synced: false,
            title: 'Which year was the survey conducted?',
            description: 'The calendar year in which the employment survey was conducted.',
            items: [
                { item_number: '1', label: 'Year', answer_type: 'number', max_words: null }
            ]
        },
        {
            code: 'EE3', theme: 'Employment Statistics Evidence', question_type: 'url', is_synced: false,
            title: 'Link or screenshot of report evidencing these numbers',
            description: 'Upload or provide the URL to the employment survey report that evidences the employment statistics submitted above.',
            items: [
                { item_number: '1', label: 'Link or report', answer_type: 'url', max_words: null }
            ]
        }
    ];

    let questionCount = 0;
    let itemCount = 0;

    for (const q of questions) {
        const result = await db.execute({
            sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, is_synced)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [CYCLE_ID, q.code, q.title, q.description, q.question_type, q.theme, q.is_synced ? 1 : 0]
        });
        const questionId = Number(result.lastInsertRowid);
        questionCount++;

        for (const item of q.items) {
            await db.execute({
                sql: `INSERT INTO question_items (question_id, item_number, label, answer_type, max_words, options)
                      VALUES (?, ?, ?, ?, ?, ?)`,
                args: [questionId, item.item_number, item.label, item.answer_type, item.max_words, item.options || null]
            });
            itemCount++;
        }

        console.log(`  ✓ ${q.code} — ${q.title.slice(0, 50)}... (${q.items.length} items)`);
    }

    console.log(`\nDone! ${questionCount} questions and ${itemCount} items seeded.`);
    process.exit(0);
}

seedWUR().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});