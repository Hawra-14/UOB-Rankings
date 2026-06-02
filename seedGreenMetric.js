const db = require('./db');

async function seedGreenMetric() {
    console.log('Seeding GreenMetric questions...');

    const CYCLE_ID = 5;

    const questions = [

        // ════════════════════════════════════════════════════════
        // SI — Setting & Infrastructure (1.1 – 1.19)
        // ════════════════════════════════════════════════════════
        {
            code: 'SI_1_1', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'Type of higher education institution',
            description: 'Indicate whether your institution is a comprehensive or specialized higher education institution.',
            items: [
                { item_number: '1', label: 'Type — Comprehensive', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Type — Specialized higher education institution', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_2', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'checkbox', is_synced: false, has_evidence: false,
            title: 'Climate',
            description: 'Select the climate type that best describes the location of your campus.',
            items: [
                { item_number: '1', label: 'Climate — Tropical Wet', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Climate — Tropical Wet and Dry', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Climate — Semiarid', answer_type: 'checkbox', max_words: null },
                { item_number: '4', label: 'Climate — Arid', answer_type: 'checkbox', max_words: null },
                { item_number: '5', label: 'Climate — Mediterranean', answer_type: 'checkbox', max_words: null },
                { item_number: '6', label: 'Climate — Humid Subtropical', answer_type: 'checkbox', max_words: null },
                { item_number: '7', label: 'Climate — Marine west coast / Oceanic Climate', answer_type: 'checkbox', max_words: null },
                { item_number: '8', label: 'Climate — Humid Continental', answer_type: 'checkbox', max_words: null },
                { item_number: '9', label: 'Climate — Subartic', answer_type: 'checkbox', max_words: null },
            ]
        },
        {
            code: 'SI_1_3', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Number of campus site',
            description: 'Total number of separate campus sites operated by your institution.',
            items: [{ item_number: '1', label: 'Number of campus site', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_4', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Campus setting',
            description: 'Select the setting that best describes the location of your main campus.',
            items: [
                { item_number: '1', label: 'Setting — Rural', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Setting — Suburban', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Setting — Urban', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Setting — In city center', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Setting — High rise building', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_5', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total campus area (m²)',
            description: 'Total area of all campus sites in square meters.',
            items: [{ item_number: '1', label: 'Total campus area (m²)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_6', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total campus ground floor area of buildings (m²)',
            description: 'Total ground floor footprint of all buildings on campus in square meters.',
            items: [{ item_number: '1', label: 'Total campus ground floor area of buildings (m²)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_7', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total campus buildings area (m²)',
            description: 'Total built floor area across all floors of all buildings on campus in square meters.',
            items: [{ item_number: '1', label: 'Total campus buildings area (m²)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_8', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'The ratio of open space area to total area — Formula: ((1.5-1.6)/1.5) x 100%)',
            description: 'Ratio of open space (non-built) area to total campus area.',
            items: [
                { item_number: '1', label: 'Ratio — <= 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Ratio — > 1 - 80%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Ratio — > 80 - 90%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Ratio — > 90 - 95%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Ratio — > 95%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_9', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Total area on campus covered in forest vegetation used for research, teaching, and/or community engagement',
            description: 'Area of campus covered in forest vegetation used for research, teaching, and/or community engagement.',
            items: [
                { item_number: '1', label: '<= 2%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Forest area number (m²) for <= 2%', answer_type: 'number', max_words: null },
                { item_number: '3', label: '> 2 - 10%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Forest area number (m²) for > 2 - 10%', answer_type: 'number', max_words: null },
                { item_number: '5', label: '> 10 - 25%', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Forest area number (m²) for > 10 - 25%', answer_type: 'number', max_words: null },
                { item_number: '7', label: '> 25 - 35%', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Forest area number (m²) for > 25 - 35%', answer_type: 'number', max_words: null },
                { item_number: '9', label: '> 35%', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Forest area number (m²) for > 35%', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SI_1_10', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Total area on campus covered in planted vegetation',
            description: 'Total area on campus covered in planted vegetation (please provide total area in square meters).',
            items: [
                { item_number: '1', label: ' <= 10%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Planted vegetation number (m²) for <= 10%', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' > 10 - 20%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Planted vegetation number (m²) for > 10 - 20%', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' > 20 - 30%', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Planted vegetation number (m²) for > 20 - 30%', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' > 30 - 50%', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Planted vegetation number (m²) for > 30 - 50%', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' > 50%', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Planted vegetation number (m²) for > 50%', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'SI_1_11', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total number of regular students (part time and full time)',
            description: 'Total number of students enrolled at the university, both part time and full time.',
            items: [{ item_number: '1', label: 'Total regular students', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_12', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total number of online students (part time and full time)',
            description: 'Total number of online students enrolled, both part time and full time.',
            items: [{ item_number: '1', label: 'Total online students', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_13', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total number of academic and administrative staff',
            description: 'Total number of academic and administrative staff employed by the university.',
            items: [{ item_number: '1', label: 'Total staff', answer_type: 'number', max_words: null }]
        },
        {
            code: 'SI_1_14', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'The total open space area divided by total campus population — Formula: ((1.5-1.6)/(1.12+1.14))',
            description: 'Total open space area per person on campus (students + staff).',
            items: [
                { item_number: '1', label: 'Open space per person — <= 10 m²/person', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Open space per person — > 10 - 20 m²/person', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Open space per person — > 20 - 40 m²/person', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Open space per person — > 40 - 70 m²/person', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Open space per person — > 70 m²/person', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_15', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Campus facilities for disabled, special needs, and/or maternity care',
            description: 'Availability and status of campus facilities for disabled persons, special needs, and/or maternity care.',
            items: [
                { item_number: '1', label: 'Facilities — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Facilities — Policy is in place', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Facilities — Facilities are in planning stage', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Facilities — Facilities are partially available and operated', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Facilities — Facilities exist in all buildings and are fully operated', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_16', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Security and safety facilities',
            description: 'Level of security and safety infrastructure available on campus.',
            items: [
                { item_number: '1', label: 'Security — Passive security and safety system', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Security — Security and safety infrastructure (CCTV, emergency hotline/button) available and fully function', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Security — Security and safety infrastructure (CCTV, emergency hotline/button, certified personnel, fire extinguisher, hydrant) available and fully function', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Security — Security and safety infrastructure available and fully functioning and security responding time for accidents, crime, fire, and natural disasters is more than 5 minutes', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Security — Security and safety infrastructure available and fully functioning and security responding time for accidents, crime, fire, and natural disasters is less than 5 minutes', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_17', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Health infrastructure facilities for students, academics, and administrative staff\'s well-being',
            description: 'Availability of health infrastructure for the campus community.',
            items: [
                { item_number: '1', label: 'Health — Health infrastructure (first aid) is not available', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Health — Health infrastructure (first aid, emergency room, clinic and personel) available', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Health — Health infrastructure (first aid, emergency room, clinic and certified personel) available', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Health — Health infrastructure (first aid, emergency room, clinic, hospital and certified personel) available', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Health — Health infrastructure available (first aid, emergency room, clinic, hospital and certified personel), system and accessible for public', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_18', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Conservation: plant (flora), animal (fauna), or wildlife, genetic resources for food and agriculture secured in either medium or long-term conservation facilities',
            description: 'Level of implementation of conservation programs for biodiversity on campus.',
            items: [
                { item_number: '1', label: 'Conservation — Conservation program in preparation', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Conservation — Conservation program 1-25% implemented', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Conservation — Conservation program > 25-50% implemented', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Conservation — Conservation program > 50-75% implemented', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Conservation — Conservation program >75% implemented', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'SI_1_19', gm_category: 'SI', theme: 'Setting & Infrastructure', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impact of Setting and Infrastructure programs in supporting the Sustainable Development Goals (SDGs)',
            description: 'Rate the impact of your setting and infrastructure programs in supporting the SDGs.',
            items: [
                { item_number: '1', label: 'SDG impact — Low impact (supporting 1-2 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'SDG impact — Moderate impact (supporting 3-5 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'SDG impact — Significant impact (supporting 6-9 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'SDG impact — High impact (supporting 10-13 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'SDG impact — Very high impact (supporting 14-17 SDGs)', answer_type: 'radio', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // EC — Energy & Climate Change (2.1 – 2.15)
        // ════════════════════════════════════════════════════════
        {
            code: 'EC_2_1', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Energy efficient appliances usage',
            description: 'Percentage of energy efficient appliances used on campus.',
            items: [
                { item_number: '1', label: 'Efficient appliances — < 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Efficient appliances — 1 - 25%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Efficient appliances — > 25 - 50%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Efficient appliances — > 50 - 75%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Efficient appliances — > 75%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_2', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total campus smart building area (m²)',
            description: 'Total floor area of smart buildings on campus in square meters.',
            items: [{ item_number: '1', label: 'Smart building area (m²)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'EC_2_3', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Smart Building implementation (percentage of the total floor area of smart building to the total all floors building area (smart and non-smart buildings area)) — Formula: (( 2.2/1.7 ) x 100% )',
            description: 'Percentage of the total floor area of smart building to the total all floors building area.',
            items: [
                { item_number: '1', label: 'Smart building % — < 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Smart building % — 1% - 25%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Smart building % — > 25% - 50%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Smart building % — > 50% - 75%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Smart building % — > 75%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_4', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'Number of renewable energy sources in campus (solar power, bio diesel, wind power, etc)',
            description: 'Number of distinct renewable energy sources used on campus.',
            items: [
                { item_number: '1', label: 'Renewable sources — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Renewable sources — 1 source', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Renewable sources — 2 sources', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Renewable sources — 3 sources', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Renewable sources — > 3 sources', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_5', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Renewable energy sources and their amount of the energy produced (in kilowatt-hour)',
            description: 'Amount of energy produced from each renewable energy source in kilowatt-hours.',
            items: [
                { item_number: '1', label: 'Not Applicable', answer_type: 'checkbox', max_words: null },
                { item_number: '2', label: 'Bio Diesel', answer_type: 'checkbox', max_words: null },
                { item_number: '3', label: 'Bio Diesel (KWH)', answer_type: 'number', max_words: null },
                { item_number: '4', label: 'Clean Biomass', answer_type: 'checkbox', max_words: null },
                { item_number: '5', label: 'Clean Biomass (KWH)', answer_type: 'number', max_words: null },
                { item_number: '6', label: 'Solar Power', answer_type: 'checkbox', max_words: null },
                { item_number: '7', label: 'Solar Power (KWH)', answer_type: 'number', max_words: null },
                { item_number: '8', label: 'Wind Power', answer_type: 'checkbox', max_words: null },
                { item_number: '9', label: 'Wind Power (KWH)', answer_type: 'number', max_words: null },
                { item_number: '10', label: 'Geothermal', answer_type: 'checkbox', max_words: null },
                { item_number: '11', label: 'Geothermal (KWH)', answer_type: 'number', max_words: null },
                { item_number: '12', label: 'Hydropower', answer_type: 'checkbox', max_words: null },
                { item_number: '13', label: 'Hydropower (KWH)', answer_type: 'number', max_words: null },
                { item_number: '14', label: 'Combined Heat and Power', answer_type: 'checkbox', max_words: null },
                { item_number: '15', label: 'Combined Heat and Power (KWH)', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'EC_2_6', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Electricity usage per year (in kilo watt hour)',
            description: 'Total electricity consumed by the university campus per year in kilowatt-hours.',
            items: [{ item_number: '1', label: 'Electricity usage (KWH/year)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'EC_2_7', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'The total electricity usage divided by total campus population (kWh per person) — Formula: ((2.6)/(1.12+1.14))',
            description: 'Electricity usage per campus population (students + staff) in kWh per person.',
            items: [
                { item_number: '1', label: 'Electricity per person — >= 2400 kWh', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Electricity per person — >1500 - 2400 kWh', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Electricity per person — > 600 - 1500 kWh', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Electricity per person — >= 250 - 600 kWh', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Electricity per person — < 250 kWh', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_8', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'The ratio of renewable energy production divided by total energy usage per year',
            description: 'Ratio of renewable energy production to total energy usage.',
            items: [
                { item_number: '1', label: 'Renewable ratio — <= 0.5%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Renewable ratio — > 0.5 - 1%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Renewable ratio — > 1 - 2%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Renewable ratio — > 2 - 25%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Renewable ratio — > 25%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_9', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Elements of green building implementation as reflected in all buildings',
            description: 'Number of green building elements implemented across all campus buildings.',
            items: [
                { item_number: '1', label: 'Green building — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Green building — 1 element', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Green building — 2 elements', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Green building — 3 elements', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Green building — > 3 elements', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_10', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Greenhouse gas emission reduction program',
            description: 'Status of greenhouse gas emission reduction programs at your institution.',
            items: [
                { item_number: '1', label: 'GHG program — None (reduction program is needed, but nothing has been done)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'GHG program — Program in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'GHG program — Program(s) aims to reduce one out of three scopes emissions (Scope 1 or 2 or 3)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'GHG program — Program(s) aims to reduce two out of three scopes emissions (Scope 1 and 2 or Scope 1 and 3 or Scope 2 and 3)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'GHG program — Program(s) aims to reduce all three scopes emissions (Scope 1, 2 and 3)', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_11', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total carbon footprint (CO2 emission in the last 12 months, in metric tons)',
            description: 'Total CO2 equivalent emissions from campus operations in the last 12 months, in metric tons.',
            items: [{ item_number: '1', label: 'Total carbon footprint (metric tons CO2)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'EC_2_12', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'The total carbon footprint divided by total campus population (metric tons per person) — Formula: ((2.11)/(1.12+1.14))',
            description: 'Carbon footprint per campus population member in metric tons per person.',
            items: [
                { item_number: '1', label: 'Carbon per person — >= 2.05 metric tons', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Carbon per person — > 1.11 - 2.05 metric tons', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Carbon per person — > 0.42 - 1.11 metric tons', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Carbon per person — > 0.10 - 0.42 metric tons', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Carbon per person — < 0.10 metric tons', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_13', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'The number of innovative program(s) in Energy and Climate Change',
            description: 'Number of innovative programs related to energy and climate change at your institution.',
            items: [
                { item_number: '1', label: 'Innovative programs — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Innovative programs — 1 program', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Innovative programs — 2 programs', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Innovative programs — 3 programs', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Innovative programs — More than 3 programs', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_14', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impactful university program(s) on climate change',
            description: 'Level of impact of university programs on climate change in surrounding communities.',
            items: [
                { item_number: '1', label: 'Climate program — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Climate program — Program in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Climate program — Provide training, educational materials, seminars/conferences, and activities which are implemented by surrounding communities', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Climate program — Provide training, educational materials, seminars/conferences, and activities which are implemented by communities at the national level', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Climate program — Provide training, educational materials, seminars/conferences, and activities which are implemented by communities at the international level', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'EC_2_15', gm_category: 'EC', theme: 'Energy & Climate Change', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impact of Energy and Climate Change programs in supporting the Sustainable Development Goals (SDGs)',
            description: 'Rate the impact of your energy and climate change programs in supporting the SDGs.',
            items: [
                { item_number: '1', label: 'SDG impact — Low impact (supporting 1-2 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'SDG impact — Moderate impact (supporting 3-5 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'SDG impact — Significant impact (supporting 6-9 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'SDG impact — High impact (supporting 10-13 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'SDG impact — Very high impact (supporting 14-17 SDGs)', answer_type: 'radio', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // WS — Waste (3.1 – 3.18)
        // ════════════════════════════════════════════════════════
        {
            code: 'WS_3_1', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: '3R (Reduce, Reuse, Recycle) program for university\'s waste',
            description: 'Level of implementation of the 3R program for managing university waste.',
            items: [
                { item_number: '1', label: '3R program — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: '3R program — 3R program in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: '3R program — 3R program 1 - 50% implemented', answer_type: 'radio', max_words: null },
                { item_number: '4', label: '3R program — 3R program > 50 - 75% implemented', answer_type: 'radio', max_words: null },
                { item_number: '5', label: '3R program — 3R program > 75% implemented', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WS_3_2', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume of paper and plastic produced this year in tons',
            description: 'Total volume of paper and plastic waste produced this year in tons.',
            items: [{ item_number: '1', label: 'Paper and plastic this year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_3', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume of paper and plastic produced last year in tons',
            description: 'Total volume of paper and plastic waste produced last year in tons.',
            items: [{ item_number: '1', label: 'Paper and plastic last year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_4', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Program to reduce the use of paper and plastic on campus',
            description: 'Number of programs implemented to reduce paper and plastic use on campus.',
            items: [
                { item_number: '1', label: 'Paper/plastic reduction — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Paper/plastic reduction — 1 - 3 programs', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Paper/plastic reduction — 4 - 6 programs', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Paper/plastic reduction — 7 - 10 programs', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Paper/plastic reduction — More than 10 programs', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WS_3_5', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume organic waste produced this year in tons',
            description: 'Total volume of organic waste produced this year in tons.',
            items: [{ item_number: '1', label: 'Organic waste this year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_6', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume organic waste produced last year in tons',
            description: 'Total volume of organic waste produced last year in tons.',
            items: [{ item_number: '1', label: 'Organic waste last year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_7', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume organic waste treated this year in tons',
            description: 'Total volume of organic waste treated this year in tons.',
            items: [{ item_number: '1', label: 'Organic waste treated (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_8', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Organic waste treatment',
            description: 'Method and extent of organic waste treatment.',
            items: [
                { item_number: '1', label: 'Organic treatment — Open dumping', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Organic treatment — Partial (1 - 35% treated)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Organic treatment — Partial (35 - 65% treated)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Organic treatment — Partial (> 65 - 85% treated)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Organic treatment — Extensive (> 85% treated)', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WS_3_9', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume inorganic waste produced this year in tons',
            description: 'Total volume of inorganic waste produced this year in tons.',
            items: [{ item_number: '1', label: 'Inorganic waste this year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_10', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume inorganic waste produced last year in tons',
            description: 'Total volume of inorganic waste produced last year in tons.',
            items: [{ item_number: '1', label: 'Inorganic waste last year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_11', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume inorganic waste treated this year in tons',
            description: 'Total volume of inorganic waste treated this year in tons.',
            items: [{ item_number: '1', label: 'Inorganic waste treated (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_12', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Inorganic waste treatment',
            description: 'Method and extent of inorganic waste treatment.',
            items: [
                { item_number: '1', label: 'Inorganic treatment — Burned in the open', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Inorganic treatment — Partial (1 - 35% treated)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Inorganic treatment — Partial (35 - 65% treated)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Inorganic treatment — Partial (> 65 - 85% treated)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Inorganic treatment — Extensive (> 85% treated)', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WS_3_13', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume toxic waste produced this year in tons',
            description: 'Total volume of toxic/hazardous waste produced this year in tons.',
            items: [{ item_number: '1', label: 'Toxic waste this year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_14', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume toxic waste produced last year in tons',
            description: 'Total volume of toxic/hazardous waste produced last year in tons.',
            items: [{ item_number: '1', label: 'Toxic waste last year (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_15', gm_category: 'WS', theme: 'Waste', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total volume toxic waste treated this year in tons',
            description: 'Total volume of toxic/hazardous waste treated this year in tons.',
            items: [{ item_number: '1', label: 'Toxic waste treated (Ton)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'WS_3_16', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Toxic waste treatment',
            description: 'Method and extent of toxic/hazardous waste treatment.',
            items: [
                { item_number: '1', label: 'Toxic treatment — Not Managed', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Toxic treatment — Partial (1 - 35% treated)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Toxic treatment — Partial (> 35 - 65% treated)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Toxic treatment — Partial (> 65 - 85% treated)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Toxic treatment — Extensive (> 85% treated) or campus produces a minimum amount of toxic waste', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WS_3_17', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Sewage disposal',
            description: 'Method of sewage/wastewater disposal used on campus.',
            items: [
                { item_number: '1', label: 'Sewage — Untreated into waterways', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Sewage — Treated with preliminary treatment', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Sewage — Treated with primary treatment', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Sewage — Treated with secondary treatment', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Sewage — Treated with tertiary treatment', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WS_3_18', gm_category: 'WS', theme: 'Waste', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impact of Waste Management programs in supporting the Sustainable Development Goals (SDGs)',
            description: 'Rate the impact of your waste management programs in supporting the SDGs.',
            items: [
                { item_number: '1', label: 'SDG impact — Low impact (supporting 1-2 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'SDG impact — Moderate impact (supporting 3-5 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'SDG impact — Significant impact (supporting 6-9 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'SDG impact — High impact (supporting 10-13 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'SDG impact — Very high impact (supporting 14-17 SDGs)', answer_type: 'radio', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // WR — Water (4.1 – 4.7)
        // ════════════════════════════════════════════════════════
        {
            code: 'WR_4_1', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Total area on campus for water absorption besides forest and planted vegetation (please provide total area in square meters)',
            description: 'Total area designated for water absorption (not including forest or planted vegetation) in square meters.',
            items: [
                { item_number: '1', label: ' <= 2%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Water absorption number (m²) for <= 2%', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' > 2 - 10%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Water absorption number (m²) for > 2 - 10%', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' > 10 - 20%', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Water absorption number (m²) for > 10 - 20%', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' > 20 - 40%', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Water absorption number (m²) for > 20 - 40%', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' > 40%', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Water absorption number (m²) for > 40%', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'WR_4_2', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Water conservation program and implementation',
            description: 'Status of water conservation programs and implementation at your institution.',
            items: [
                { item_number: '1', label: 'Water conservation — None (Conservation program is needed, but nothing has been done)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Water conservation — Program in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Water conservation — 1 - 25% water conserved', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Water conservation — > 25 - 50% water conserved', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Water conservation — > 50% water conserved', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WR_4_3', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Water recycling program implementation',
            description: 'Status of water recycling program implementation at your institution.',
            items: [
                { item_number: '1', label: 'Water recycling — None (Water recycling program is needed, but nothing has been done)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Water recycling — Program in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Water recycling — 1 - 25% water recycled', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Water recycling — > 25 - 50% water recycled', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Water recycling — > 50% water recycled', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WR_4_4', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Water efficient appliance usage',
            description: 'Percentage of water efficient appliances installed on campus.',
            items: [
                { item_number: '1', label: 'Water efficient appliances — < 20% of water efficient appliances installed', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Water efficient appliances — 20 - 40% of water efficient appliances installed', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Water efficient appliances — > 40 - 60% of water efficient appliances installed', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Water efficient appliances — > 60 - 80% of water efficient appliances installed', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Water efficient appliances — > 80% of water efficient appliances installed', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WR_4_5', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Consumption of treated water',
            description: 'Percentage of treated water consumed on campus.',
            items: [
                { item_number: '1', label: 'Treated water — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Treated water — 1% - 25% treated water consumed', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Treated water — > 25% - 50% treated water consumed', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Treated water — > 50% - 75% treated water consumed', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Treated water — > 75% treated water consumed', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WR_4_6', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Water pollution control in campus area',
            description: 'Status of water pollution control policies and programs in campus area.',
            items: [
                { item_number: '1', label: 'Water pollution — Policy and programs for water pollution control are in the designing stage', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Water pollution — Policy and programs for water pollution control are in the construction stage', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Water pollution — Policy and programs for water pollution control are in the early implementation stage', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Water pollution — Policy and programs for water pollution control are fully implemented and monitored occasionally', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Water pollution — Policy and programs for water pollution control are fully implemented and monitored regularly', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'WR_4_7', gm_category: 'WR', theme: 'Water', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impact of Water Management programs in supporting the Sustainable Development Goals (SDGs)',
            description: 'Rate the impact of your water management programs in supporting the SDGs.',
            items: [
                { item_number: '1', label: 'SDG impact — Low impact (supporting 1-2 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'SDG impact — Moderate impact (supporting 3-5 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'SDG impact — Significant impact (supporting 6-9 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'SDG impact — High impact (supporting 10-13 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'SDG impact — Very high impact (supporting 14-17 SDGs)', answer_type: 'radio', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // TR — Transportation (5.1 – 5.18)
        // ════════════════════════════════════════════════════════
        {
            code: 'TR_5_1', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Number of cars actively used and managed by University',
            description: 'Total number of cars owned/managed by the university.',
            items: [{ item_number: '1', label: 'University cars', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_2', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Number of cars entering the university daily',
            description: 'Average number of cars entering the campus each day.',
            items: [{ item_number: '1', label: 'Daily cars entering', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_3', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Number of motorcycles entering the university daily',
            description: 'Average number of motorcycles entering the campus each day.',
            items: [{ item_number: '1', label: 'Daily motorcycles entering', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_4', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'The total number of vehicles (cars and motorcycles with combustion engines) divided by the total campus population — Formula: (5.1+5.2+5.3)/(1.12+1.14)',
            description: 'Ratio of total combustion engine vehicles to campus population.',
            items: [
                { item_number: '1', label: 'Vehicle ratio — >=1', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Vehicle ratio — > 0.5 - 1', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Vehicle ratio — > 0.125 - 0.5', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Vehicle ratio — > 0.045 - 0.125', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Vehicle ratio — < 0.045', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_5', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Shuttle service',
            description: 'Availability and type of shuttle service provided by or for the university.',
            items: [
                { item_number: '1', label: 'Shuttle — Shuttle service is possible but not provided by university', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Shuttle — Shuttle service is provided (by university or other parties) and regular but not free', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Shuttle — Shuttle service is provided (by university or other parties) and the university contributes a part of the cost.', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Shuttle — Shuttle service is provided by university, regular, and free', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Shuttle — Provided by university, regular, and zero emission vehicle. Or shuttle use is not applicable', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_6', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Number of shuttles operated in your university',
            description: 'Total number of shuttle vehicles operated by the university.',
            items: [{ item_number: '1', label: 'Number of shuttles', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_7', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Average number of passengers of each shuttle',
            description: 'Average passenger count per shuttle trip.',
            items: [{ item_number: '1', label: 'Average passengers per shuttle', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_8', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total trips of shuttle services each day',
            description: 'Total number of shuttle trips made each day.',
            items: [{ item_number: '1', label: 'Daily shuttle trips', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_9', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Zero Emission Vehicles (ZEV) policy on campus',
            description: 'Policy and availability of Zero Emission Vehicles on campus.',
            items: [
                { item_number: '1', label: 'ZEV policy — Zero Emission Vehicles are not available', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'ZEV policy — Zero Emission Vehicles use is not possible or practical', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'ZEV policy — Zero Emission Vehicles are available, but not provided by university', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'ZEV policy — Zero Emission Vehicles are available, and provided by university and charged', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'ZEV policy — Zero Emission Vehicles are available, and provided by university for free', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_10', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Average number of Zero Emission Vehicles (e.g. bicycles, cano, snowboard, electric car, etc.) on campus per day',
            description: 'Average daily count of zero emission vehicles on campus.',
            items: [{ item_number: '1', label: 'Average ZEVs per day', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_11', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'The total number of Zero Emission Vehicles (ZEV) divided by total campus population — Formula: ((5.10)/(1.12+1.14))',
            description: 'Ratio of zero emission vehicles to total campus population.',
            items: [
                { item_number: '1', label: 'ZEV ratio — <= 0.002', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'ZEV ratio — > 0.002 - 0.004', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'ZEV ratio — > 0.004 - 0.008', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'ZEV ratio — > 0.008 - 0.02', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'ZEV ratio — > 0.02', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_12', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total ground parking area (m²)',
            description: 'Total area of ground-level parking on campus in square meters.',
            items: [{ item_number: '1', label: 'Total parking area (m²)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_13', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Ratio of parking area to total campus area — Formula: ((5.12/1.5) x 100%)',
            description: 'Percentage of total campus area occupied by parking.',
            items: [
                { item_number: '1', label: 'Parking ratio — > 11%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Parking ratio — > 7 - 11%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Parking ratio — > 4 - 7%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Parking ratio — > 1 - 4%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Parking ratio — < 1%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_14', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Program to limit or decrease the parking area on campus for the last 3 years',
            description: 'Programs implemented to limit or reduce parking area on campus over the last 3 years.',
            items: [
                { item_number: '1', label: 'Parking reduction — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Parking reduction — Program in preparation (e.g. feasibility study and promotion)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Parking reduction — Less than 10% decrease', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Parking reduction — Between 10% - 30% decrease', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Parking reduction — Program resulting in more than 30% decrease in parking area or parking area reduction has reached its limit', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_15', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of initiatives to decrease private vehicles on campus',
            description: 'Number of initiatives implemented to reduce private vehicle use on campus.',
            items: [
                { item_number: '1', label: 'Private vehicle initiatives — No initiative', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Private vehicle initiatives — 1 initiative', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Private vehicle initiatives — 2 initiatives', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Private vehicle initiatives — 3 initiatives', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Private vehicle initiatives — > 3 initiatives, or initiative no longer required', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_16', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Pedestrian path on campus',
            description: 'Availability and quality of pedestrian paths on campus.',
            items: [
                { item_number: '1', label: 'Pedestrian path — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Pedestrian path — Pedestrian paths are available', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Pedestrian path — Pedestrian paths are available, and design for safety', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Pedestrian path — Pedestrian paths are available, designed for safety and convenience', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Pedestrian path — Pedestrian paths are available, designed for safety, convenience, and in some parts provided with disabled-friendly features', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'TR_5_17', gm_category: 'TR', theme: 'Transportation', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Approximate daily travel distance of a vehicle inside campus only (in Kilometers)',
            description: 'Average daily travel distance of a university vehicle within campus in kilometers. Put 0 (zero) if travel distance is not applicable.',
            items: [{ item_number: '1', label: 'Daily travel distance (km)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'TR_5_18', gm_category: 'TR', theme: 'Transportation', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impact of Transportation programs in supporting the Sustainable Development Goals (SDGs)',
            description: 'Rate the impact of your transportation programs in supporting the SDGs.',
            items: [
                { item_number: '1', label: 'SDG impact — Low impact (supporting 1-2 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'SDG impact — Moderate impact (supporting 3-5 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'SDG impact — Significant impact (supporting 6-9 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'SDG impact — High impact (supporting 10-13 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'SDG impact — Very high impact (supporting 14-17 SDGs)', answer_type: 'radio', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // ED — Education & Research (6.1 – 6.20)
        // ════════════════════════════════════════════════════════
        {
            code: 'ED_6_1', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Number of courses/subjects related to sustainability offered',
            description: 'Total number of courses or subjects related to sustainability offered by the university.',
            items: [{ item_number: '1', label: 'Sustainability courses offered', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_2', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total number of courses/subjects offered',
            description: 'Total number of all courses or subjects offered by the university.',
            items: [{ item_number: '1', label: 'Total courses offered', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_3', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total number of study program related to sustainability offered',
            description: 'Total number of study programs (degrees/majors) related to sustainability.',
            items: [{ item_number: '1', label: 'Sustainability study programs', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_4', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'The ratio of sustainability courses to total courses/subjects — Formula: ((6.1/6.2) x 100%)',
            description: 'Percentage of sustainability-related courses out of total courses offered.',
            items: [
                { item_number: '1', label: 'Sustainability ratio — <= 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Sustainability ratio — > 1 - 5%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Sustainability ratio — > 5 - 10%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Sustainability ratio — > 10 - 20%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Sustainability ratio — > 20%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'ED_6_5', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total research funds dedicated to sustainability research (in US Dollars) (average per annum over the last 3 years)',
            description: 'Average annual research funding dedicated to sustainability research over the last 3 years in USD.',
            items: [{ item_number: '1', label: 'Sustainability research funds (USD/year)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_6', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total research funds (in US Dollars) (average per annum over the last 3 years)',
            description: 'Total average annual research funding over the last 3 years in USD.',
            items: [{ item_number: '1', label: 'Total research funds (USD/year)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_7', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'The ratio of sustainability research funding to total research funding — Formula: ((6.5/6.6) x 100%)',
            description: 'Percentage of research funding dedicated to sustainability out of total research funding.',
            items: [
                { item_number: '1', label: 'Research funding ratio — <= 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Research funding ratio — > 1 - 10%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Research funding ratio — > 10 - 20%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Research funding ratio — > 20 - 40%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Research funding ratio — > 40%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'ED_6_8', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Number of lecturers and researchers on campus in one year period',
            description: 'Total number of academic lecturers and researchers active on campus in one academic year.',
            items: [{ item_number: '1', label: 'Lecturers and researchers', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_9', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Number of scholarly publications on sustainability in one year period',
            description: 'Total number of scholarly publications related to sustainability in one year.',
            items: [{ item_number: '1', label: 'Sustainability publications', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_10', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Ratio of scholarly publications on sustainability to lecturers and researchers on campus in one year period — Formula: (6.9/6.8)',
            description: 'Ratio of sustainability publications to total lecturers and researchers.',
            items: [
                { item_number: '1', label: 'Publication ratio — < 0.5', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Publication ratio — 0.5 - 1', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Publication ratio — > 1 - 2', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Publication ratio — > 2 - 3', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Publication ratio — > 3', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'ED_6_11', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of events related to sustainability (average annually for the past 3 years)',
            description: 'Average annual number of sustainability-related events held on campus over the past 3 years.',
            items: [
                { item_number: '1', label: ' 0', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Events number for 0', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' 1 - 5 events', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Events number for 1-5', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' 6 - 20 events', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Events number for 6-20', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' 21 - 50 events', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Events number for 21-50', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' > 50 events', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Events number for > 50', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'ED_6_12', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of activities organized by student organizations related to sustainability per year',
            description: 'Number of sustainability-related activities organized by student organizations per year.',
            items: [
                { item_number: '1', label: ' 0', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Student activities number for 0', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' 1 - 5 activities', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Student activities number for 1-5', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' 6 - 10 activities', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Student activities number for 6-10', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' 11 - 20 activities', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Student activities number for 11-20', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' > 20 activities', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Student activities number for > 20', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'ED_6_13', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of cultural activities on campus',
            description: 'Number of cultural activities organized on campus per year.',
            items: [
                { item_number: '1', label: ' None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Cultural activities number for None', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' 1 - 3 events per year', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Cultural activities number for 1-3', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' 4 - 6 events per year', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Cultural activities number for 4-6', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' 7 - 10 events per year', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Cultural activities number for 7-10', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' More than 10 events per year', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Cultural activities number for > 10', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'ED_6_14', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of university program(s) with international collaborations',
            description: 'Number of university programs that involve international collaborations.',
            items: [
                { item_number: '1', label: ' None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'International programs number for None', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' 1 - 3 programs per year', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'International programs number for 1-3', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' 4 - 6 programs per year', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'International programs number for 4-6', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' 7 - 10 programs per year', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'International programs number for 7-10', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' More than 10 programs per year', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'International programs number for > 10', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'ED_6_15', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of community services related to sustainability organized by university and involving students',
            description: 'Number of community service projects related to sustainability organized by the university with student involvement.',
            items: [
                { item_number: '1', label: ' None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Community services number for None', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' 1 - 3 projects per year', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Community services number for 1-3', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' 4 - 6 projects per year', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Community services number for 4-6', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' 7 - 10 projects per year', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Community services number for 7-10', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' More than 10 projects per year', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Community services number for > 10', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'ED_6_16', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Number of sustainability-related startups',
            description: 'Number of sustainability-related startups founded or supported by the university.',
            items: [
                { item_number: '1', label: ' None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Startups number for None', answer_type: 'number', max_words: null },
                { item_number: '3', label: ' 1 - 5 startups', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Startups number for 1-5', answer_type: 'number', max_words: null },
                { item_number: '5', label: ' 6 - 10 startups', answer_type: 'radio', max_words: null },
                { item_number: '6', label: 'Startups number for 6-10', answer_type: 'number', max_words: null },
                { item_number: '7', label: ' 11 - 15 startups', answer_type: 'radio', max_words: null },
                { item_number: '8', label: 'Startups number for 11-15', answer_type: 'number', max_words: null },
                { item_number: '9', label: ' > 15 startups', answer_type: 'radio', max_words: null },
                { item_number: '10', label: 'Startups number for > 15', answer_type: 'number', max_words: null },
            ]
        },
        {
            code: 'ED_6_17', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total number of graduates with green jobs (for the last 3 years)',
            description: 'Total number of graduates employed in green jobs over the last 3 years.',
            items: [{ item_number: '1', label: 'Graduates with green jobs', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_18', gm_category: 'ED', theme: 'Education & Research', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'Total number of graduates (for the last 3 years)',
            description: 'Total number of graduates from the university over the last 3 years.',
            items: [{ item_number: '1', label: 'Total graduates', answer_type: 'number', max_words: null }]
        },
        {
            code: 'ED_6_19', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Percentage of number of graduates with green jobs (for the last 3 years) — Formula: ((6.21/6.22) x 100%)',
            description: 'Percentage of graduates who obtained green jobs out of total graduates.',
            items: [
                { item_number: '1', label: 'Green jobs % — <= 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Green jobs % — > 1 - 5%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Green jobs % — > 5 - 10%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Green jobs % — > 10 - 20%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Green jobs % — > 20%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'ED_6_20', gm_category: 'ED', theme: 'Education & Research', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Impact of Education and Research programs in supporting the Sustainable Development Goals (SDGs)',
            description: 'Rate the impact of your education and research programs in supporting the SDGs.',
            items: [
                { item_number: '1', label: 'SDG impact — Low impact (supporting 1-2 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'SDG impact — Moderate impact (supporting 3-5 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'SDG impact — Significant impact (supporting 6-9 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'SDG impact — High impact (supporting 10-13 SDGs)', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'SDG impact — Very high impact (supporting 14-17 SDGs)', answer_type: 'radio', max_words: null },
            ]
        },

        // ════════════════════════════════════════════════════════
        // GD — Governance & Digitalization (7.1 – 7.21)
        // ════════════════════════════════════════════════════════
        {
            code: 'GD_7_1', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total university\'s budget (in US Dollars)',
            description: 'Total annual budget of the university in US Dollars.',
            items: [{ item_number: '1', label: 'Total university budget (USD)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'GD_7_2', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'number', is_synced: false, has_evidence: true,
            title: 'University\'s budget for sustainability effort (in US Dollars)',
            description: 'Portion of the university\'s annual budget allocated to sustainability efforts in US Dollars.',
            items: [{ item_number: '1', label: 'Sustainability budget (USD)', answer_type: 'number', max_words: null }]
        },
        {
            code: 'GD_7_3', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'Percentage of University\'s budget for sustainability effort — Formula: ((1.17/1.16) x 100%)',
            description: 'Percentage of the total university budget dedicated to sustainability.',
            items: [
                { item_number: '1', label: 'Sustainability budget % — <= 1%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Sustainability budget % — > 1 - 5%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Sustainability budget % — > 5 - 10%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Sustainability budget % — > 10 - 15%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Sustainability budget % — > 15%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_4', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: false,
            title: 'University-run sustainability website',
            description: 'Availability and status of a university-run sustainability website.',
            items: [
                { item_number: '1', label: 'Sustainability website — Not available', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Sustainability website — Website in progress or under construction', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Sustainability website — Website is available and accessible', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Sustainability website — Website is available, accessible, and updated occasionally', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Sustainability website — Website is available, accessible, and updated regularly', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_5', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'url', is_synced: false, has_evidence: false,
            title: 'Sustainability website address (URL) if available',
            description: 'URL of the university sustainability website if available.',
            items: [{ item_number: '1', label: 'Sustainability website URL', answer_type: 'url', max_words: null }]
        },
        {
            code: 'GD_7_6', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Sustainability report',
            description: 'Availability and publication frequency of the university sustainability report.',
            items: [
                { item_number: '1', label: 'Sustainability report — Not available', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Sustainability report — Sustainability report is in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Sustainability report — Available but not publicly accessible', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Sustainability report — Sustainability report is accessible and published occasionally', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Sustainability report — Sustainability report is accessible and published annually', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_7', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'url', is_synced: false, has_evidence: false,
            title: 'Sustainability report link address (URL) if available',
            description: 'URL of the sustainability report if available.',
            items: [{ item_number: '1', label: 'Sustainability report URL', answer_type: 'url', max_words: null }]
        },
        {
            code: 'GD_7_8', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Financial report',
            description: 'Availability and publication frequency of the university financial report.',
            items: [
                { item_number: '1', label: 'Financial report — Not available', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Financial report — Financial report is in preparation', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Financial report — Available but not publicly accessible', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Financial report — Financial report is accessible and published occasionally', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Financial report — Financial report is accessible and published annually', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_9', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'url', is_synced: false, has_evidence: false,
            title: 'Financial report link address (URL) if available',
            description: 'URL of the financial report if available.',
            items: [{ item_number: '1', label: 'Financial report URL', answer_type: 'url', max_words: null }]
        },
        {
            code: 'GD_7_10', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Availability of units or offices that coordinate or are related to sustainability',
            description: 'Availability and operational status of sustainability coordination units or offices.',
            items: [
                { item_number: '1', label: 'Sustainability unit — Ad-hoc / task force', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Sustainability unit — Unit(s) or office(s) in development', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Sustainability unit — Unit(s) or office(s) with university leader decree of establishment, structure and duties at early stage', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Sustainability unit — Unit(s) or office(s) with university leader decree of establishment, structure and duties has been operational', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Sustainability unit — Unit(s) or office(s) with university leader decree of establishment, structure and duties has been operational and lead the university implementation of sustainability', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_11', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Number of dedicated staff members assigned to the unit or office responsible for coordinating sustainability initiatives on campus',
            description: 'Total number of staff dedicated to sustainability coordination.',
            items: [{ item_number: '1', label: 'Dedicated sustainability staff', answer_type: 'number', max_words: null }]
        },
        {
            code: 'GD_7_12', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Use of ICT for sustainability program planning, implementation, monitoring and evaluation',
            description: 'Status of ICT use for sustainability program management.',
            items: [
                { item_number: '1', label: 'ICT for sustainability — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'ICT for sustainability — The program is currently in the planning stage', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'ICT for sustainability — Program has been implemented', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'ICT for sustainability — Program has been implemented and evaluated', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'ICT for sustainability — Program has been implemented, evaluated, and is currently revised', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_13', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Use of advanced digital technologies, such as Artificial Intelligence and Internet of Things, to support decision-making, operational efficiency, and service delivery across university administrative and academic business processes',
            description: 'Level of implementation of advanced digital technologies (AI, IoT) across university operations.',
            items: [
                { item_number: '1', label: 'AI/IoT implementation — No policy', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'AI/IoT implementation — Initial adoption of policy, Limited policy implementation in specific units', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'AI/IoT implementation — Partial implementation. Policy is used in several administrative or academic processes but are not integrated institution-wide', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'AI/IoT implementation — Broad implementation. Policy is integrated across multiple administrative and academic functions and support routine decision-making and service delivery', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'AI/IoT implementation — Advanced and integrated implementation. Policy implemented institution-wide, systematically support strategic decision-making, operational optimization, and service delivery, and are continuously evaluated and improved', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_14', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Compliance with the General Data Protection Regulation (GDPR) or Equivalent National Data Protection Regulations',
            description: 'Level of compliance with data protection regulations.',
            items: [
                { item_number: '1', label: 'Data protection — No data protection policy or mechanism is in place', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Data protection — Compliance framework is in preparation, including draft policies or procedures', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Data protection — Compliance is partially implemented, with policies in place but limited enforcement or coverage', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Data protection — Compliance is fully implemented, monitored, and applied across most university units and digital systems', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Data protection — Compliance is fully implemented, regularly audited, continuously improved, and transparently communicated to stakeholders', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_15', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Total Number of Institutional Leaders and Deputy Leaders at University, Faculty, Study Program, and University-Level Units',
            description: 'Total number of institutional leaders and deputy leaders across all levels.',
            items: [{ item_number: '1', label: 'Total institutional leaders', answer_type: 'number', max_words: null }]
        },
        {
            code: 'GD_7_16', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'number', is_synced: false, has_evidence: false,
            title: 'Number of Female Representation on Leadership Position at University, Faculty, Study Program, and University-Level Units',
            description: 'Number of females in leadership positions across all levels of the institution.',
            items: [{ item_number: '1', label: 'Female leaders', answer_type: 'number', max_words: null }]
        },
        {
            code: 'GD_7_17', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Ratio of Female Leaders to Total Institutional Leaders',
            description: 'Ratio of female leaders to total institutional leaders.',
            items: [
                { item_number: '1', label: 'Female leader ratio — <= 5%', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Female leader ratio — > 5 - 20%', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Female leader ratio — > 20 - 35%', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Female leader ratio — > 35 - 50%', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Female leader ratio — > 50%', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_18', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Anti-Corruption and Integrity System of the University',
            description: 'Status of anti-corruption and integrity systems at the university.',
            items: [
                { item_number: '1', label: 'Anti-corruption — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Anti-corruption — The anti-corruption and integrity system is currently in the planning stage', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Anti-corruption — The anti-corruption and integrity system has been implemented', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Anti-corruption — The anti-corruption and integrity system has been implemented and evaluated', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Anti-corruption — The anti-corruption and integrity system has been implemented, evaluated, and is currently revised', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_19', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Whistle Blowing and Complaint System of the University',
            description: 'Status of whistle blowing and complaint systems at the university.',
            items: [
                { item_number: '1', label: 'Whistle blowing — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Whistle blowing — Whistle blowing and complaint system is currently in the planning stage', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Whistle blowing — Whistle blowing and complaint system has been implemented', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Whistle blowing — Whistle blowing and complaint system has been implemented and evaluated', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Whistle blowing — Whistle blowing and complaint system has been implemented, evaluated, and is currently revised', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_20', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Implementation of Digital Literacy programs at the University',
            description: 'Status of digital literacy program implementation at the university.',
            items: [
                { item_number: '1', label: 'Digital literacy — None', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Digital literacy — The program is currently in the planning stage', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Digital literacy — Program has been implemented', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Digital literacy — Program has been implemented and evaluated', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Digital literacy — Program has been implemented, evaluated, and is currently revised', answer_type: 'radio', max_words: null },
            ]
        },
        {
            code: 'GD_7_21', gm_category: 'GD', theme: 'Governance & Digitalization', question_type: 'radio', is_synced: false, has_evidence: true,
            title: 'Written Code of Ethics that applies to university leaders, academic staff, administrative staff, and students',
            description: 'Status of a written Code of Ethics at the university.',
            items: [
                { item_number: '1', label: 'Code of Ethics — No written Code of Ethics is available', answer_type: 'radio', max_words: null },
                { item_number: '2', label: 'Code of Ethics — A Code of Ethics is in preparation or draft form', answer_type: 'radio', max_words: null },
                { item_number: '3', label: 'Code of Ethics — A written Code of Ethics is formally established but applies only to certain groups or is not consistently enforced', answer_type: 'radio', max_words: null },
                { item_number: '4', label: 'Code of Ethics — A written Code of Ethics applies to all groups and is implemented and monitored', answer_type: 'radio', max_words: null },
                { item_number: '5', label: 'Code of Ethics — A written Code of Ethics applies to all groups, is fully implemented, regularly reviewed, and actively enforced through institutional mechanisms', answer_type: 'radio', max_words: null },
            ]
        },
    ];

    // ── Add columns if they don't exist ──────────────────────────
    try {
        await db.execute({ sql: `ALTER TABLE questions ADD COLUMN gm_category TEXT`, args: [] });
        console.log('Added gm_category column');
    } catch (e) {
        console.log('gm_category column already exists');
    }

    try {
        await db.execute({ sql: `ALTER TABLE questions ADD COLUMN has_evidence INTEGER DEFAULT 0`, args: [] });
        console.log('Added has_evidence column');
    } catch (e) {
        console.log('has_evidence column already exists');
    }

    let questionCount = 0;
    let itemCount = 0;

    for (const q of questions) {
        const result = await db.execute({
            sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, is_synced, gm_category, has_evidence)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [CYCLE_ID, q.code, q.title, q.description, q.question_type, q.theme, q.is_synced ? 1 : 0, q.gm_category, q.has_evidence ? 1 : 0]
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
        console.log(`  ✓ [${q.gm_category}] ${q.code} — ${q.title.slice(0, 55)}... (evidence: ${q.has_evidence})`);
    }

    console.log(`\nDone! ${questionCount} questions and ${itemCount} items seeded for GreenMetric.`);
    process.exit(0);
}

seedGreenMetric().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});