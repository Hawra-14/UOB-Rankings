const db = require('./db');

async function seedTheImpact() {
    console.log('Seeding THE Impact questions...');

    const CYCLE_ID = 4;

    const questions = [

        // ════════════════════════════════════════════════════════
        // SDG3 — Good Health and Wellbeing
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG3_3_2', theme: 'SDG3: Good Health and Wellbeing', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '3.2 — Number graduating in health professions',
            description: '', items: []
        },
        {
            code: 'SDG3_3_2_1', theme: 'SDG3: Good Health and Wellbeing', question_type: 'number', is_synced: false, has_evidence: false,
            title: '3.2.1 — Proportion of graduates in health professions',
            description: 'Provide the total number of graduates and the number of graduates in health professions.',
            items: [
                { item_number: '1', label: 'Number of graduates', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of graduates in health professions', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3', theme: 'SDG3: Good Health and Wellbeing', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '3.3 — Collaborations and health services',
            description: '', items: []
        },
        {
            code: 'SDG3_3_3_1', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.1 — Current collaborations with health institutions',
            description: 'Have current collaborations with local, national, or global health institutions to improve health and well-being outcomes.',
            items: [
                { item_number: '1', label: 'Local collaboration', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'National collaboration', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Global cooperation', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3_2', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.2 — Health outreach programmes',
            description: 'Deliver outreach programmes and projects in the local community to improve or promote health and well-being.',
            items: [
                { item_number: '1', label: 'Local communities', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Disadvantaged people', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Refugee/immigrant communities', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3_3', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.3 — Shared sports facilities',
            description: 'Share sports facilities with the local community.',
            items: [
                { item_number: '1', label: 'Free access to all facilities', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Free access to some facilities', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Charged access', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3_4', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.4 — Sexual and reproductive health care services for students',
            description: 'Provide students access to sexual and reproductive health-care services including information and education services.',
            items: [
                { item_number: '1', label: 'Free access', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Charged access', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3_5', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.5 — Mental health support for students',
            description: 'Provide students with access to mental health support.',
            items: [
                { item_number: '1', label: 'Active promotion of good mental health', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Access to (or signposting to) free mental health support', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Access to (or signposting to) charged mental health support', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3_6', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.6 — Smoke-free policy',
            description: 'Have a smoke-free policy.',
            items: [
                { item_number: '1', label: 'Smoking-free campus', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Smoking in designated areas', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG3_3_3_7', theme: 'SDG3: Good Health and Wellbeing', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '3.3.7 — Mental health support for staff',
            description: 'Provide staff with access to mental health support.',
            items: [
                { item_number: '1', label: 'Active promotion of good mental health', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Access to (or signposting to) free mental health support', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Access to (or signposting to) charged mental health support', answer_type: 'checkbox', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // SDG4 — Quality Education
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG4_4_2', theme: 'SDG4: Quality Education', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '4.2 — Proportion of graduates with teaching qualification',
            description: '', items: []
        },
        {
            code: 'SDG4_4_2_1', theme: 'SDG4: Quality Education', question_type: 'number', is_synced: false, has_evidence: false,
            title: '4.2.1 — Proportion of graduates with relevant qualification for teaching',
            description: 'Provide the total number of graduates and those who gained a qualification to teach at primary school level.',
            items: [
                { item_number: '1', label: 'Number of graduates', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of graduates who gained a qualification to teach at primary school level', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG4_4_3', theme: 'SDG4: Quality Education', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '4.3 — Lifelong learning measures',
            description: '', items: []
        },
        {
            code: 'SDG4_4_3_1', theme: 'SDG4: Quality Education', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '4.3.1 — Public resources (lifelong learning)',
            description: 'Provide free access to educational resources for those not studying at the university.',
            items: [
                { item_number: '1', label: 'Free courses leading to certificate or award', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Free access to campus facilities and equipment', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Free access to online resources', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG4_4_3_2', theme: 'SDG4: Quality Education', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '4.3.2 — Public events (lifelong learning)',
            description: 'Host educational events at university that are open to the general public.',
            items: [
                { item_number: '1', label: 'Free events', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Both charged and free', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG4_4_3_3', theme: 'SDG4: Quality Education', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '4.3.3 — Vocational training events (lifelong learning)',
            description: 'Host executive education programmes and/or vocational training events open to the general public.',
            items: [
                { item_number: '1', label: 'Ad hoc', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'On programmed basis', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG4_4_3_4', theme: 'SDG4: Quality Education', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '4.3.4 — Education outreach activities beyond campus',
            description: 'Undertake educational outreach activities beyond campus in local schools or the community.',
            items: [
                { item_number: '1', label: 'Ad hoc', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'On programmed basis', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG4_4_3_5', theme: 'SDG4: Quality Education', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '4.3.5 — Lifelong learning access policy',
            description: 'Have a policy ensuring access to lifelong learning activities regardless of ethnicity, religion, disability, immigration status or gender.',
            items: []
        },
        {
            code: 'SDG4_4_4', theme: 'SDG4: Quality Education', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '4.4 — Proportion of first-generation students',
            description: '', items: []
        },
        {
            code: 'SDG4_4_4_1', theme: 'SDG4: Quality Education', question_type: 'number', is_synced: false, has_evidence: false,
            title: '4.4.1 — Proportion of first-generation students',
            description: 'Provide the number of students starting a degree and the number of first-generation students.',
            items: [
                { item_number: '1', label: 'Number of students starting a degree', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of first-generation students starting a degree', answer_type: 'number', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // SDG5 — Gender Equality
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG5_5_2', theme: 'SDG5: Gender Equality', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '5.2 — Proportion of first-generation female students',
            description: '', items: []
        },
        {
            code: 'SDG5_5_2_1', theme: 'SDG5: Gender Equality', question_type: 'number', is_synced: false, has_evidence: false,
            title: '5.2.1 — Proportion of women first-generation',
            description: 'Provide the number of women starting a degree and the number of first-generation women.',
            items: [
                { item_number: '1', label: 'Number of women starting a degree', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of first-generation women starting a degree', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_3', theme: 'SDG5: Gender Equality', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '5.3 — Student access measures',
            description: '', items: []
        },
        {
            code: 'SDG5_5_3_1', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.3.1 — Tracking access measures',
            description: 'Systematically measure and track women\'s application rate, acceptance or entry rate.',
            items: []
        },
        {
            code: 'SDG5_5_3_2', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.3.2 — Policy for women applications and entry',
            description: 'Have a policy addressing women\'s applications, acceptance, entry, and participation at the university.',
            items: []
        },
        {
            code: 'SDG5_5_3_3', theme: 'SDG5: Gender Equality', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '5.3.3 — Women\'s access schemes',
            description: 'Provide women\'s access schemes, including mentoring, scholarships, or other provision.',
            items: [
                { item_number: '1', label: 'Mentoring', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Scholarship', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Other provision', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_3_4', theme: 'SDG5: Gender Equality', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '5.3.4 — Women\'s application in underrepresented subjects',
            description: 'Encourage applications by women in subjects where they are underrepresented.',
            items: [
                { item_number: '1', label: 'Through university outreach', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Through collaboration with other universities and/or community groups and/or government and/or NGOs', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_4', theme: 'SDG5: Gender Equality', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '5.4 — Proportion of senior female academics',
            description: '', items: []
        },
        {
            code: 'SDG5_5_4_1', theme: 'SDG5: Gender Equality', question_type: 'number', is_synced: false, has_evidence: false,
            title: '5.4.1 — Proportion of senior female academics',
            description: 'Provide the total number of senior academic staff and the number of female senior academic staff.',
            items: [
                { item_number: '1', label: 'Number of senior academic staff', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of female senior academic staff', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_5', theme: 'SDG5: Gender Equality', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '5.5 — Proportion of women receiving degrees',
            description: '', items: []
        },
        {
            code: 'SDG5_5_5_1', theme: 'SDG5: Gender Equality', question_type: 'number', is_synced: false, has_evidence: false,
            title: '5.5.1 — Proportion of female degrees awarded',
            description: 'Provide graduate counts by subject area and gender.',
            items: [
                { item_number: '1', label: 'Number of graduates: Total', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of graduates: STEM', answer_type: 'number', max_words: null },
                { item_number: '3', label: 'Number of graduates: Medicine', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'Number of graduates: Arts & Humanities / Social Sciences', answer_type: 'number', max_words: null },
                { item_number: '5', label: 'Number of female graduates: Total', answer_type: 'number', max_words: null },
                { item_number: '6', label: 'Number of female graduates: STEM', answer_type: 'number', max_words: null },
                { item_number: '7', label: 'Number of female graduates: Medicine', answer_type: 'number', max_words: null },
                { item_number: '8', label: 'Number of female graduates: Arts & Humanities / Social Sciences', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_6', theme: 'SDG5: Gender Equality', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '5.6 — Women\'s progress measures',
            description: '', items: []
        },
        {
            code: 'SDG5_5_6_1', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.1 — Policy of non-discrimination against women',
            description: 'Have a policy of non-discrimination against women.',
            items: []
        },
        {
            code: 'SDG5_5_6_2', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.2 — Non-discrimination policies for transgender',
            description: 'Have a policy of non-discrimination for transgender people.',
            items: []
        },
        {
            code: 'SDG5_5_6_3', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.3 — Maternity policy',
            description: 'Have a maternity policy that supports women\'s participation.',
            items: []
        },
        {
            code: 'SDG5_5_6_4', theme: 'SDG5: Gender Equality', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '5.6.4 — Childcare facilities for students',
            description: 'Have accessible childcare facilities for students which allow recent mothers to attend university courses.',
            items: [
                { item_number: '1', label: 'Free', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Paid', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_6_5', theme: 'SDG5: Gender Equality', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '5.6.5 — Childcare facilities for staff and faculty',
            description: 'Have childcare facilities for staff and faculty.',
            items: [
                { item_number: '1', label: 'Free', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Paid', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG5_5_6_6', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.6 — Women\'s mentoring schemes',
            description: 'Have women\'s mentoring schemes, in which at least 10% of female students participate.',
            items: []
        },
        {
            code: 'SDG5_5_6_7', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.7 — Track women\'s graduation rate',
            description: 'Have measurement or tracking of women\'s likelihood of graduating compared to men\'s.',
            items: []
        },
        {
            code: 'SDG5_5_6_8', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.8 — Policies protecting those reporting discrimination',
            description: 'Have a policy that protects those reporting discrimination from educational or employment disadvantage.',
            items: []
        },
        {
            code: 'SDG5_5_6_9', theme: 'SDG5: Gender Equality', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '5.6.9 — Paternity policy',
            description: 'Have a paternity policy that supports women\'s participation by ensuring that fathers can participate in childcare duties.',
            items: []
        },

        // ════════════════════════════════════════════════════════
        // SDG7 — Affordable and Clean Energy
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG7_7_2', theme: 'SDG7: Affordable and Clean Energy', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '7.2 — University measures towards affordable and clean energy',
            description: '', items: []
        },
        {
            code: 'SDG7_7_2_1', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '7.2.1 — Energy-efficient renovation and building',
            description: 'Have a policy in place for ensuring all renovations or new builds are following energy efficiency standards.',
            items: []
        },
        {
            code: 'SDG7_7_2_2', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '7.2.2 — Upgrade buildings to higher energy efficiency',
            description: 'Have plans to upgrade existing buildings to higher energy efficiency.',
            items: []
        },
        {
            code: 'SDG7_7_2_3', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '7.2.3 — Carbon reduction and emission reduction process',
            description: 'Have a process for carbon management and reducing carbon dioxide emissions.',
            items: []
        },
        {
            code: 'SDG7_7_2_4', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '7.2.4 — Plan to reduce energy consumption',
            description: 'Have an energy efficiency plan in place to reduce overall energy consumption.',
            items: []
        },
        {
            code: 'SDG7_7_2_5', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: false,
            title: '7.2.5 — Energy wastage identification',
            description: 'Undergo energy reviews to identify areas where energy waste is highest.',
            items: []
        },
        {
            code: 'SDG7_7_2_6', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: false,
            title: '7.2.6 — Divestment policy',
            description: 'Have a policy on divesting investments from carbon-intensive energy industries notably coal and oil.',
            items: []
        },
        {
            code: 'SDG7_7_3', theme: 'SDG7: Affordable and Clean Energy', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '7.3 — Energy use density',
            description: '', items: []
        },
        {
            code: 'SDG7_7_3_1', theme: 'SDG7: Affordable and Clean Energy', question_type: 'number', is_synced: false, has_evidence: true,
            title: '7.3.1 — Energy usage per sqm',
            description: 'Provide total energy used and university floor space.',
            items: [
                { item_number: '1', label: 'Total energy used (kWh)', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'University floor space (m²)', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG7_7_4', theme: 'SDG7: Affordable and Clean Energy', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '7.4 — Energy and the community',
            description: '', items: []
        },
        {
            code: 'SDG7_7_4_1', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '7.4.1 — Local community outreach for energy efficiency',
            description: 'Provide programmes for local community to learn about importance of energy efficiency and clean energy.',
            items: []
        },
        {
            code: 'SDG7_7_4_2', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '7.4.2 — 100% renewable energy pledge',
            description: 'Promote a public pledge toward 100% renewable energy beyond the university.',
            items: []
        },
        {
            code: 'SDG7_7_4_3', theme: 'SDG7: Affordable and Clean Energy', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '7.4.3 — Energy efficiency services for industry',
            description: 'Provide direct services to local industry aimed at improving energy efficiency and clean energy.',
            items: [
                { item_number: '1', label: 'Free', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Paid', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG7_7_4_4', theme: 'SDG7: Affordable and Clean Energy', question_type: 'checkbox', is_synced: false, has_evidence: false,
            title: '7.4.4 — Policy development for clean energy technology',
            description: 'Inform and support governments in clean energy and energy-efficient technology policy development.',
            items: [
                { item_number: '1', label: 'Local', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Regional', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'National', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Global', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG7_7_4_5', theme: 'SDG7: Affordable and Clean Energy', question_type: 'yesno', is_synced: false, has_evidence: false,
            title: '7.4.5 — Assistance to low-carbon innovation',
            description: 'Provide assistance for start-ups that foster and support a low-carbon economy or technology.',
            items: []
        },
        {
            code: 'SDG7_7_5', theme: 'SDG7: Affordable and Clean Energy', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '7.5 — Low-carbon energy use',
            description: '', items: []
        },
        {
            code: 'SDG7_7_5_1', theme: 'SDG7: Affordable and Clean Energy', question_type: 'number', is_synced: false, has_evidence: false,
            title: '7.5.1 — Low-carbon energy use',
            description: 'Provide total energy used and total energy used from low-carbon sources.',
            items: [
                { item_number: '1', label: 'Total energy used (kWh)', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Total energy used from low-carbon sources (kWh)', answer_type: 'number', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // SDG8 — Decent Work and Economic Growth
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG8_8_2', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '8.2 — Employment practice',
            description: '', items: []
        },
        {
            code: 'SDG8_8_2_1', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.1 — Employment practice living wage',
            description: 'Pay all staff and faculty at least the living wage.',
            items: []
        },
        {
            code: 'SDG8_8_2_2', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.2 — Employment practice unions',
            description: 'Recognize unions (freedom of association & collective bargaining) for all, including women & international staff.',
            items: []
        },
        {
            code: 'SDG8_8_2_3', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.3 — Employment policy on discrimination',
            description: 'Have a policy on ending discrimination in the workplace.',
            items: []
        },
        {
            code: 'SDG8_8_2_4', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.4 — Employment policy modern slavery',
            description: 'Have a policy commitment against forced labour, modern slavery, human trafficking and child labour.',
            items: []
        },
        {
            code: 'SDG8_8_2_5', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.5 — Employment practice equivalent rights outsourcing',
            description: 'Have a policy on guaranteeing equivalent rights of workers when outsourcing activities to third parties.',
            items: []
        },
        {
            code: 'SDG8_8_2_6', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.6 — Employment policy pay scale equity',
            description: 'Have a policy on pay scale equity including a commitment to measurement and elimination of gender pay gaps.',
            items: []
        },
        {
            code: 'SDG8_8_2_7', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '8.2.7 — Tracking pay scale for gender equity',
            description: 'Measurement or tracking of pay scale gender equity.',
            items: []
        },
        {
            code: 'SDG8_8_2_8', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: false,
            title: '8.2.8 — Employment practice appeal process',
            description: 'Have a process for employees to appeal on employee rights and/or pay.',
            items: []
        },
        {
            code: 'SDG8_8_2_9', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'yesno', is_synced: false, has_evidence: false,
            title: '8.2.9 — Employment practice labour rights',
            description: 'Recognise labour rights (freedom of association and collective bargaining) for all.',
            items: []
        },
        {
            code: 'SDG8_8_3', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '8.3 — Expenditure per employee',
            description: '', items: []
        },
        {
            code: 'SDG8_8_3_1', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'number', is_synced: false, has_evidence: false,
            title: '8.3.1 — Expenditure per employee',
            description: 'Provide number of employees and total university expenditure.',
            items: [
                { item_number: '1', label: 'Number of employees', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'University expenditure (USD)', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG8_8_4', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '8.4 — Proportion of students taking work placements',
            description: '', items: []
        },
        {
            code: 'SDG8_8_4_1', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'number', is_synced: false, has_evidence: false,
            title: '8.4.1 — Proportion of students with work placements',
            description: 'Provide total number of students and number with work placements for more than a month.',
            items: [
                { item_number: '1', label: 'Number of students', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of students with work placements for more than a month', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG8_8_5', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '8.5 — Proportion of employees on secure contracts',
            description: '', items: []
        },
        {
            code: 'SDG8_8_5_1', theme: 'SDG8: Decent Work and Economic Growth', question_type: 'number', is_synced: false, has_evidence: false,
            title: '8.5.1 — Proportion of employees on secure contracts',
            description: 'Provide total number of employees and number on contracts of over 24 months.',
            items: [
                { item_number: '1', label: 'Number of employees', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Number of employees on contracts of over 24 months', answer_type: 'number', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // SDG13 — Climate Action
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG13_13_2', theme: 'SDG13: Climate Action', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '13.2 — Low-carbon energy use',
            description: '', items: []
        },
        {
            code: 'SDG13_13_2_1', theme: 'SDG13: Climate Action', question_type: 'checkbox', is_synced: false, has_evidence: false,
            title: '13.2.1 — Low-carbon energy tracking',
            description: 'Measure the amount of low carbon energy used across the university.',
            items: [
                { item_number: '1', label: 'Whole university', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Partial measurement', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG13_13_2_2', theme: 'SDG13: Climate Action', question_type: 'number', is_synced: false, has_evidence: true,
            title: '13.2.2 — Low-carbon energy use',
            description: 'Provide total energy used and total energy used from low-carbon sources.',
            items: [
                { item_number: '1', label: 'Total energy used (kWh)', answer_type: 'number', max_words: null },
                { item_number: '2', label: 'Total energy used from low-carbon sources (kWh)', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SDG13_13_3', theme: 'SDG13: Climate Action', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '13.3 — Environmental education measures',
            description: '', items: []
        },
        {
            code: 'SDG13_13_3_1', theme: 'SDG13: Climate Action', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '13.3.1 — Local education programmes on climate',
            description: 'Provide local education programmes or campaigns on climate change risks, impacts, mitigation, adaptation, impact reduction and early warning.',
            items: []
        },
        {
            code: 'SDG13_13_3_2', theme: 'SDG13: Climate Action', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '13.3.2 — Climate Action Plan, shared',
            description: 'Have a university Climate Action plan, shared with local government and local community groups.',
            items: []
        },
        {
            code: 'SDG13_13_3_3', theme: 'SDG13: Climate Action', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '13.3.3 — Co-operative planning for climate change disasters',
            description: 'Participate in co-operative planning for climate change disasters, working with government.',
            items: [
                { item_number: '1', label: 'Local', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Regional', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG13_13_3_4', theme: 'SDG13: Climate Action', question_type: 'yesno', is_synced: false, has_evidence: false,
            title: '13.3.4 — Inform and support government',
            description: 'Inform and support local or regional government in local climate change disaster or risk early warning and monitoring.',
            items: []
        },
        {
            code: 'SDG13_13_3_5', theme: 'SDG13: Climate Action', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '13.3.5 — Environmental education collaborate with NGO',
            description: 'Collaborate with NGOs on climate adaptation.',
            items: []
        },
        {
            code: 'SDG13_13_4', theme: 'SDG13: Climate Action', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '13.4 — Commitment to carbon neutral university',
            description: '', items: []
        },
        {
            code: 'SDG13_13_4_1', theme: 'SDG13: Climate Action', question_type: 'checkbox', is_synced: false, has_evidence: false,
            title: '13.4.1 — Commitment to carbon neutral university',
            description: 'Have a target date by which it will become carbon neutral according to the Greenhouse Gas Protocols.',
            items: [
                { item_number: '1', label: 'Scope 1', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Scope 1 and 2', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Scope 1, 2 and 3 (partial)', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Scope 1, 2 and 3 (full)', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG13_13_4_2', theme: 'SDG13: Climate Action', question_type: 'number', is_synced: false, has_evidence: false,
            title: '13.4.2 — Achieve carbon neutral by date',
            description: 'Provide the target year. Scoring: prior to 2023=4pts, 2023-2029=3pts, 2030-2039=2pts, 2040-2049=1pt, 2050 or later=0.5pts.',
            items: [
                { item_number: '1', label: 'Target year to achieve carbon neutrality', answer_type: 'number', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // SDG17 — Partnerships for the Goals
        // ════════════════════════════════════════════════════════
        {
            code: 'SDG17_17_2', theme: 'SDG17: Partnerships for the Goals', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '17.2 — Relationships to support the goals',
            description: '', items: []
        },
        {
            code: 'SDG17_17_2_1', theme: 'SDG17: Partnerships for the Goals', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '17.2.1 — Relationships with regional NGOs and government for SDG policy',
            description: 'Have direct involvement in, or input into, national government or regional NGO SDG policy development.',
            items: []
        },
        {
            code: 'SDG17_17_2_2', theme: 'SDG17: Partnerships for the Goals', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '17.2.2 — Cross sectoral dialogue about SDGs',
            description: 'Initiate and participate in cross-sectoral dialogue about the SDGs.',
            items: []
        },
        {
            code: 'SDG17_17_2_3', theme: 'SDG17: Partnerships for the Goals', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '17.2.3 — International collaboration data gathering for SDG',
            description: 'Participate in international collaboration on gathering or measuring data for the SDGs.',
            items: []
        },
        {
            code: 'SDG17_17_2_4', theme: 'SDG17: Partnerships for the Goals', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '17.2.4 — Collaboration for SDG best practice',
            description: 'Through international collaboration and research, develop international best practice on tackling the SDGs.',
            items: []
        },
        {
            code: 'SDG17_17_2_5', theme: 'SDG17: Partnerships for the Goals', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '17.2.5 — Collaboration with NGOs for SDGs',
            description: 'Collaborate with NGOs to tackle the SDGs.',
            items: [
                { item_number: '1', label: 'Student volunteering programmes', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Research programmes', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Development of educational resources', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG17_17_3', theme: 'SDG17: Partnerships for the Goals', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '17.3 — Publication of SDG reports',
            description: '', items: []
        },
        ...Array.from({ length: 17 }, (_, i) => ({
            code: `SDG17_17_3_${i + 1}`, theme: 'SDG17: Partnerships for the Goals', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: `17.3.${i + 1} — Publication of SDG reports (SDG${i + 1})`,
            description: `Publish progress against SDG${i + 1}, either individually or within an annual report.`,
            items: [
                { item_number: '1', label: 'Overall report', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Separate report', answer_type: 'checkbox', max_words: null },
            ]
        })),
        {
            code: 'SDG17_17_4', theme: 'SDG17: Partnerships for the Goals', question_type: 'metric', is_synced: false, has_evidence: false,
            title: '17.4 — Education for the SDGs',
            description: '', items: []
        },
        {
            code: 'SDG17_17_4_1', theme: 'SDG17: Partnerships for the Goals', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '17.4.1 — Education for SDGs commitment to meaningful education',
            description: 'Have a commitment to meaningful education around the SDGs across the university.',
            items: [
                { item_number: '1', label: 'Education integrated across full curriculum', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Mandatory education for all', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Optional education for all', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG17_17_4_2', theme: 'SDG17: Partnerships for the Goals', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '17.4.2 — Education for SDGs specific courses on sustainability',
            description: 'Have dedicated courses (full degrees, or electives) that address sustainability and the SDGs.',
            items: []
        },
        {
            code: 'SDG17_17_4_3', theme: 'SDG17: Partnerships for the Goals', question_type: 'checkbox', is_synced: false, has_evidence: true,
            title: '17.4.3 — Education for SDGs in the wider community',
            description: 'Have dedicated outreach educational activities for the wider community.',
            items: [
                { item_number: '1', label: 'Alumni', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Local community', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Displaced people and refugees', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SDG17_17_4_4', theme: 'SDG17: Partnerships for the Goals', question_type: 'yesno', is_synced: false, has_evidence: true,
            title: '17.4.4 — Sustainable Literacy',
            description: 'Measure the sustainability literacy of students. (Note: not scored in 2025 but will inform 2026 decisions.)',
            items: []
        },
    ];

    let questionCount = 0;
    let itemCount = 0;

    for (const q of questions) {
        const result = await db.execute({
            sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, is_synced, has_evidence)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [CYCLE_ID, q.code, q.title, q.description, q.question_type, q.theme, q.is_synced ? 1 : 0, q.has_evidence ? 1 : 0]
        });
        const questionId = Number(result.lastInsertRowid);
        questionCount++;

        for (const item of q.items) {
            try {
                await db.execute({
                    sql: `INSERT INTO question_items (question_id, item_number, label, answer_type, max_words, options)
                          VALUES (?, ?, ?, ?, ?, ?)`,
                    args: [questionId, item.item_number, item.label, item.answer_type, item.max_words, item.options || null]
                });
                itemCount++;
            } catch (e) {
                console.error(`Failed on question ${q.code}, item: ${item.label}, answer_type: "${item.answer_type}"`);
                console.error(e.message);
                process.exit(1);
            }
        }
        console.log(`  ✓ ${q.code} — ${q.title.slice(0, 60)}`);
    }

    console.log(`\nDone! ${questionCount} questions and ${itemCount} items seeded for THE Impact.`);
    process.exit(0);
}

seedTheImpact().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});